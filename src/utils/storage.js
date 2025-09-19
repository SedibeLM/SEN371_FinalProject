import { supabase } from './supabase';

// --- NEW AUTH FUNCTIONS ---

/**
 * Signs up a new user, and creates corresponding entries in User and Student/Tutor tables.
 * Note: Supabase may require email confirmation. You can disable this in your Supabase project settings for easier testing.
 */
export async function registerUser(user) {
  // Step 1: Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role, // Custom data stored in auth.users
      }
    }
  });

  if (authError) {
    return { ok: false, msg: authError.message };
  }

  if (!authData.user) {
    return { ok: false, msg: "Signup successful, but no user data returned. Please check your email for verification." };
  }

  const auth_id = authData.user.id;

  // Step 2: Insert into the public "User" table
  const { error: userError } = await supabase.from('User').insert({
      auth_id: auth_id,
      email: user.email,
      user_type: user.role.toLowerCase()
  });

  if (userError) {
    // Optional: Consider deleting the auth user if this part fails
    return { ok: false, msg: `User created in auth, but failed to save to database: ${userError.message}` };
  }

  // Step 3: Insert into "Student" or "Tutor" table
  if (user.role.toLowerCase() === 'student') {
    const { error: studentError } = await supabase.from('Student').insert({
      auth_id: auth_id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      programme: 'Not Specified', // Placeholder
      year_of_study: 1 // Placeholder
    });
    if (studentError) {
      return { ok: false, msg: `Failed to create student profile: ${studentError.message}` };
    }
  } else if (user.role.toLowerCase() === 'tutor') {
    const { error: tutorError } = await supabase.from('Tutor').insert({
      auth_id: auth_id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      staff_code: `TUT-${Date.now()}` // Placeholder for unique staff code
    });
    if (tutorError) {
      return { ok: false, msg: `Failed to create tutor profile: ${tutorError.message}` };
    }
  }

  return { ok: true, data: authData };
}


/**
 * Logs in a user. The user session is automatically managed by the Supabase client library.
 */
export async function loginUser(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return !error;
}

/**
 * Logs out the current user.
 */
export async function logout() {
  await supabase.auth.signOut();
}

/**
 * Gets the currently authenticated user from the session.
 */
export async function getAuthUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Gets the full profile of the currently authenticated user (student or tutor).
 */
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData, error: userError } = await supabase
    .from('User')
    .select('user_type')
    .eq('auth_id', user.id)
    .single();

  if (userError || !userData) {
    console.error('Error fetching user role:', userError?.message);
    return null;
  }

  const { user_type } = userData;
  const profileTable = user_type === 'student' ? 'Student' : 'Tutor';

  const { data: profileData, error: profileError } = await supabase
    .from(profileTable)
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (profileError) {
    console.error(`Error fetching ${user_type} profile:`, profileError.message);
    return null;
  }

  return { ...profileData, role: user_type };
}


export async function getModules() {
  const { data, error } = await supabase.from('Module').select('*');
  if (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
  return data;
}

export async function getModule(moduleId) {
  if (!moduleId) return null;
  const { data, error } = await supabase.from('Module').select('*').eq('module_id', moduleId).single();
  if (error) {
    console.error('Error fetching module:', error);
    return null;
  }
  return data;
}

export async function addModule(module) {
  const { data, error } = await supabase.from('Module').insert(module).select();
  if (error) {
    return { ok: false, msg: error.message };
  }
  return { ok: true, data: data[0] };
}


export async function getTopics() {
  const { data, error } = await supabase.from('Topic').select('*');
  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
  return data;
}
export const listTopics = getTopics; // Alias

export async function getTopicsByModule(moduleId) {
  if (!moduleId) return [];
  const { data, error } = await supabase.from('Topic').select('*').eq('module_id', moduleId);
  if (error) {
    console.error('Error fetching topics by module:', error);
    return [];
  }
  return data;
}

export async function createTopic(topic) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, msg: 'You must be logged in to create a topic.' };

  const { data, error } = await supabase.from('Topic').insert({
    title: topic.title,
    module_id: topic.moduleId,
    tutor_id: user.id
  }).select();

  if (error) {
    return { ok: false, msg: error.message };
  }
  return { ok: true, data: data[0] };
}


export async function getMaterialsByTopic(topicId) {
  if (!topicId) return [];
  const { data, error } = await supabase.from('LearningMaterial').select('*').eq('topic_id', topicId);
  if (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
  return data;
}

export async function addMaterial(material) {
  const { data, error } = await supabase.from('LearningMaterial').insert({
    title: material.title,
    type: material.kind,
    url_ref: material.url,
    topic_id: material.topicId
  }).select();

  if (error) {
    return { ok: false, msg: error.message };
  }
  return { ok: true, data: data[0] };
}

export const uploadMaterial = addMaterial; // Alias

export async function createQuiz(quiz) {
  const { data, error } = await supabase.from('Quiz').insert(quiz).select();
  if (error) {
    return { ok: false, msg: error.message };
  }
  return { ok: true, data: data[0] };
}

export async function getQuizzesByTopic(topicId) {
  if (!topicId) return [];
  const { data, error } = await supabase.from('Quiz').select('*').eq('topic_id', topicId);
  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
  return data;
}

export async function getQuiz(quizId) {
  if (!quizId) return null;
  const { data, error } = await supabase.from('Quiz').select('*').eq('quiz_id', quizId).single();
  if (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
  return data;
}

// --- THREADS & POSTS (PUBLIC FORUM) ---

export async function getThreadsByTopic(topicId) {
  if (!topicId) return [];
  const { data, error } = await supabase.from('Thread').select('*').eq('topic_id', topicId);
  if (error) {
    console.error('Error fetching threads:', error);
    return [];
  }
  return data;
}

export async function createThread(thread) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, msg: 'You must be logged in to create a thread.' };

    const { data, error } = await supabase.from('Thread').insert({
        ...thread,
        created_by: user.id
    }).select();

    if (error) {
        return { ok: false, msg: error.message };
    }
    return { ok: true, data: data[0] };
}

export async function getThread(threadId) {
  if (!threadId) return null;
  const { data, error } = await supabase.from('Thread').select('*').eq('thread_id', threadId).single();
  if (error) {
    console.error('Error fetching thread:', error);
    return null;
  }
  return data;
}

export async function getPostsByThread(threadId) {
  if (!threadId) return [];
  // Fetch posts and the user's email
  const { data, error } = await supabase
    .from('Post')
    .select(`
      *,
      author:User(email)
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

export async function createPost(post) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, msg: 'You must be logged in to post.' };

    const { data, error } = await supabase.from('Post').insert({
        ...post,
        user_id: user.id
    }).select();

    if (error) {
        return { ok: false, msg: error.message };
    }
    return { ok: true, data: data[0] };
}

// --- PRIVATE MESSAGES ---

export async function getConversations(userId) {
    if (!userId) return [];
    const { data, error } = await supabase.rpc('get_conversations', { user_id_input: userId });
    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
    return data;
}

export async function getPrivateMessages(conversationKey) {
    if (!conversationKey) return [];
    const [user1, user2, topicId] = conversationKey.split('_');
    const { data, error } = await supabase
        .from('PrivateMessage')
        .select('*, sender:User(email), recipient:User(email)')
        .eq('topic_id', topicId)
        .in('sender_id', [user1, user2])
        .in('recipient_id', [user1, user2])
        .order('sent_at', { ascending: true });

    if (error) {
        console.error('Error fetching private messages:', error);
        return [];
    }
    return data;
}

export async function sendPrivateMessage(message) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, msg: 'You must be logged in to send a message.' };

    const { data, error } = await supabase.from('PrivateMessage').insert({
        ...message,
        sender_id: user.id
    }).select();

    if (error) {
        return { ok: false, msg: error.message };
    }
    return { ok: true, data: data[0] };
}

// --- SUBSCRIPTIONS ---

export async function getSubscription(topicId, studentId) {
  if (!topicId || !studentId) return null;
  const { data, error } = await supabase
    .from('Subscription')
    .select('*')
    .eq('topic_id', topicId)
    .eq('student_id', studentId)
    .single();
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching subscription:', error);
  }
  return data;
}

export async function subscribeToTopic(topicId, studentId) {
  if (!topicId || !studentId) return { ok: false, msg: 'Topic ID and Student ID are required.' };
  const { data, error } = await supabase.from('Subscription').insert({
    topic_id: topicId,
    student_id: studentId
  }).select();

  if (error) {
    return { ok: false, msg: error.message };
  }
  return { ok: true, data: data[0] };
}

export async function unsubscribeFromTopic(subscriptionId) {
  if (!subscriptionId) return { ok: false, msg: 'Subscription ID is required.' };
  const { error } = await supabase.from('Subscription').delete().eq('subscription_id', subscriptionId);
  if (error) {
    return { ok: false, msg: error.message };
  }
  return { ok: true };
}

export async function getSubscriptionsByUser(studentId) {
    if (!studentId) return [];
    const { data, error } = await supabase
        .from('Subscription')
        .select('*, topic:Topic(*)')
        .eq('student_id', studentId);
    if (error) {
        console.error('Error fetching user subscriptions:', error);
        return [];
    }
    return data;
}
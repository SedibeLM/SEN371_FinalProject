import { createClient } from '@supabase/supabase-js';

// It's recommended to use environment variables for these in a real project
const supabaseUrl = 'https://kbdtaupvuzgkbspyauzy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZHRhdXB2dXpna2JzcHlhdXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5Mjk2MjUsImV4cCI6MjA3MjUwNTYyNX0.2XpLaaj6XljCZpp64l7FDGBauDcG8vYFD1M5HQYymm0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

package com.campuslearn.service;

import com.campuslearn.model.Topic;
import com.campuslearn.model.TopicStatus;
import com.campuslearn.repository.TopicRepository;
import org.springframework.stereotype.Service;

@Service
public class TopicService {
    private final TopicRepository topicRepository;

    public TopicService(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    public String createTopic(String title, String moduleId, String status, String role) {
        // Validate role has permission to create topics
        if (!(role.equals("instructor") || role.equals("admin"))) {
            throw new SecurityException("Only instructors and admins can create topics");
        }

        // Check if topic with same title in the same module already exists
        if (topicRepository.existsByTitleAndModuleId(title, moduleId)) {
            throw new IllegalArgumentException("A topic with this title already exists in the module");
        }

        // Create and save the new topic
        Topic topic = new Topic();
        topic.setTitle(title);
        topic.setModuleId(moduleId);
        
        try {
            topic.setStatus(TopicStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid topic status: " + status);
        }

        topicRepository.save(topic);
        return "Topic created successfully";
    }
}

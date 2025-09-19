package com.campuslearn.model;

import jakarta.persistence.*;

@Entity
@Table(name = "topics")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "module_id", nullable = false)
    private String moduleId;
    
    @Enumerated(EnumType.STRING)
    private TopicStatus status;
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getModuleId() {
        return moduleId;
    }
    
    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }
    
    public TopicStatus getStatus() {
        return status;
    }
    
    public void setStatus(TopicStatus status) {
        this.status = status;
    }
}

enum TopicStatus {
    OPEN, CLOSED, DRAFT
}

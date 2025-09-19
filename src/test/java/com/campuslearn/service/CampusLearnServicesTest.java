package com.campuslearn.service;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CampusLearnServicesTest {

    // ===== TopicService =====
    @Nested
    class TopicServiceTests {
        private TopicRepository topicRepository;
        private TopicService topicService;

        @BeforeEach
        void setUp() {
            topicRepository = mock(TopicRepository.class);
            topicService = new TopicService(topicRepository);
        }

        @ParameterizedTest
        @CsvSource({
            "instructor, OPEN",
            "admin,      CLOSED"
        })
        void createTopic_ValidRolesAndStatuses_Save(String role, String status) {
            when(topicRepository.existsByTitleAndModuleId("Math", "MOD1")).thenReturn(false);

            String result = topicService.createTopic("Math", "MOD1", status, role);

            assertEquals("Topic created successfully", result);
            verify(topicRepository).save(any(Topic.class));
        }

        @Test
        void createTopic_DuplicateTitle_ThrowsAndNoSave() {
            when(topicRepository.existsByTitleAndModuleId("Math", "MOD1")).thenReturn(true);

            assertThrows(IllegalArgumentException.class,
                () -> topicService.createTopic("Math", "MOD1", "OPEN", "instructor"));

            verify(topicRepository, never()).save(any());
        }
    }

    // ===== SubscriptionService =====
    @Nested
    class SubscriptionServiceTests {
        private SubscriptionRepository subscriptionRepository;
        private SubscriptionService subscriptionService;

        @BeforeEach
        void setUp() {
            subscriptionRepository = mock(SubscriptionRepository.class);
            subscriptionService = new SubscriptionService(subscriptionRepository);
        }
        
        // Add your test methods here
    }
}

package com.campuslearn.service;

import com.campuslearn.model.Subscription;
import com.campuslearn.model.SubscriptionStatus;
import com.campuslearn.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    public String subscribeUser(String userId, Long topicId) {
        // Check if user is already subscribed to this topic
        if (subscriptionRepository.existsByUserIdAndTopicId(userId, topicId)) {
            throw new IllegalStateException("User is already subscribed to this topic");
        }

        // Create new subscription
        Subscription subscription = new Subscription();
        subscription.setUserId(userId);
        subscription.setTopicId(topicId);
        subscription.setSubscribedAt(LocalDateTime.now());
        subscription.setStatus(SubscriptionStatus.ACTIVE);

        subscriptionRepository.save(subscription);
        return "Successfully subscribed to topic";
    }

    public String unsubscribeUser(String userId, Long topicId) {
        // Implementation would find and update the subscription status
        // For now, just return a success message
        return "Successfully unsubscribed from topic";
    }
}

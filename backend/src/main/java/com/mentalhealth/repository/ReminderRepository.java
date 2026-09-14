package com.mentalhealth.repository;

import com.mentalhealth.model.Reminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReminderRepository extends MongoRepository<Reminder, String> {
    List<Reminder> findByUserIdOrderByScheduledTimeAsc(String userId);
}
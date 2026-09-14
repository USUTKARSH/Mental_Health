package com.mentalhealth.repository;

import com.mentalhealth.model.HabitLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface HabitLogRepository extends MongoRepository<HabitLog, String> {
    List<HabitLog> findByUserIdOrderByLogDateDesc(String userId);
    List<HabitLog> findByUserIdAndHabitType(String userId, String habitType);
    List<HabitLog> findByUserIdAndLogDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
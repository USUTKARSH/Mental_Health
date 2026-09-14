package com.mentalhealth.repository;

import com.mentalhealth.model.MoodEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface MoodEntryRepository extends MongoRepository<MoodEntry, String> {
    List<MoodEntry> findByUserIdOrderByEntryDateDesc(String userId);
    List<MoodEntry> findByUserIdAndEntryDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
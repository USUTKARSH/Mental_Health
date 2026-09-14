package com.mentalhealth.repository;

import com.mentalhealth.model.JournalEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JournalEntryRepository extends MongoRepository<JournalEntry, String> {
    List<JournalEntry> findByUserIdOrderByCreatedAtDesc(String userId);
}
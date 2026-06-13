package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "mood_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoodEntry {
    
    @Id
    private String id;
    
    private String userId;
    private Integer moodScore;  // 1-10 scale
    private String emotion;  // happy, sad, anxious, stressed, calm, etc.
    private String intensity;  // low, medium, high
    private String trigger;  // optional trigger description
    private String notes;
    private LocalDate entryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

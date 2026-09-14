package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "journal_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalEntry {
    
    @Id
    private String id;
    
    private String userId;
    private String title;
    private String content;
    private Integer moodScoreAtTime;  // mood when writing
    private String detectedSentiment;  // AI-detected sentiment
    private Double sentimentScore;  // -1 to 1 scale
    private String[] detectedEmotions;  // Array of detected emotions
    private String[] suggestedPrompts;  // Related prompts for reflection
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

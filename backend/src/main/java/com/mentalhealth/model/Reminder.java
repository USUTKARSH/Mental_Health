package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reminders")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Reminder {
    @Id private String id;
    private String userId;
    private String title;
    private String message;
    private String reminderType;
    private Boolean recurring;
    private String recurrencePattern;
    private LocalDateTime scheduledTime;
    private Boolean sent;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
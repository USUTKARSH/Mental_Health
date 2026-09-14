package com.mentalhealth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "habit_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class HabitLog {
    @Id private String id;
    private String userId;
    private String habitType;
    private Integer value;
    private String unit;
    private String notes;
    private LocalDate logDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
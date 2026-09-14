package com.mentalhealth.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MoodEntryRequest {
    private Integer moodScore;
    private String emotion;
    private String intensity;
    private String trigger;
    private String notes;
    private LocalDate entryDate;
}
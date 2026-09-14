package com.mentalhealth.dto;

import lombok.Data;

@Data
public class JournalEntryRequest {
    private String title;
    private String content;
    private Integer moodScoreAtTime;
}
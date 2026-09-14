package com.mentalhealth.dto;

import lombok.Data;

@Data
public class ReminderRequest {
    private String title;
    private String message;
    private String reminderType;
    private Boolean recurring;
    private String recurrencePattern;
    private String scheduledTime;
}
package com.mentalhealth.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HabitLogRequest {
    private String habitType;
    private Integer value;
    private String unit;
    private String notes;
    private LocalDate logDate;
}
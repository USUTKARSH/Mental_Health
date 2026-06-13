package com.mentalhealth.service;

import com.mentalhealth.dto.HabitLogRequest;
import com.mentalhealth.model.HabitLog;
import com.mentalhealth.repository.HabitLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class HabitService {
    
    @Autowired
    private HabitLogRepository habitLogRepository;
    
    public HabitLog addHabitLog(String userId, HabitLogRequest request) {
        log.info("Adding habit log for user: {} - type: {}", userId, request.getHabitType());
        
        LocalDate logDate = request.getLogDate() != null ? request.getLogDate() : LocalDate.now();
        
        HabitLog habitLog = HabitLog.builder()
                .userId(userId)
                .habitType(request.getHabitType())
                .value(request.getValue())
                .unit(request.getUnit())
                .notes(request.getNotes())
                .logDate(logDate)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        HabitLog saved = habitLogRepository.save(habitLog);
        log.info("Habit log added successfully for user: {}", userId);
        return saved;
    }
    
    public HabitLog updateHabitLog(String userId, String logId, HabitLogRequest request) {
        log.info("Updating habit log: {} for user: {}", logId, userId);
        
        HabitLog habitLog = habitLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Habit log not found"));
        
        if (!habitLog.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        habitLog.setHabitType(request.getHabitType());
        habitLog.setValue(request.getValue());
        habitLog.setUnit(request.getUnit());
        habitLog.setNotes(request.getNotes());
        habitLog.setUpdatedAt(LocalDateTime.now());
        
        return habitLogRepository.save(habitLog);
    }
    
    public List<HabitLog> getUserHabitLogs(String userId) {
        log.info("Fetching habit logs for user: {}", userId);
        return habitLogRepository.findByUserIdOrderByLogDateDesc(userId);
    }
    
    public List<HabitLog> getHabitLogsByType(String userId, String habitType) {
        log.info("Fetching habit logs for user: {} - type: {}", userId, habitType);
        return habitLogRepository.findByUserIdAndHabitType(userId, habitType);
    }
    
    public List<HabitLog> getHabitLogsByDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching habit logs for user: {} between {} and {}", userId, startDate, endDate);
        return habitLogRepository.findByUserIdAndLogDateBetween(userId, startDate, endDate);
    }
    
    public HabitLog getHabitLog(String userId, String logId) {
        HabitLog log = habitLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Habit log not found"));
        
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return log;
    }
    
    public void deleteHabitLog(String userId, String logId) {
        log.info("Deleting habit log: {} for user: {}", logId, userId);
        
        HabitLog log = habitLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Habit log not found"));
        
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        habitLogRepository.deleteById(logId);
    }
}

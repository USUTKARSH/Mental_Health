package com.mentalhealth.service;

import com.mentalhealth.dto.ReminderRequest;
import com.mentalhealth.model.Reminder;
import com.mentalhealth.repository.ReminderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
public class ReminderService {
    
    @Autowired
    private ReminderRepository reminderRepository;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    public Reminder addReminder(String userId, ReminderRequest request) {
        log.info("Adding reminder for user: {}", userId);
        
        LocalDateTime scheduledTime = LocalDateTime.parse(request.getScheduledTime(), formatter);
        
        Reminder reminder = Reminder.builder()
                .userId(userId)
                .title(request.getTitle())
                .message(request.getMessage())
                .reminderType(request.getReminderType())
                .recurring(request.getRecurring() != null ? request.getRecurring() : false)
                .recurrencePattern(request.getRecurrencePattern())
                .scheduledTime(scheduledTime)
                .sent(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Reminder saved = reminderRepository.save(reminder);
        log.info("Reminder added successfully for user: {}", userId);
        return saved;
    }
    
    public Reminder updateReminder(String userId, String reminderId, ReminderRequest request) {
        log.info("Updating reminder: {} for user: {}", reminderId, userId);
        
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
        
        if (!reminder.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        LocalDateTime scheduledTime = LocalDateTime.parse(request.getScheduledTime(), formatter);
        
        reminder.setTitle(request.getTitle());
        reminder.setMessage(request.getMessage());
        reminder.setReminderType(request.getReminderType());
        reminder.setRecurring(request.getRecurring());
        reminder.setRecurrencePattern(request.getRecurrencePattern());
        reminder.setScheduledTime(scheduledTime);
        reminder.setUpdatedAt(LocalDateTime.now());
        
        return reminderRepository.save(reminder);
    }
    
    public List<Reminder> getUserReminders(String userId) {
        log.info("Fetching reminders for user: {}", userId);
        return reminderRepository.findByUserIdOrderByScheduledTimeAsc(userId);
    }
    
    public Reminder getReminder(String userId, String reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
        
        if (!reminder.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return reminder;
    }
    
    public void deleteReminder(String userId, String reminderId) {
        log.info("Deleting reminder: {} for user: {}", reminderId, userId);
        
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
        
        if (!reminder.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        reminderRepository.deleteById(reminderId);
    }
    
    public void markAsSent(String reminderId) {
        log.info("Marking reminder as sent: {}", reminderId);
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
        reminder.setSent(true);
        reminder.setSentAt(LocalDateTime.now());
        reminderRepository.save(reminder);
    }
}

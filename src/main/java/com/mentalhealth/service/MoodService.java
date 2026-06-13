package com.mentalhealth.service;

import com.mentalhealth.dto.MoodEntryRequest;
import com.mentalhealth.model.MoodEntry;
import com.mentalhealth.repository.MoodEntryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class MoodService {
    
    @Autowired
    private MoodEntryRepository moodEntryRepository;
    
    public MoodEntry addMoodEntry(String userId, MoodEntryRequest request) {
        log.info("Adding mood entry for user: {}", userId);
        
        LocalDate entryDate = request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now();
        
        MoodEntry moodEntry = MoodEntry.builder()
                .userId(userId)
                .moodScore(request.getMoodScore())
                .emotion(request.getEmotion())
                .intensity(request.getIntensity())
                .trigger(request.getTrigger())
                .notes(request.getNotes())
                .entryDate(entryDate)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        MoodEntry saved = moodEntryRepository.save(moodEntry);
        log.info("Mood entry added successfully for user: {}", userId);
        return saved;
    }
    
    public MoodEntry updateMoodEntry(String userId, String entryId, MoodEntryRequest request) {
        log.info("Updating mood entry: {} for user: {}", entryId, userId);
        
        MoodEntry moodEntry = moodEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));
        
        if (!moodEntry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        moodEntry.setMoodScore(request.getMoodScore());
        moodEntry.setEmotion(request.getEmotion());
        moodEntry.setIntensity(request.getIntensity());
        moodEntry.setTrigger(request.getTrigger());
        moodEntry.setNotes(request.getNotes());
        moodEntry.setUpdatedAt(LocalDateTime.now());
        
        return moodEntryRepository.save(moodEntry);
    }
    
    public List<MoodEntry> getUserMoodEntries(String userId) {
        log.info("Fetching mood entries for user: {}", userId);
        return moodEntryRepository.findByUserIdOrderByEntryDateDesc(userId);
    }
    
    public List<MoodEntry> getMoodEntriesByDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching mood entries for user: {} between {} and {}", userId, startDate, endDate);
        return moodEntryRepository.findByUserIdAndEntryDateBetween(userId, startDate, endDate);
    }
    
    public MoodEntry getMoodEntry(String userId, String entryId) {
        MoodEntry entry = moodEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));
        
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return entry;
    }
    
    public void deleteMoodEntry(String userId, String entryId) {
        log.info("Deleting mood entry: {} for user: {}", entryId, userId);
        
        MoodEntry entry = moodEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Mood entry not found"));
        
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        moodEntryRepository.deleteById(entryId);
    }
}

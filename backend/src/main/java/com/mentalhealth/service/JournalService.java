package com.mentalhealth.service;

import com.mentalhealth.ai.AiService;
import com.mentalhealth.dto.JournalEntryRequest;
import com.mentalhealth.model.JournalEntry;
import com.mentalhealth.repository.JournalEntryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class JournalService {
    
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    
    @Autowired
    private AiService aiService;
    
    public JournalEntry addJournalEntry(String userId, JournalEntryRequest request) {
        log.info("Adding journal entry for user: {}", userId);
        
        // Call AI service for sentiment analysis
        String sentiment = aiService.analyzeSentiment(request.getContent());
        Double sentimentScore = aiService.getSentimentScore(request.getContent());
        String[] detectedEmotions = aiService.detectEmotions(request.getContent());
        String[] suggestedPrompts = aiService.generateJournalingPrompts(request.getContent());
        
        JournalEntry journalEntry = JournalEntry.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .moodScoreAtTime(request.getMoodScoreAtTime())
                .detectedSentiment(sentiment)
                .sentimentScore(sentimentScore)
                .detectedEmotions(detectedEmotions)
                .suggestedPrompts(suggestedPrompts)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        JournalEntry saved = journalEntryRepository.save(journalEntry);
        log.info("Journal entry added successfully for user: {}", userId);
        return saved;
    }
    
    public JournalEntry updateJournalEntry(String userId, String entryId, JournalEntryRequest request) {
        log.info("Updating journal entry: {} for user: {}", entryId, userId);
        
        JournalEntry journalEntry = journalEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));
        
        if (!journalEntry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        // Re-analyze sentiment for updated content
        String sentiment = aiService.analyzeSentiment(request.getContent());
        Double sentimentScore = aiService.getSentimentScore(request.getContent());
        String[] detectedEmotions = aiService.detectEmotions(request.getContent());
        
        journalEntry.setTitle(request.getTitle());
        journalEntry.setContent(request.getContent());
        journalEntry.setMoodScoreAtTime(request.getMoodScoreAtTime());
        journalEntry.setDetectedSentiment(sentiment);
        journalEntry.setSentimentScore(sentimentScore);
        journalEntry.setDetectedEmotions(detectedEmotions);
        journalEntry.setUpdatedAt(LocalDateTime.now());
        
        return journalEntryRepository.save(journalEntry);
    }
    
    public List<JournalEntry> getUserJournalEntries(String userId) {
        log.info("Fetching journal entries for user: {}", userId);
        return journalEntryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public JournalEntry getJournalEntry(String userId, String entryId) {
        JournalEntry entry = journalEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));
        
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        return entry;
    }
    
    public void deleteJournalEntry(String userId, String entryId) {
        log.info("Deleting journal entry: {} for user: {}", entryId, userId);
        
        JournalEntry entry = journalEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));
        
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        journalEntryRepository.deleteById(entryId);
    }
}

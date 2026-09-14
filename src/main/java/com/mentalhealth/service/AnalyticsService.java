package com.mentalhealth.service;

import com.mentalhealth.ai.AiService;
import com.mentalhealth.model.HabitLog;
import com.mentalhealth.model.MoodEntry;
import com.mentalhealth.repository.HabitLogRepository;
import com.mentalhealth.repository.MoodEntryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
public class AnalyticsService {
    
    @Autowired
    private MoodEntryRepository moodEntryRepository;
    
    @Autowired
    private HabitLogRepository habitLogRepository;
    
    @Autowired
    private AiService aiService;
    
    /**
     * Get weekly mood statistics
     */
    public Map<String, Object> getWeeklyStats(String userId) {
        log.info("Calculating weekly stats for user: {}", userId);
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        
        List<MoodEntry> moodEntries = moodEntryRepository.findByUserIdAndEntryDateBetween(userId, startDate, endDate);
        
        if (moodEntries.isEmpty()) {
            stats.put("averageMood", 0);
            stats.put("entries", 0);
            stats.put("trend", "NO_DATA");
            stats.put("moodScores", new ArrayList<>());
            return stats;
        }
        
        double averageMood = moodEntries.stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0);
        
        List<Integer> moodScores = moodEntries.stream()
                .map(MoodEntry::getMoodScore)
                .toList();
        
        String trend = calculateMoodTrend(moodScores);
        
        stats.put("averageMood", String.format("%.2f", averageMood));
        stats.put("entries", moodEntries.size());
        stats.put("trend", trend);
        stats.put("moodScores", moodScores);
        
        return stats;
    }
    
    /**
     * Get mood trends over specified period
     */
    public Map<String, Object> getMoodTrends(String userId, LocalDate startDate, LocalDate endDate) {
        log.info("Calculating mood trends for user: {} from {} to {}", userId, startDate, endDate);
        Map<String, Object> trends = new HashMap<>();
        
        List<MoodEntry> moodEntries = moodEntryRepository.findByUserIdAndEntryDateBetween(userId, startDate, endDate);
        
        List<Integer> dailyAverages = new ArrayList<>();
        Map<LocalDate, Double> moodByDate = new TreeMap<>();
        
        for (MoodEntry entry : moodEntries) {
            moodByDate.put(entry.getEntryDate(), (double) entry.getMoodScore());
        }
        
        dailyAverages.addAll(moodByDate.values().stream().map(Double::intValue).toList());
        
        double overallAverage = moodByDate.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);
        
        trends.put("overallAverage", String.format("%.2f", overallAverage));
        trends.put("dailyAverages", dailyAverages);
        trends.put("moodByDate", moodByDate);
        trends.put("totalEntries", moodEntries.size());
        
        return trends;
    }
    
    /**
     * Analyze habit correlation with mood
     */
    public Map<String, Object> analyzeHabitCorrelation(String userId) {
        log.info("Analyzing habit correlation for user: {}", userId);
        Map<String, Object> correlation = new HashMap<>();
        
        LocalDate now = LocalDate.now();
        LocalDate weekAgo = now.minusDays(7);
        
        List<HabitLog> habitLogs = habitLogRepository.findByUserIdAndLogDateBetween(userId, weekAgo, now);
        List<MoodEntry> moodEntries = moodEntryRepository.findByUserIdAndEntryDateBetween(userId, weekAgo, now);
        
        Map<String, Double> habitAverages = new HashMap<>();
        
        // Calculate average values for each habit type
        for (String habitType : extractHabitTypes(habitLogs)) {
            double average = habitLogs.stream()
                    .filter(log -> log.getHabitType().equals(habitType))
                    .mapToInt(HabitLog::getValue)
                    .average()
                    .orElse(0);
            habitAverages.put(habitType, average);
        }
        
        double averageMood = moodEntries.stream()
                .mapToInt(MoodEntry::getMoodScore)
                .average()
                .orElse(0);
        
        correlation.put("habitAverages", habitAverages);
        correlation.put("averageMood", String.format("%.2f", averageMood));
        correlation.put("insights", generateHabitInsights(habitAverages, averageMood));
        
        return correlation;
    }
    
    /**
     * Detect mood triggers
     */
    public Map<String, Object> detectTriggers(String userId) {
        log.info("Detecting mood triggers for user: {}", userId);
        Map<String, Object> triggers = new HashMap<>();
        
        List<MoodEntry> moodEntries = moodEntryRepository.findByUserIdOrderByEntryDateDesc(userId);
        Map<String, Integer> triggerFrequency = new HashMap<>();
        
        for (MoodEntry entry : moodEntries) {
            if (entry.getTrigger() != null && !entry.getTrigger().isEmpty()) {
                triggerFrequency.merge(entry.getTrigger(), 1, Integer::sum);
            }
        }
        
        // Sort by frequency
        List<Map.Entry<String, Integer>> sortedTriggers = triggerFrequency.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .toList();
        
        triggers.put("frequentTriggers", sortedTriggers.stream()
                .limit(5)
                .map(Map.Entry::getKey)
                .toList());
        triggers.put("triggerFrequency", triggerFrequency);
        
        return triggers;
    }
    
    /**
     * Generate comprehensive analytics dashboard
     */
    public Map<String, Object> getDashboard(String userId) {
        log.info("Generating dashboard analytics for user: {}", userId);
        Map<String, Object> dashboard = new HashMap<>();
        
        LocalDate now = LocalDate.now();
        
        dashboard.put("weeklyStats", getWeeklyStats(userId));
        dashboard.put("moodTrends", getMoodTrends(userId, now.minusDays(30), now));
        dashboard.put("habitCorrelation", analyzeHabitCorrelation(userId));
        dashboard.put("triggers", detectTriggers(userId));
        dashboard.put("weeklyInsights", aiService.generateWeeklyInsights(userId));
        
        return dashboard;
    }
    
    // ==================== Helper Methods ====================
    
    private String calculateMoodTrend(List<Integer> moodScores) {
        if (moodScores.size() < 2) return "INSUFFICIENT_DATA";
        
        double firstHalf = moodScores.stream().limit(moodScores.size() / 2).mapToInt(Integer::intValue).average().orElse(5);
        double secondHalf = moodScores.stream().skip(moodScores.size() / 2).mapToInt(Integer::intValue).average().orElse(5);
        
        if (secondHalf > firstHalf + 0.5) return "IMPROVING";
        if (secondHalf < firstHalf - 0.5) return "DECLINING";
        return "STABLE";
    }
    
    private Set<String> extractHabitTypes(List<HabitLog> habitLogs) {
        Set<String> types = new HashSet<>();
        for (HabitLog log : habitLogs) {
            types.add(log.getHabitType());
        }
        return types;
    }
    
    private List<String> generateHabitInsights(Map<String, Double> habitAverages, double averageMood) {
        List<String> insights = new ArrayList<>();
        
        habitAverages.forEach((habit, average) -> {
            if ("sleep".equals(habit) && average < 7) {
                insights.add("Your sleep average is below recommended 7-9 hours. Better sleep may improve mood.");
            }
            if ("exercise".equals(habit) && average < 30) {
                insights.add("Consider increasing exercise time (30+ mins daily) for better mental health.");
            }
            if ("meditation".equals(habit) && average > 0) {
                insights.add("Good job maintaining meditation practice! Keep it up.");
            }
        });
        
        return insights;
    }
}

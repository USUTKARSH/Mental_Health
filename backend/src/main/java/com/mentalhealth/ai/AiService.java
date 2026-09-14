package com.mentalhealth.ai;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {
    public String analyzeSentiment(String content) {
        double score = getSentimentScore(content);
        if (score > 0.2) return "POSITIVE";
        if (score < -0.2) return "NEGATIVE";
        return "NEUTRAL";
    }

    public Double getSentimentScore(String content) {
        if (content == null || content.isBlank()) return 0d;
        String value = content.toLowerCase();
        String[] positive = {"happy", "good", "great", "calm", "love", "grateful", "excited", "peaceful"};
        String[] negative = {"sad", "bad", "angry", "anxious", "stress", "stressed", "hate", "lonely", "tired"};
        int score = 0;
        for (String word : positive) if (value.contains(word)) score++;
        for (String word : negative) if (value.contains(word)) score--;
        return Math.max(-1d, Math.min(1d, score / 5d));
    }

    public String[] detectEmotions(String content) {
        if (content == null) return new String[0];
        String value = content.toLowerCase();
        ArrayList<String> emotions = new ArrayList<>();
        if (value.contains("anxious") || value.contains("worry")) emotions.add("anxious");
        if (value.contains("sad") || value.contains("lonely")) emotions.add("sad");
        if (value.contains("angry")) emotions.add("angry");
        if (value.contains("happy") || value.contains("grateful")) emotions.add("happy");
        return emotions.toArray(String[]::new);
    }

    public String[] generateJournalingPrompts(String content) {
        return new String[]{"What helped you feel supported today?", "What would you like to carry into tomorrow?"};
    }

    public Map<String, Object> generateWeeklyInsights(String userId) {
        Map<String, Object> insights = new HashMap<>();
        insights.put("summary", "Keep checking in with your mood and habits to discover patterns.");
        insights.put("recommendations", new String[]{"Take a short mindful break", "Write down one thing you are grateful for"});
        return insights;
    }
}
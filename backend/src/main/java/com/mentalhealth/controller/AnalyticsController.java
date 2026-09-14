package com.mentalhealth.controller;

import com.mentalhealth.repository.UserRepository;
import com.mentalhealth.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController extends BaseController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService, UserRepository users) { super(users); this.analyticsService = analyticsService; }
    @GetMapping("/weekly") public Map<String, Object> weekly(Authentication auth) { return analyticsService.getWeeklyStats(userId(auth)); }
    @GetMapping("/trends") public Map<String, Object> trends(Authentication auth, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return analyticsService.getMoodTrends(userId(auth), startDate, endDate); }
    @GetMapping("/habit-correlation") public Map<String, Object> habitCorrelation(Authentication auth) { return analyticsService.analyzeHabitCorrelation(userId(auth)); }
    @GetMapping("/triggers") public Map<String, Object> triggers(Authentication auth) { return analyticsService.detectTriggers(userId(auth)); }
    @GetMapping("/dashboard") public Map<String, Object> dashboard(Authentication auth) { return analyticsService.getDashboard(userId(auth)); }
}
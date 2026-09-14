package com.mentalhealth.controller;

import com.mentalhealth.dto.MoodEntryRequest;
import com.mentalhealth.model.MoodEntry;
import com.mentalhealth.repository.UserRepository;
import com.mentalhealth.service.MoodService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/mood")
public class MoodController extends BaseController {
    private final MoodService moodService;
    public MoodController(MoodService moodService, UserRepository users) { super(users); this.moodService = moodService; }

    @PostMapping public MoodEntry create(Authentication auth, @RequestBody MoodEntryRequest request) { return moodService.addMoodEntry(userId(auth), request); }
    @GetMapping public List<MoodEntry> list(Authentication auth) { return moodService.getUserMoodEntries(userId(auth)); }
    @GetMapping("/{id}") public MoodEntry get(Authentication auth, @PathVariable String id) { return moodService.getMoodEntry(userId(auth), id); }
    @PutMapping("/{id}") public MoodEntry update(Authentication auth, @PathVariable String id, @RequestBody MoodEntryRequest request) { return moodService.updateMoodEntry(userId(auth), id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Authentication auth, @PathVariable String id) { moodService.deleteMoodEntry(userId(auth), id); }
    @GetMapping("/range") public List<MoodEntry> range(Authentication auth, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return moodService.getMoodEntriesByDateRange(userId(auth), startDate, endDate); }
}
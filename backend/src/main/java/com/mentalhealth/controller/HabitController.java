package com.mentalhealth.controller;

import com.mentalhealth.dto.HabitLogRequest;
import com.mentalhealth.model.HabitLog;
import com.mentalhealth.repository.UserRepository;
import com.mentalhealth.service.HabitService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController extends BaseController {
    private final HabitService habitService;
    public HabitController(HabitService habitService, UserRepository users) { super(users); this.habitService = habitService; }
    @PostMapping public HabitLog create(Authentication auth, @RequestBody HabitLogRequest request) { return habitService.addHabitLog(userId(auth), request); }
    @GetMapping public List<HabitLog> list(Authentication auth) { return habitService.getUserHabitLogs(userId(auth)); }
    @GetMapping("/{id}") public HabitLog get(Authentication auth, @PathVariable String id) { return habitService.getHabitLog(userId(auth), id); }
    @PutMapping("/{id}") public HabitLog update(Authentication auth, @PathVariable String id, @RequestBody HabitLogRequest request) { return habitService.updateHabitLog(userId(auth), id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Authentication auth, @PathVariable String id) { habitService.deleteHabitLog(userId(auth), id); }
    @GetMapping("/type/{habitType}") public List<HabitLog> type(Authentication auth, @PathVariable String habitType) { return habitService.getHabitLogsByType(userId(auth), habitType); }
    @GetMapping("/range") public List<HabitLog> range(Authentication auth, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return habitService.getHabitLogsByDateRange(userId(auth), startDate, endDate); }
}
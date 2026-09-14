package com.mentalhealth.controller;

import com.mentalhealth.dto.ReminderRequest;
import com.mentalhealth.model.Reminder;
import com.mentalhealth.repository.UserRepository;
import com.mentalhealth.service.ReminderService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController extends BaseController {
    private final ReminderService reminderService;
    public ReminderController(ReminderService reminderService, UserRepository users) { super(users); this.reminderService = reminderService; }
    @PostMapping public Reminder create(Authentication auth, @RequestBody ReminderRequest request) { return reminderService.addReminder(userId(auth), request); }
    @GetMapping public List<Reminder> list(Authentication auth) { return reminderService.getUserReminders(userId(auth)); }
    @GetMapping("/{id}") public Reminder get(Authentication auth, @PathVariable String id) { return reminderService.getReminder(userId(auth), id); }
    @PutMapping("/{id}") public Reminder update(Authentication auth, @PathVariable String id, @RequestBody ReminderRequest request) { return reminderService.updateReminder(userId(auth), id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Authentication auth, @PathVariable String id) { reminderService.deleteReminder(userId(auth), id); }
}
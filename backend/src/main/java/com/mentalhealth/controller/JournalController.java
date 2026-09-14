package com.mentalhealth.controller;

import com.mentalhealth.dto.JournalEntryRequest;
import com.mentalhealth.model.JournalEntry;
import com.mentalhealth.repository.UserRepository;
import com.mentalhealth.service.JournalService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalController extends BaseController {
    private final JournalService journalService;
    public JournalController(JournalService journalService, UserRepository users) { super(users); this.journalService = journalService; }
    @PostMapping public JournalEntry create(Authentication auth, @RequestBody JournalEntryRequest request) { return journalService.addJournalEntry(userId(auth), request); }
    @GetMapping public List<JournalEntry> list(Authentication auth) { return journalService.getUserJournalEntries(userId(auth)); }
    @GetMapping("/{id}") public JournalEntry get(Authentication auth, @PathVariable String id) { return journalService.getJournalEntry(userId(auth), id); }
    @PutMapping("/{id}") public JournalEntry update(Authentication auth, @PathVariable String id, @RequestBody JournalEntryRequest request) { return journalService.updateJournalEntry(userId(auth), id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(Authentication auth, @PathVariable String id) { journalService.deleteJournalEntry(userId(auth), id); }
}
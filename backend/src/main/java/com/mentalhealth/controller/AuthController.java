package com.mentalhealth.controller;

import com.mentalhealth.dto.AuthRequest;
import com.mentalhealth.dto.AuthResponse;
import com.mentalhealth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "https://mental-health-wheat.vercel.app",
    "http://localhost:3000"
})
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @GetMapping("/")
    public ResponseEntity<String> root() { return ResponseEntity.ok("MindCare API is running"); }

    @GetMapping("/health")
    public ResponseEntity<String> health() { return ResponseEntity.ok("MindCare API is healthy"); }

    @PostMapping("/register")
    public AuthResponse register(@RequestParam String email, @RequestParam String username,
                                 @RequestParam String firstName, @RequestParam String lastName,
                                 @RequestParam String password) {
        return authService.register(email, username, firstName, lastName, password);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) { return authService.login(request); }
}

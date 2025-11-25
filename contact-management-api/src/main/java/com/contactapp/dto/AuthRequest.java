package com.contactapp.dto;

import org.springframework.stereotype.Component;

import jakarta.validation.constraints.NotBlank;

public class AuthRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    private String email; // for signup
    
//    @NotBlank(message = "select the option ")
//    private String securityQuestion ;
//    
//    @NotBlank(message = "Answer is required")
//    private String securityAnswer;

    // Constructors
    public AuthRequest() {}

    public AuthRequest(String username, String password) {
        this.username = username;
        this.password = password;

    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    
    
    
    
//    here is new code 
//    
//    public String getSecurityQuestion() { return securityQuestion;}
//    
//    public void setSecurityQuestion(String securityQuestion) {this.securityQuestion = securityQuestion;}
//    
//    public String getSecurityAnswer() {  return securityAnswer;}
//    
//    public void setSecurityAnswer(String securityAnswer) { this.securityAnswer = securityAnswer;}
//    
    
    
    
    
    
    
    
    
    
    
}
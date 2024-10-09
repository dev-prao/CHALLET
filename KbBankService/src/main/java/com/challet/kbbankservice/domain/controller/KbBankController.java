package com.challet.kbbankservice.domain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kb-bank-service")
public class KbBankController {
    
    //개발 시 지우기
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to KB-Bank Service";
    }
}

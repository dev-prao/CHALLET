package com.challet.nhbankservicedemo.domain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/nh-bank-service")
public class NhBankController {
    
    //개발 시 지우기
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to NH-Bank Service";
    }
}

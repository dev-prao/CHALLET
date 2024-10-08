package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.CertificateRequestDTO;
import com.challet.challetservice.domain.dto.request.CheckDuplicateRequestDTO;
import com.challet.challetservice.domain.dto.request.SmsRequestDTO;
import com.challet.challetservice.domain.dto.request.UserLoginRequestDTO;
import com.challet.challetservice.domain.dto.request.UserRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.CheckDuplicateResponseDTO;
import com.challet.challetservice.domain.dto.response.LoginResponseDTO;
import com.challet.challetservice.domain.dto.response.TokenRefreshResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    LoginResponseDTO signup(UserRegisterRequestDTO request, HttpServletResponse response);

    TokenRefreshResponseDTO refreshToken(HttpServletRequest request);

    LoginResponseDTO login(UserLoginRequestDTO request, HttpServletResponse response);

    CheckDuplicateResponseDTO checkDuplicate(CheckDuplicateRequestDTO request);

    void sendSms(SmsRequestDTO request);

    Boolean certificate(CertificateRequestDTO request);

    boolean checkPassword(String token, String password);
}

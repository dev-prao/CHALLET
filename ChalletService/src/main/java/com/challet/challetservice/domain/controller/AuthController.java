package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.TokenRefreshRequestDTO;
import com.challet.challetservice.domain.dto.request.UserLoginRequestDTO;
import com.challet.challetservice.domain.dto.request.UserRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.TokenRefreshResponseDTO;
import com.challet.challetservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/challet-service/auth")
@Tag(name = "AuthController", description = "인증 컨트롤러 - 토큰 없이 요청 가능")
public class AuthController {

    @Operation(summary = "회원가입", description = "회원정보를 입력하여 회원가입")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "회원가입 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserRegisterRequestDTO request){
        return null;
    }


    @Operation(summary = "로그인", description = "가입한 전화번호와 비밀번호를 입력하여 로그인")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400", description = "로그인 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginRequestDTO request){
        return null;
    }

    @Operation(summary = "토큰 재발급", description = "리프레시 토큰을 입력 받아 액세스 토큰 재발급")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
            @ApiResponse(responseCode = "400", description = "토큰 재발급 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponseDTO> refresh(@RequestBody TokenRefreshRequestDTO request){
        return null;
    }

}

package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.UserUpdateNicknameRequestDTO;
import com.challet.challetservice.domain.dto.request.UserUpdateProfileRequestDTO;
import com.challet.challetservice.domain.dto.response.MyRewardListResponseDTO;
import com.challet.challetservice.domain.dto.response.RewardDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;
import com.challet.challetservice.domain.service.UserService;
import com.challet.challetservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/challet/users")
@RequiredArgsConstructor
@Tag(name = "UserController", description = "회원 관련 컨트롤러 - Authorize 필수")
public class UserController {

    private final UserService userService;

    @Operation(summary = "로그인한 유저 정보 조회 (완료)", description = "헤더의 토큰을 통해 로그인한 유저 정보를 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "로그인 유저 정보 조회 성공"),
        @ApiResponse(responseCode = "400", description = "로그인 유저 정보 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })

    @GetMapping()
    public ResponseEntity<UserInfoResponseDTO> getUserInfo(
        @RequestHeader(value = "Authorization", required = false) String header) {
        UserInfoResponseDTO result = userService.getUserInfo(header);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(summary = "닉네임 수정 (완료)", description = "새 닉네임을 입력 받아 닉네임 수정")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "닉네임 수정 성공"),
        @ApiResponse(responseCode = "400", description = "닉네임 수정 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @PatchMapping("/nicknames")
    public ResponseEntity<String> updateNickname(
            @RequestHeader(value = "Authorization", required = false) String header,
            @RequestBody UserUpdateNicknameRequestDTO request) {
        userService.updateNickname(header, request);
        return ResponseEntity.status(HttpStatus.OK).body("success");
    }

    @Operation(summary = "프로필 이미지 수정 (완료)", description = "새 프로필 이미지를 입력 받아 프로필 이미지 수정")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "프로필 이미지 수정 성공"),
        @ApiResponse(responseCode = "400", description = "프로필 이미지 수정 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @PatchMapping("/profileImages")
    public ResponseEntity<String> updateProfileImage(
        @RequestHeader(value = "Authorization", required = false) String header,
        @RequestBody UserUpdateProfileRequestDTO request) {
        userService.updateProfileImage(header, request);
        return ResponseEntity.status(HttpStatus.OK).body("success");
    }

    @Operation(summary = "내 리워드 조회 (완료)", description = "내가 받은 리워드 리스트 조회(최근 획득한 리워드가 가장 앞순서에 오도록 정렬)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "내 리워드 조회 성공"),
        @ApiResponse(responseCode = "400", description = "내 리워드 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @GetMapping("/rewards")
    public ResponseEntity<MyRewardListResponseDTO> getRewards(
        @RequestHeader(value = "Authorization", required = false) String header) {
        MyRewardListResponseDTO myRewards = userService.getMyRewards(header);
        return ResponseEntity.status(HttpStatus.OK).body(myRewards);
    }

    @Operation(summary = "리워드 상세 정보 조회", description = "리워드ID로 해당 리워드 상세 정보 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "리워드 상세 정보 조회 성공"),
        @ApiResponse(responseCode = "400", description = "리워드 상세 정보 조회 실패"),
        @ApiResponse(responseCode = "401", description = "접근 권한 없음")
    })
    @Parameters(value = {
        @Parameter(name = "id", description = "리워드ID", in = ParameterIn.PATH)
    })
    @GetMapping("/rewards/{id}")
    public ResponseEntity<RewardDetailResponseDTO> getRewardById(
        @RequestHeader(value = "Authorization", required = false) String header, @PathVariable("id") Long id) {
        RewardDetailResponseDTO rewardDetail = userService.getRewardDetail(header, id);
        return ResponseEntity.status(HttpStatus.OK).body(rewardDetail);
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String header,
        HttpServletResponse response) {
        userService.logout(header, response);
        return ResponseEntity.status(HttpStatus.OK).body("로그아웃 성공");
    }


}

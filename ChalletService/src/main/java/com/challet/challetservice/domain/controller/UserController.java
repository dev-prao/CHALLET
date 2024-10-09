package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.response.MyRewadsListResponseDTO;
import com.challet.challetservice.domain.dto.response.RewardDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challet-service/users")
@Tag(name = "UserController", description = "회원 관련 컨트롤러 - Authorize 필수")
public class UserController {

    @Operation(summary = "로그인한 유저 정보 조회", description = "헤더의 토큰을 통해 로그인한 유저 정보를 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 유저 정보 조회 성공"),
            @ApiResponse(responseCode = "400", description = "로그인 유저 정보 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })

    @GetMapping()
    public ResponseEntity<UserInfoResponseDTO> getUser(@RequestHeader(value = "Authorization") String header) {
        return null;
    }

    @Operation(summary = "닉네임 수정", description = "새 닉네임을 입력 받아 닉네임 수정")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "닉네임 수정 성공"),
            @ApiResponse(responseCode = "400", description = "닉네임 수정 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @PatchMapping("/nicknames")
    public ResponseEntity<String> updateNickname(@RequestHeader(value = "Authorization") String header){
        return null;
    }

    @Operation(summary = "프로필 이미지 수정", description = "새 프로필 이미지를 입력 받아 프로필 이미지 수정")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로필 이미지 수정 성공"),
            @ApiResponse(responseCode = "400", description = "프로필 이미지 수정 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @PatchMapping("/profileImages")
    public ResponseEntity<String> updateProfileImage(@RequestHeader(value = "Authorization") String header){
        return null;
    }

    @Operation(summary = "내 리워드 조회", description = "내가 받은 리워드 리스트 조회(최근 획득한 리워드가 가장 앞순서에 오도록 정렬)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 리워드 조회 성공"),
            @ApiResponse(responseCode = "400", description = "내 리워드 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
            @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @GetMapping("/rewards")
    public ResponseEntity<List<MyRewadsListResponseDTO>> getRewards(@RequestHeader(value = "Authorization") String header){
        return null;
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
    public ResponseEntity<RewardDetailResponseDTO> getRewardById(@RequestHeader(value = "Authorization") String header, @PathVariable("id") String id){
        return null;
    }


}

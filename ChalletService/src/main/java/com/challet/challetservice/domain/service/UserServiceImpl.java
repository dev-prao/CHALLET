package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.UserUpdateNicknameRequestDTO;
import com.challet.challetservice.domain.dto.request.UserUpdateProfileRequestDTO;
import com.challet.challetservice.domain.dto.response.MyRewardInfoResponseDTO;
import com.challet.challetservice.domain.dto.response.MyRewardListResponseDTO;
import com.challet.challetservice.domain.dto.response.RewardDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.UserInfoMessageResponseDTO;
import com.challet.challetservice.domain.dto.response.UserInfoResponseDTO;
import com.challet.challetservice.domain.entity.Reward;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.entity.UserChallenge;
import com.challet.challetservice.domain.repository.RewardRepository;
import com.challet.challetservice.domain.repository.RewardRepositoryImpl;
import com.challet.challetservice.domain.repository.UserChallengeRepository;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RewardRepository rewardRepository;
    private final RewardRepositoryImpl rewardRepositoryImpl;
    private final UserChallengeRepository userChallengeRepository;

    @Override
    @Transactional(readOnly = true)
    public UserInfoResponseDTO getUserInfo(String header) {

        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        return UserInfoResponseDTO.fromUser(user);
    }

    @Override
    @Transactional
    public void updateNickname(String header, UserUpdateNicknameRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        user.updateNickname(request.nickname());
    }

    @Override
    @Transactional
    public void updateProfileImage(String header, UserUpdateProfileRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        user.updateProfileImage(request.profileImage());
    }

    @Override
    @Transactional(readOnly = true)
    public MyRewardListResponseDTO getMyRewards(String header) {

        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        List<MyRewardInfoResponseDTO> rewards = rewardRepositoryImpl.findMyRewards(user.getId()).stream()
            .map(MyRewardInfoResponseDTO::fromReward)
            .toList();
        return new MyRewardListResponseDTO(rewards);
    }

    @Override
    @Transactional(readOnly = true)
    public RewardDetailResponseDTO getRewardDetail(String header, Long id) {

        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        Reward reward = rewardRepository.findById(id)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_REWARD_EXCEPTION));

        if(!user.equals(reward.getUser())) {
            throw new ExceptionResponse(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        UserChallenge userChallenge = userChallengeRepository.findByChallengeAndUser(reward.getChallenge(), user)
            .orElseThrow(()-> new ExceptionResponse(CustomException.NOT_FOUND_JOIN_EXCEPTION));

        return RewardDetailResponseDTO.fromReward(reward, userChallenge);
    }

    @Override
    public UserInfoMessageResponseDTO getUserInfoMessage(String header) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        return userRepository.getUserInfoMessage(phoneNumber);
    }

    @Override
    @Transactional
    public void logout(String header, HttpServletResponse response) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));
        user.deleteRefreshToken();

        Cookie deleteCookie = new Cookie("refreshToken", null);
        deleteCookie.setMaxAge(0);
        deleteCookie.setPath("/");
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(true);

        response.addCookie(deleteCookie);

    }
}

package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ActionType;
import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.response.CommentListResponseDTO;
import com.challet.challetservice.domain.dto.response.EmojiReactionDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionDetailResponseDTO;
import com.challet.challetservice.domain.entity.Emoji;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.CommentRepositoryImpl;
import com.challet.challetservice.domain.repository.EmojiRepository;
import com.challet.challetservice.domain.repository.EmojiRepositoryImpl;
import com.challet.challetservice.domain.repository.SharedTransactionRepository;
import com.challet.challetservice.domain.repository.SharedTransactionRepositoryImpl;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SharedTransactionServiceImpl implements SharedTransactionService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SharedTransactionRepository sharedTransactionRepository;
    private final EmojiRepository emojiRepository;
    private final SharedTransactionRepositoryImpl sharedTransactionRepositoryImpl;
    private final CommentRepositoryImpl commentRepositoryImpl;
    private final EmojiRepositoryImpl emojiRepositoryImpl;

    @Override
    @Transactional
    public EmojiReactionDTO handleEmoji(String header,
        EmojiRequestDTO request) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        SharedTransaction sharedTransaction = sharedTransactionRepository.findById(
                request.sharedTransactionId())
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SHARED_TRANSACTION_EXCEPTION));

        EmojiReactionDTO response = null;

        if(request.action().equals(ActionType.ADD)){
            addEmoji(user, sharedTransaction, request);
            response = emojiRepositoryImpl.getEmojiReaction(sharedTransaction.getId(), user);
        }

        if(request.action().equals(ActionType.DELETE)){
            deleteEmoji(user, sharedTransaction);
            response = emojiRepositoryImpl.getEmojiReaction(sharedTransaction.getId(), user);
        }

        if (request.action().equals(ActionType.UPDATE)) {
            emojiRepository.findByUserAndSharedTransaction(user, sharedTransaction)
                .ifPresent(emoji -> emoji.updateEmoji(request.type()));
            response = emojiRepositoryImpl.getEmojiReaction(sharedTransaction.getId(), user);
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public SharedTransactionDetailResponseDTO getDetail(String header, Long id) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        SharedTransaction sharedTransaction = sharedTransactionRepository.findById(id)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SHARED_TRANSACTION_EXCEPTION));


        return sharedTransactionRepositoryImpl.getDetail(sharedTransaction, user);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentListResponseDTO getComment(String header, Long id) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        userRepository.findByPhoneNumber(loginUserPhoneNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

        SharedTransaction sharedTransaction = sharedTransactionRepository.findById(id)
            .orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_SHARED_TRANSACTION_EXCEPTION));

        return commentRepositoryImpl.getCommentList(sharedTransaction);
    }

    @Transactional
    public void addEmoji(User user, SharedTransaction sharedTransaction, EmojiRequestDTO request){
        Emoji emoji = Emoji.createEmoji(user, sharedTransaction, request.type());
        emojiRepository.save(emoji);
    }

    @Transactional
    public void deleteEmoji(User user, SharedTransaction sharedTransaction){
        emojiRepository.findByUserAndSharedTransaction(user, sharedTransaction)
            .ifPresent(emojiRepository::delete);
    }
}

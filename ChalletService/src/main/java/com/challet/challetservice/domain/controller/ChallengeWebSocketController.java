package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.request.EmojiRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.response.EmojiReactionDTO;
import com.challet.challetservice.domain.dto.response.EmojiResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionRegisterResponseDTO;
import com.challet.challetservice.domain.service.ChallengeService;
import com.challet.challetservice.domain.service.SharedTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Tag(name = "ChallengeWebSocketController", description = "챌린지 관련 웹소켓 요청")
public class ChallengeWebSocketController {

    private final ChallengeService challengeService;
    private final SharedTransactionService sharedTransactionService;

    @MessageMapping("/challenges/{id}/shared-transactions")
    @SendTo("/topic/challenges/{id}/shared-transactions")
    public SharedTransactionRegisterResponseDTO registerTransaction(StompHeaderAccessor headerAccessor, @DestinationVariable Long id, SharedTransactionRegisterRequestDTO request) {
        return challengeService.handleSharedTransaction(headerAccessor.getFirstNativeHeader("Authorization"),id, request);
    }


    @MessageMapping("/challenges/{id}/emoji")
    @SendTo("/topic/challenges/{id}/emoji")
    public EmojiReactionDTO handleEmoji (StompHeaderAccessor headerAccessor, @DestinationVariable Long id, EmojiRequestDTO request) {
        return sharedTransactionService.handleEmoji(headerAccessor.getFirstNativeHeader("Authorization"), request);
    }
}

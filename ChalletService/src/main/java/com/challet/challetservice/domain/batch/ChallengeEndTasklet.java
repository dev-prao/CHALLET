package com.challet.challetservice.domain.batch;

import com.challet.challetservice.domain.elasticsearch.repository.SearchedChallengeRepository;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.Reward;
import com.challet.challetservice.domain.entity.SearchedChallenge;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.entity.UserChallenge;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.RewardRepository;
import com.challet.challetservice.domain.repository.SharedTransactionRepository;
import com.challet.challetservice.domain.repository.UserChallengeRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
@RequiredArgsConstructor
public class ChallengeEndTasklet implements Tasklet {

    private final ChallengeRepository challengeRepository;
    private final SharedTransactionRepository sharedTransactionRepository;
    private final UserChallengeRepository userChallengeRepository;
    private final RewardRepository rewardRepository;
    private final SearchedChallengeRepository searchedChallengeRepository;

    @Override
    @Transactional
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext)
        throws Exception {

        List<Challenge> challenges = challengeRepository.getChallengesToEnd(LocalDate.now());
        for (Challenge challenge : challenges) {
            // 챌린지 마감처리
            challenge.endChallenge();

            // 챌린지 거래내역 삭제
            List<SharedTransaction> sharedTransactions = sharedTransactionRepository.findByChallengeIdWithLock(
                challenge.getId());
            sharedTransactionRepository.deleteAll(sharedTransactions);
            log.info("{} Challenge ended", challenge.getId());

            // 챌린지 리워드 지급
            List<UserChallenge> userChallenges = userChallengeRepository.findByChallenge(challenge);
            for (UserChallenge userChallenge : userChallenges) {
                User user = userChallenge.getUser();

                if (userChallenge.getSpendingAmount() > challenge.getSpendingLimit()){
                    Reward reward = Reward.builder()
                        .challenge(challenge)
                        .user(user)
                        .type(false)
                        .build();
                    rewardRepository.save(reward);
                    log.info("{} User got fail reward", userChallenge.getId());
                }

                else {
                    Reward reward = Reward.builder()
                        .challenge(challenge)
                        .user(user)
                        .type(true)
                        .build();
                    rewardRepository.save(reward);
                    log.info("{} User got success reward", userChallenge.getId());
                }
            }
        }

        List<SearchedChallenge> searchedChallenges = searchedChallengeRepository.findByEndDateBeforeAndStatus(LocalDate.now(), "PROGRESSING");
        for (SearchedChallenge searchedChallenge : searchedChallenges) {
            SearchedChallenge endSearchedChallenge = SearchedChallenge.builder()
                .challengeId(searchedChallenge.challengeId())
                .status("END")
                .category(searchedChallenge.category())
                .title(searchedChallenge.title())
                .spendingLimit(searchedChallenge.spendingLimit())
                .startDate(searchedChallenge.startDate())
                .endDate(searchedChallenge.endDate())
                .maxParticipants(searchedChallenge.maxParticipants())
                .currentParticipants(searchedChallenge.currentParticipants())
                .isPublic(searchedChallenge.isPublic())
                .build();
            searchedChallengeRepository.save(endSearchedChallenge);
        }

        return RepeatStatus.FINISHED;
    }
}

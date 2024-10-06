package com.challet.challetservice.domain.scheduler;

import com.challet.challetservice.domain.elasticsearch.repository.SearchedChallengeRepository;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.SearchedChallenge;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChallengeStartScheduler {

    private final ChallengeRepository challengeRepository;
    private final SearchedChallengeRepository searchedChallengeRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void startChallenge() {

        List<Challenge> challenges = challengeRepository.getChallengesToStart(LocalDate.now());
        for(Challenge challenge : challenges) {
            challenge.startChallenge();
            log.info("{} Challenge started", challenge.getId());
        }
        challengeRepository.saveAll(challenges);

        List<SearchedChallenge> searchedChallenges = searchedChallengeRepository.findByStartDateAndStatus(LocalDate.now(), "RECRUITING");
        for(SearchedChallenge searchedChallenge : searchedChallenges) {
            SearchedChallenge startSearchedChallenge = SearchedChallenge.builder()
                .challengeId(searchedChallenge.challengeId())
                .status("PROGRESSING")
                .category(searchedChallenge.category())
                .title(searchedChallenge.title())
                .spendingLimit(searchedChallenge.spendingLimit())
                .startDate(searchedChallenge.startDate())
                .endDate(searchedChallenge.endDate())
                .maxParticipants(searchedChallenge.maxParticipants())
                .currentParticipants(searchedChallenge.currentParticipants())
                .isPublic(searchedChallenge.isPublic())
                .build();
            searchedChallengeRepository.save(startSearchedChallenge);
        }

    }

}

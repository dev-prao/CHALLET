package com.challet.challetservice.domain.elasticsearch.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.challet.challetservice.domain.entity.SearchedChallenge;

public interface SearchedChallengeRepository
	extends ElasticsearchRepository<SearchedChallenge, Long> {

	Page<SearchedChallenge> findByStatusAndCategoryAndTitleContaining(String status,
		String category, String title, Pageable pageable);

	Page<SearchedChallenge> findByStatusAndTitleContaining(String status, String title,
		Pageable pageable);

	Page<SearchedChallenge> findByStatusAndCategoryContaining(String status, String category,
		Pageable pageable);

	Page<SearchedChallenge> findByStatusContaining(String status, Pageable pageable);

	List<SearchedChallenge> findByStatusAndCategoryAndTitleContaining(String status,
		String category,
		String title);

	List<SearchedChallenge> findByStatusAndTitleContaining(String status, String title);

	List<SearchedChallenge> findByStatusAndCategoryContaining(String status, String category);

	List<SearchedChallenge> findByStatusContaining(String status);

	List<SearchedChallenge> findByStartDateAndStatus(LocalDate startDate, String status);

	List<SearchedChallenge> findByEndDateBeforeAndStatus(LocalDate today, String status);
}


package com.challet.challetservice.domain.service;

import com.challet.challetservice.domain.dto.request.ChallengeJoinRequestDTO;
import com.challet.challetservice.domain.dto.request.ChallengeRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionUpdateRequestDTO;
import com.challet.challetservice.domain.dto.response.ChallengeDetailResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeInfoResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeListResponseDTO;
import com.challet.challetservice.domain.dto.response.ChallengeRoomHistoryResponseDTO;
import com.challet.challetservice.domain.dto.response.SearchedChallengesResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionRegisterResponseDTO;
import com.challet.challetservice.domain.dto.response.SharedTransactionUpdateResponseDTO;
import com.challet.challetservice.domain.dto.response.SpendingAmountResponseDTO;
import com.challet.challetservice.domain.elasticsearch.repository.SearchedChallengeRepository;
import com.challet.challetservice.domain.entity.Challenge;
import com.challet.challetservice.domain.entity.ChallengeStatus;
import com.challet.challetservice.domain.entity.SearchedChallenge;
import com.challet.challetservice.domain.entity.SharedTransaction;
import com.challet.challetservice.domain.entity.User;
import com.challet.challetservice.domain.entity.UserChallenge;
import com.challet.challetservice.domain.repository.ChallengeRepository;
import com.challet.challetservice.domain.repository.ChallengeRepositoryImpl;
import com.challet.challetservice.domain.repository.SharedTransactionRepository;
import com.challet.challetservice.domain.repository.SharedTransactionRepositoryImpl;
import com.challet.challetservice.domain.repository.UserChallengeRepository;
import com.challet.challetservice.domain.repository.UserChallengeRepositoryImpl;
import com.challet.challetservice.domain.repository.UserRepository;
import com.challet.challetservice.domain.request.PaymentHttpMessageRequestDTO;
import com.challet.challetservice.global.exception.CustomException;
import com.challet.challetservice.global.exception.ExceptionResponse;
import com.challet.challetservice.global.util.JwtUtil;

import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChallengeServiceImpl implements ChallengeService {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private static final SecureRandom random = new SecureRandom();
	private final ChallengeRepository challengeRepository;
	private final UserChallengeRepository userChallengeRepository;
	private final ChallengeRepositoryImpl challengeRepositoryImpl;
	private final SharedTransactionRepository sharedTransactionRepository;
	private final SharedTransactionRepositoryImpl sharedTransactionRepositoryImpl;
	private final SimpMessagingTemplate messagingTemplate;
	private final UserChallengeRepositoryImpl userChallengeRepositoryImpl;
	private final SearchedChallengeRepository searchedChallengeRepository;

	@Override
	@Transactional
	public void createChallenge(String header, ChallengeRegisterRequestDTO request) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		// 비공개 챌린지라면 초대코드 생성
		String code = null;
		if (!request.isPublic()) {
			code = generateCode(6);
		}

		// 챌린지 생성
		Challenge challenge = Challenge.createChallenge(request, code);
		challengeRepository.save(challenge);

		searchedChallengeRepository.save(SearchedChallenge.fromChallenge(challenge));

		// 생성한 유저는 참여 멤버로 추가
		UserChallenge userChallenge = UserChallenge.fromUserAndChallenge(user, challenge);
		userChallengeRepository.save(userChallenge);

	}

	@Override
	@Transactional(readOnly = true)
	public ChallengeListResponseDTO getMyChallenges(String header) {

		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		if (user.getUserChallenges() == null || user.getUserChallenges().isEmpty()) {
			return null;
		}

		List<ChallengeInfoResponseDTO> result = user.getUserChallenges()
			.stream()
			.map(userChallenge -> {
				Challenge challenge = userChallenge.getChallenge();
				return ChallengeInfoResponseDTO.fromChallenge(challenge,
					challenge.getUserChallenges().size());
			})
			.toList();

		return ChallengeListResponseDTO.fromChallengeList(result);
	}

	@Override
	@Transactional(readOnly = true)
	public SearchedChallengesResponseDTO searchChallengesFromElasticsearch(String header, String category, String keyword, int page, int size) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Pageable pageable = PageRequest.of(page, size);
		Page<SearchedChallenge> searchedChallengePage = getResult(category, keyword, pageable);

		boolean isLastPage = searchedChallengePage.isLast();

		return SearchedChallengesResponseDTO.fromSearchedChallenges(searchedChallengePage.getContent(), isLastPage);
	}

	private Page<SearchedChallenge> getResult(String category, String keyword, Pageable pageable) {
		String status = ChallengeStatus.RECRUITING.toString();
		if (category != null && keyword != null) {
			return searchedChallengeRepository.findByStatusAndCategoryAndTitleContaining(status, category, keyword, pageable);
		}
		if (category != null) {
			return searchedChallengeRepository.findByStatusAndCategoryContaining(status, category, pageable);
		}
		if (keyword != null) {
			return searchedChallengeRepository.findByStatusAndTitleContaining(status, keyword, pageable);
		}
		return searchedChallengeRepository.findByStatusContaining(status, pageable);
	}

	@Override
	public SearchedChallengesResponseDTO searchChallengesFromElasticsearch(final String header,
		final String category, final String keyword) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		return SearchedChallengesResponseDTO.fromSearchedChallenges(
			getResult(category, keyword));
	}

	private List<SearchedChallenge> getResult(String category, String keyword) {
		String status = ChallengeStatus.RECRUITING.toString();
		if (category != null && keyword != null) {
			return searchedChallengeRepository.findByStatusAndCategoryAndTitleContaining(status,
				category, keyword);
		}
		if (category != null) {
			return searchedChallengeRepository.findByStatusAndCategoryContaining(status, category);
		}
		if (keyword != null) {
			return searchedChallengeRepository.findByStatusAndTitleContaining(status, keyword);
		}
		return searchedChallengeRepository.findByStatusContaining(status);
	}

	@Override
	@Transactional(readOnly = true)
	public ChallengeListResponseDTO searchChallengesFromMySQL(String header, String category,
		String keyword) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		List<Challenge> searchChallenges = challengeRepositoryImpl.searchChallengeByKeywordAndCategory(
			keyword, category);
		if (searchChallenges == null || searchChallenges.isEmpty()) {
			return null;
		}
		List<ChallengeInfoResponseDTO> result = searchChallenges.stream()
			.map(challenge -> ChallengeInfoResponseDTO.fromChallenge(challenge,
				challenge.getUserChallenges().size()))
			.toList();

		return ChallengeListResponseDTO.fromChallengeList(result);
	}

	@Override
	@Transactional(readOnly = true)
	public ChallengeDetailResponseDTO getChallengeDetail(String header, Long id) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Challenge challenge = challengeRepository.findById(id)
			.orElseThrow(
				() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		return ChallengeDetailResponseDTO.fromChallenge(challenge,
			userChallengeRepository.existsByChallengeAndUser(challenge, user),
			challenge.getUserChallenges().size());
	}

	@Override
	@Transactional
	public void joinChallenge(String header, Long id, ChallengeJoinRequestDTO request) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Challenge challenge = challengeRepository.findById(id)
			.orElseThrow(
				() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		// 비공개 챌린지라면 코드 검증
		if (!request.isPublic() && !request.inviteCode().equals(challenge.getInviteCode())) {
			throw new ExceptionResponse(CustomException.CODE_MISMATCH_EXCEPTION);
		}

		// 이미 참여중인 챌린지라면 예외처리
		if (userChallengeRepository.existsByChallengeAndUser(challenge, user)) {
			throw new ExceptionResponse(CustomException.ALREADY_JOIN_EXCEPTION);
		}

		// 모집중인 챌린지가 아니라면 참여 불가
		if (!challenge.getStatus().equals(ChallengeStatus.RECRUITING)) {
			throw new ExceptionResponse(CustomException.NOT_RECRUITING_EXCEPTION);
		}

		// 참여인원 초과면 참여 불가
		if (challenge.getUserChallenges().size() >= challenge.getMaxParticipants()) {
			throw new ExceptionResponse(CustomException.MAX_PARTICIPANTS_EXCEEDED_EXCEPTION);
		}

		UserChallenge userChallenge = UserChallenge.fromUserAndChallenge(user, challenge);
		userChallengeRepository.save(userChallenge);

		SearchedChallenge searchedChallenge = searchedChallengeRepository.findById(
				challenge.getId())
			.orElseThrow(
				() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		SearchedChallenge updatedChallenge = SearchedChallenge.builder()
			.challengeId(searchedChallenge.challengeId())
			.status(searchedChallenge.status())
			.category(searchedChallenge.category())
			.title(searchedChallenge.title())
			.spendingLimit(searchedChallenge.spendingLimit())
			.startDate(searchedChallenge.startDate())
			.endDate(searchedChallenge.endDate())
			.maxParticipants(searchedChallenge.maxParticipants())
			.currentParticipants(searchedChallenge.currentParticipants() + 1)
			.isPublic(searchedChallenge.isPublic())
			.build();

		searchedChallengeRepository.save(updatedChallenge);
	}

	@Override
	@Transactional
	public SharedTransactionRegisterResponseDTO registerTransaction(String header, Long id,
		SharedTransactionRegisterRequestDTO request) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Challenge challenge = challengeRepository.findById(id)
			.orElseThrow(
				() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		UserChallenge userChallenge = userChallengeRepository.findByChallengeAndUser(challenge,
				user)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_JOIN_EXCEPTION));

		SharedTransaction savedSharedTransaction = sharedTransactionRepository.save(
			SharedTransaction.fromRequest(request, userChallenge));
		userChallenge.addSpendingAmount(request.transactionAmount());

		return SharedTransactionRegisterResponseDTO.fromSharedTransaction(savedSharedTransaction,
			user);

	}

	@Override
	@Transactional(readOnly = true)
	public ChallengeRoomHistoryResponseDTO getChallengeRoomHistory(String header, Long id,
		Long cursor) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Challenge challenge = challengeRepository.findById(id)
			.orElseThrow(
				() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		return sharedTransactionRepositoryImpl.findHistoryByChallenge(challenge, user, cursor);

	}

	@Override
	@Transactional(readOnly = true)
	public SpendingAmountResponseDTO getSpendingAmount(String header, Long id) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Challenge challenge = challengeRepository.findById(id)
			.orElseThrow(
				() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		UserChallenge userChallenge = userChallengeRepository.findByChallengeAndUser(challenge,
				user)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_JOIN_EXCEPTION));

		return new SpendingAmountResponseDTO(userChallenge.getSpendingAmount());
	}

	@Override
	@Transactional
	public void handlePayment(PaymentHttpMessageRequestDTO paymentNotification) {

		User user = userRepository.findByPhoneNumber(paymentNotification.phoneNumber())
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		List<UserChallenge> userChallenges = userChallengeRepositoryImpl.getChallengeByPaymentCategory(
			paymentNotification.category(), user);

		for (UserChallenge userChallenge : userChallenges) {

			SharedTransaction savedSharedTransaction = sharedTransactionRepository.save(
				SharedTransaction.fromPayment(paymentNotification, userChallenge));
			userChallenge.addSpendingAmount(paymentNotification.transactionAmount());

			SharedTransactionRegisterResponseDTO registerResponseDTO = SharedTransactionRegisterResponseDTO.fromSharedTransaction(
				savedSharedTransaction, user);
			messagingTemplate.convertAndSend(
				"/topic/challenges/" + userChallenge.getChallenge().getId()
					+ "/shared-transactions", registerResponseDTO);
		}
	}

	@Override
	@Transactional
	public SharedTransactionUpdateResponseDTO updateTransaction(String header, Long challengeId,Long transactionId,
		SharedTransactionUpdateRequestDTO request) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
		User user = userRepository.findByPhoneNumber(loginUserPhoneNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_USER_EXCEPTION));

		Challenge challenge = challengeRepository.findById(challengeId)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_CHALLENGE_EXCEPTION));

		SharedTransaction sharedTransaction = sharedTransactionRepository.findById(transactionId)
			.orElseThrow(() -> new ExceptionResponse(
				CustomException.NOT_FOUND_SHARED_TRANSACTION_EXCEPTION));

		if (!sharedTransactionRepositoryImpl.isSameUser(sharedTransaction, user)) {
			throw new ExceptionResponse(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		UserChallenge userChallenge = userChallengeRepository.findByChallengeAndUser(challenge, user)
				.orElseThrow(()-> new ExceptionResponse(CustomException.NOT_FOUND_JOIN_EXCEPTION));

		userChallenge.updateSpendingAmount(sharedTransaction.getTransactionAmount(), request.transactionAmount());
		sharedTransaction.updateSharedTransaction(request);

		return SharedTransactionUpdateResponseDTO.fromRequest(request, transactionId);
	}

	public static String generateCode(int length) {
		StringBuilder code = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
		}
		return code.toString();
	}
}

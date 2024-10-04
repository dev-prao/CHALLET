package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.request.UserInfoMessageRequestDTO;
import com.challet.bankservice.domain.dto.response.CategoryPercentageResponseDTO;
import com.challet.bankservice.domain.dto.response.CategoryPercentageResponseListDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.entity.Category;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import com.challet.bankservice.global.client.ChalletFeignClient;
import com.challet.bankservice.global.client.KbBankFeignClient;
import com.challet.bankservice.global.client.NhBankFeignClient;
import com.challet.bankservice.global.client.ShBankFeignClient;
import com.challet.bankservice.global.util.JwtUtil;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionAnalysisServiceImpl implements TransactionAnalysisService {

    private final ChalletBankRepository challetBankRepository;
    private final JwtUtil jwtUtil;
    private final KbBankFeignClient kbBankFeignClient;
    private final NhBankFeignClient nhBankFeignClient;
    private final ShBankFeignClient shBankFeignClient;
    private final ChalletFeignClient challetFeignClient;


    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {

        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        MonthlyTransactionHistoryListDTO chMonthlyTransaction = challetBankRepository.getTransactionByPhoneNumberAndYearMonth(
            phoneNumber, requestDTO);

        MonthlyTransactionHistoryListDTO kbMonthlyTransaction = kbBankFeignClient.getMonthlyTransactionHistory(
            tokenHeader, requestDTO.year(), requestDTO.month());

        MonthlyTransactionHistoryListDTO nhMonthlyTransaction = nhBankFeignClient.getMonthlyTransactionHistory(
            tokenHeader, requestDTO.year(), requestDTO.month());

        MonthlyTransactionHistoryListDTO shMonthlyTransaction = shBankFeignClient.getMonthlyTransactionHistory(
            tokenHeader, requestDTO.year(), requestDTO.month());

        List<MonthlyTransactionHistoryDTO> allTransactions = new ArrayList<>();
        allTransactions.addAll(chMonthlyTransaction.monthlyTransactions());
        allTransactions.addAll(kbMonthlyTransaction.monthlyTransactions());
        allTransactions.addAll(nhMonthlyTransaction.monthlyTransactions());
        allTransactions.addAll(shMonthlyTransaction.monthlyTransactions());

        allTransactions.sort(
            Comparator.comparing(MonthlyTransactionHistoryDTO::transactionDate).reversed());

        MonthlyTransactionHistoryListDTO sortedTransactions = MonthlyTransactionHistoryListDTO.from(
            allTransactions);

        return sortedTransactions;
    }

    @Override
    public CategoryPercentageResponseListDTO getTransactionByGroupCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {

        UserInfoMessageRequestDTO userInfo = challetFeignClient.getUserInfo(tokenHeader);
        BankToAnalysisMessageRequestDTO message = BankToAnalysisMessageRequestDTO.ofRequestMessage(
            userInfo, requestDTO);

        Map<Category, Long> totalCategoryAmount = getMyDataBankCategoryPayment(requestDTO, userInfo,
            message);
        List<CategoryPercentageResponseDTO> categoryList = calculatePercent(totalCategoryAmount);

        return CategoryPercentageResponseListDTO.fromCategoryList(categoryList);
    }

    private Map<Category, Long> getMyDataBankCategoryPayment(
        MonthlyTransactionRequestDTO requestDTO,
        UserInfoMessageRequestDTO userInfo, BankToAnalysisMessageRequestDTO message) {
        Map<Category, Long> chBankCategory = challetBankRepository.getTransactionByGroupCategory(
            userInfo, requestDTO);
        Map<Category, Long> kbBankCategory = kbBankFeignClient.getTransactionGroupCategory(message);
        Map<Category, Long> nhBankCategory = nhBankFeignClient.getTransactionGroupCategory(message);
        Map<Category, Long> shBankCategory = shBankFeignClient.getTransactionGroupCategory(message);

        Map<Category, Long> totalCategoryAmount = new HashMap<>();
        combineCategoryAmounts(totalCategoryAmount, chBankCategory);
        combineCategoryAmounts(totalCategoryAmount, kbBankCategory);
        combineCategoryAmounts(totalCategoryAmount, nhBankCategory);
        combineCategoryAmounts(totalCategoryAmount, shBankCategory);
        return totalCategoryAmount;
    }

    private void combineCategoryAmounts(Map<Category, Long> totalCategoryAmount,
        Map<Category, Long> bankCategory) {
        for (Map.Entry<Category, Long> entry : bankCategory.entrySet()) {
            totalCategoryAmount.merge(entry.getKey(), entry.getValue(), Long::sum);
        }
    }

    private static List<CategoryPercentageResponseDTO> calculatePercent(
        Map<Category, Long> totalCategoryAmount) {

        long totalAmount = totalCategoryAmount.values().stream().mapToLong(Long::longValue).sum();
        return totalCategoryAmount.entrySet().stream()
            .map(entry -> {
                double percentage = (entry.getValue() * 100.0) / totalAmount;
                return CategoryPercentageResponseDTO.fromCategory(entry.getKey(), percentage,
                    entry.getValue());
            })
            .collect(Collectors.toList());
    }
}

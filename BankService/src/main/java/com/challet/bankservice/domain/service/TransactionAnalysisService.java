package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.CategoryPercentageResponseListDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;

public interface TransactionAnalysisService {

    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);

    CategoryPercentageResponseListDTO getTransactionByGroupCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);
}

package com.challet.nhbankservicedemo.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION(400, "NotFoundTransactionDetailException",
        "거래내역이 존재하지 않습니다."),
    NOT_GET_TRANSACTION_DETAIL_EXCEPTION(400, "NotGetTransactionDetailException",
        "잘못된 거래내역 입니다.(동일한 거래내역 2개이상)"),

    NOT_ENOUGH_FUNDS_EXCEPTION(400, "NotEnoughFundsException", "잔액이 부족합니다"),


    ACCOUNT_NOT_FOUND_EXCEPTION(404, "AccountNotFoundException", "입력한 계좌가 존재하지 않습니다");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}

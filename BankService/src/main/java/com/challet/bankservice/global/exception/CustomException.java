package com.challet.bankservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_USER_EXCEPTION(400,"NotFoundUserException","유저가 존재하지 않습니다."),
    NOT_CREATE_USER_ACCOUNT_EXCEPTION(400, "NotCreateUserAccountException", "계좌 생성 실패."),
    NOT_FOUND_USER_ACCOUNT_EXCEPTION(400, "NotFoundUserAccountException", "챌렛 계좌가 존재하지 않습니다."),
    NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION(400, "NotFoundTransactionDetailException", "거래내역이 존재하지 않습니다."),
    NOT_GET_TRANSACTION_DETAIL_EXCEPTION(400, "NotGetTransactionDetailException", "잘못된 거래내역 입니다.(동일한 거래내역 2개이상)"),
    NOT_ENOUGH_FUNDS_EXCEPTION(400, "NotEnoughFundsException", "잔액이 부족합니다"),

    NOT_CONNECTED_MYDATA_EXCEPTION(401, "NotConnectedMyDataException", "해당 유저는 마이데이터가 연결되지 않았습니다"),

    ACCOUNT_NOT_SAME_TRANSACTION_EXCEPTION(401, "AccountNotSameTransactionException", "입력한 계좌가 자신의 계좌입니다"),
    ACCOUNT_NOT_FOUND_EXCEPTION(404, "AccountNotFoundException", "입력한 계좌가 존재하지 않습니다"),
    INVALID_BANK_CODE_EXCEPTION(404, "InvalidBankCodeException", "입력한 은행코드가 존재하지 않습니다");




    private int statusNum;
    private String errorCode;
    private String errorMessage;
}
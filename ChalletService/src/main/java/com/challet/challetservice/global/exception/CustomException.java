package com.challet.challetservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_USER_EXCEPTION(400,"NotFoundUserException","유저가 존재하지 않습니다."),
    NOT_FOUND_MESSAGE_EXCEPTION(400, "NotFoundMessageException","메시지가 존재하지 않음"),
    ID_IS_ZERO_EXCEPTION(400, "IdIsZeroException", "아이디가 0임");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}
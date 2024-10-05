package com.challet.challetservice.global.util;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String SMS_CERTIFICATION_PREFIX = "SMS_CERTIFICATION_";

    public void saveCertificationCode(String phoneNumber, String certificationCode) {
        redisTemplate.opsForValue().set(SMS_CERTIFICATION_PREFIX + phoneNumber, certificationCode);
        redisTemplate.expire(SMS_CERTIFICATION_PREFIX + phoneNumber, 3, TimeUnit.MINUTES);
    }

    public String getCertificationCode(String phoneNumber) {
        return (String) redisTemplate.opsForValue().get(SMS_CERTIFICATION_PREFIX + phoneNumber);
    }

}

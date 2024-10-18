package com.challet.kbbankservice.domain.repository;

import com.challet.kbbankservice.domain.entity.KbBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KbBankRepository extends JpaRepository<KbBank, Long>, KbBankRepositoryCustom {
}

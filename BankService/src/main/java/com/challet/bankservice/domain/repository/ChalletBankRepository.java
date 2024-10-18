package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.ChalletBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChalletBankRepository extends JpaRepository<ChalletBank, Long>,
    ChalletBankRepositoryCustom {

}

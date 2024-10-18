package com.challet.shbankservice.domain.repository;

import com.challet.shbankservice.domain.entity.ShBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShBankRepository extends JpaRepository<ShBank, Long>, ShBankRepositoryCustom {

}

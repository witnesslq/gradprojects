package com.mafuzhi.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created by mafuz on 2017/3/31.
 */
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

    @Query("select ur.role from UserRole ur where ur.username=?1")
    List<String> findRoleByUsername(String username);
}

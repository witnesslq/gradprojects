package com.mafuzhi.domain;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created by mafuz on 2017/3/31.
 */
public interface UserCateRepository extends JpaRepository<UserCate, Integer>, JpaSpecificationExecutor<UserCate> {
    List<UserCate> findByUsernameAndEnableTrue(String username);

    UserCate findByCatename(String catename);

    UserCate findByCatenameAndUsernameAndEnableTrue(String catename, String username);

    UserCate findByCatenameAndUsername(String catename,String username);

    void deleteByCatenameAndUsername(String catenmae, String username);

    @Query("select u.catename from UserCate u where u.username=?1")
    List<String> findCatename(String username);

    List<UserCate> findByUsername(String username, Specification<UserCate> where);

    List<UserCate> findByUsername(String username);
}

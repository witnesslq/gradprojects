package com.mafuzhi.domain;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by mafuz on 2017/5/12.
 */
public interface SitePreferencesRepository extends JpaRepository<SitePreferences, Integer> {
    SitePreferences findByUseridAndSiteid(int userid, int siteid);
}

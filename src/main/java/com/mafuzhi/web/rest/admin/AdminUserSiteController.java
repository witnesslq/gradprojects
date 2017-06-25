package com.mafuzhi.web.rest.admin;

import com.mafuzhi.domain.SysSite;
import com.mafuzhi.domain.UserSite;
import com.mafuzhi.domain.UserSiteRepository;
import com.mafuzhi.service.UserSiteService;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/4/8.
 */
@RestController
public class AdminUserSiteController {

    @Autowired
    private UserSiteRepository userSiteRepository;

    @Autowired
    private UserSiteService userSiteService;

    @GetMapping("/api/admin/userSite/getAllSites")
    public Page<UserSite> getAllSites(@PageableDefault(value = 6, sort = {"id"}, direction = Sort.Direction.ASC) Pageable pageable) {

        return userSiteRepository.findAll(pageable);
    }

    @GetMapping("/api/admin/userSite/getUserSiteById/{id}")
    public Map<String, Object> getUserSiteById(@PathVariable int id) {
        Map<String, Object> map = new HashedMap();
        UserSite userSite = userSiteRepository.findOne(id);
        map.put("userSite", userSite);
        return map;
    }

    @PostMapping("/api/admin/userSite/searchForm")
    public Page<UserSite> searchForm(@PageableDefault(value = 6, sort = {"id"}, direction = Sort.Direction.ASC) Pageable pageable, UserSite userSite) {
        return userSiteService.searchAdmin(pageable, userSite);
    }

    @PostMapping("/api/admin/userSite/AddUserSite")
    public Map<String, Object> addUserSite(UserSite userSite) {
        Map<String, Object> map = new HashedMap();
        try {
            userSiteRepository.save(userSite);
            map.put("statu", "yes");
        } catch (Exception e) {
            map.put("statu", "no");
        }
        return map;
    }

    @PutMapping("/api/admin/userSite/updateUserSite/{id}")
    public Map<String, Object> updateUserSite(@PathVariable int id, UserSite userSite) {
        Map<String, Object> map = new HashedMap();
        if (userSite.getId() == 0) {
            userSite.setId(id);
        }
        try {
            userSiteRepository.save(userSite);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }
    @DeleteMapping("/api/admin/userSite/{id}")
    public Map<String, Object> deleteSite(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            userSiteRepository.delete(id);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message",e.getMessage());
        }
        return map;
    }
}

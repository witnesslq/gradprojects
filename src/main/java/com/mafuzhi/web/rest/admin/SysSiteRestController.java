package com.mafuzhi.web.rest.admin;

import com.mafuzhi.domain.Site;
import com.mafuzhi.domain.SiteRepository;
import com.mafuzhi.domain.SysSite;
import com.mafuzhi.domain.SysSiteRepository;
import com.mafuzhi.service.SysSiteService;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/4/2.
 */
@RestController
public class SysSiteRestController {

    @Autowired
    private SysSiteRepository sysSiteRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private SysSiteService sysSiteService;

    @GetMapping("/api/admin/site/getAllSites")
    public Map<String, Object> getAllSites() {
        Map<String, Object> map = new HashMap<>();
        List<SysSite> sysSiteList = sysSiteRepository.findAll();
        map.put("sysSiteList",sysSiteList);
        return map;
    }

    @GetMapping("/api/admin/site/{id}")
    public Map<String, Object> getSite(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        SysSite sysSite = sysSiteRepository.findOne(id);
        map.put("sysSite", sysSite);
        return map;
    }

    @PostMapping("/api/admin/site")
    public Map<String, Object> addSite(SysSite site) {
        Map<String, Object> map = new HashMap<>();
        if (siteRepository.findBySiteurl(site.getSiteurl()) == null) {
            Site site1 = new Site();
            site1.setSiteurl(site.getSiteurl());
            siteRepository.save(site1);
        }
        try {
            sysSiteRepository.save(site);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message",e.getMessage());
        }
        return map;
    }

    @PostMapping("/api/admin/searchSysSite")
    public Map<String, Object> searchUser(SysSite sysSite) {
        Map<String, Object> map = new HashedMap();
        List<SysSite> sysSiteList = sysSiteService.findAll(sysSite);
        map.put("sysSiteList", sysSiteList);
        return map;

    }

    @PutMapping("/api/admin/site/{id}")
    public Map<String, Object> updateCate(@PathVariable int id, SysSite site) {
        Map<String, Object> map = new HashMap<>();
        if (site.getId() == 0) {
            site.setId(id);
        }
        try {
            sysSiteRepository.save(site);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }

    @DeleteMapping("/api/admin/site/{id}")
    public Map<String, Object> deleteCate(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            sysSiteRepository.delete(id);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }
}

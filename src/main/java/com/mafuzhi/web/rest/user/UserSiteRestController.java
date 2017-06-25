package com.mafuzhi.web.rest.user;

import com.mafuzhi.domain.*;
import com.mafuzhi.service.RecordService;
import com.mafuzhi.service.SysSiteService;
import com.mafuzhi.service.UserCateService;
import com.mafuzhi.service.UserSiteService;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.mahout.cf.taste.common.TasteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/4/1.
 */
@RestController
public class UserSiteRestController {

    private static final Log log = LogFactory.getLog(UserSiteRestController.class);

    @Autowired
    private UserSiteService userSiteService;

    @Autowired
    private UserCateService userCateService;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private SysSiteService sysSiteService;

    @Autowired
    private SysSiteRepository sysSiteRepository;

    @Autowired
    private UserSiteRepository userSiteRepository;

    @Autowired
    private RecordService recordService;

    @GetMapping("/api/site/{catename}")
    public Map<String, Object> getSitesByCatename(@PathVariable String catename) throws TasteException {
        Map<String, Object> map = new HashMap<>();
        if(!catename.equals("setting")) {
            List<UserSite> userSiteList = userSiteService.findByCatenameAndUsername(catename);
            if(catename.equals("commonnav")) {
                List<UserSite> userSites = recordService.recordToUser();
                log.info(userSites.toString());
                map.put("userSites", userSites);
            }
            map.put("userSiteList", userSiteList);
        } else if (catename.equals("setting")){
            List<UserCate> userCates = userCateService.findByUsername();
            map.put("userCates", userCates);
        }

        return map;
    }




    @GetMapping("/api/site/siteDetail/{id}")
    public Map<String, Object> getSiteDetail(@PathVariable int id){
        Map<String, Object> map = new HashMap<>();
        UserSite userSite = userSiteService.findOne(id);
        List<String> catename = userCateService.findCatename();
        //todo 错误处理
        map.put("userSite", userSite);
        map.put("catename",catename);
        return map;
    }

    @GetMapping("/api/site/search/{keyword}")
    public Map<String, Object> search(@PathVariable String keyword) {
        Map<String, Object> map = new HashMap<>();
        List<UserSite> userSiteList = userSiteService.searchByKeyword(keyword);
        List<SysSite> sysSiteList = sysSiteService.userSearch(keyword);
        List<SysSite> sysSiteList1 = userSiteService.removeRepeat(userSiteList, sysSiteList);
        map.put("userSiteList", userSiteList);
        map.put("sysSiteList", sysSiteList1);
        return map;
    }

    @PostMapping("/api/site/addSite")
    public Map<String, Object> addSite(UserSite userSite) {
        log.info(userSite);
        Map<String, Object> map = new HashMap<>();
        if (siteRepository.findBySiteurl(userSite.getSiteurl()) == null) {
            Site site = new Site();
            site.setSiteurl(userSite.getSiteurl());
            siteRepository.save(site);
        }
        try {
            userSiteService.save(userSite);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message",e.getMessage());
        }
        return map;
    }

    @PutMapping("/api/site/{id}")
    public Map<String, Object> updateSite(@PathVariable int id, UserSite userSite) {
        Map<String, Object> map = new HashMap<>();
        if (userSite.getId() == 0) {
            userSite.setId(id);
        }
        try {
            userSiteService.save(userSite);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message",e.getMessage());
        }
        return map;
    }
    @PutMapping("/api/site/updatecatename/{id}")
    public Map<String, Object> updateSitecatename(@PathVariable int id, @RequestParam String catename) {
        Map<String, Object> map = new HashMap<>();
        try {
            userSiteService.updateCatename(id,catename);
            map.put("statu","yes");
        } catch (Exception e){
            map.put("message",e.getMessage());
        }
        return map;
    }


    @DeleteMapping("/api/site/{id}")
    public Map<String, Object> deleteSite(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            userSiteService.delete(id);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message",e.getMessage());
        }
        return map;
    }

    @PostMapping("/api/site/addToUser")
    public Map<String, Object> addToUser(@RequestParam int id) {
        Map<String, Object> map = new HashMap<>();
        SysSite sysSite = sysSiteRepository.findOne(id);
        if (userSiteRepository.findByTitle(sysSite.getTitle()) == null) {
            map.put("message", "已经存在");
        }
        boolean result = userSiteService.addToUser(sysSite);

        if(result) {
            map.put("statu", "yes");
        } else {
            map.put("statu", "no");
        }
        return map;
    }

    @PostMapping("/api/site/addRecordToUser")
    public Map<String, Object> addRecordToUser(@RequestParam int id) {
        Map<String, Object> map = new HashMap<>();
        UserSite userSite = userSiteRepository.findOne(id);
        boolean result = userSiteService.addRecordToUser(userSite);
        if(result) {
            map.put("statu", "yes");
        } else {
            map.put("statu", "no");
        }
        return map;

    }


}

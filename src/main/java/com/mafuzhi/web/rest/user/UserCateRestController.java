package com.mafuzhi.web.rest.user;


import com.mafuzhi.domain.SysCateRepository;
import com.mafuzhi.domain.SysSiteRepository;
import com.mafuzhi.domain.UserCate;
import com.mafuzhi.domain.UserCateRepository;
import com.mafuzhi.service.UserCateService;
import com.mafuzhi.service.UserService;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/4/1.
 */
@RestController
public class UserCateRestController {

    @Autowired
    private UserCateService userCateService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserCateRepository userCateRepository;

    @Autowired
    private SysCateRepository sysCateRepository;

    @Autowired
    private SysSiteRepository sysSiteRepository;

    /*
     * 查询所有分类
     */
    @GetMapping("/api/getAllCates")
    public Map<String, Object> getAllCates() {
        List<UserCate> userCateList = userCateService.findAllCatesWithEnable();
        Map<String, Object> map = new HashMap<>();
        if (userCateList.isEmpty()) {
            userCateList = userCateService.findAllCatesWithEnable();
        }
        map.put("userCateList", userCateList);
        return map;
    }

    @PostMapping("/api/findCate")
    public Map<String, Object> findCate(UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        List<UserCate> userCates = userCateService.searchUserCate(userCate);
        map.put("userCates", userCates);
        return map;
    }

    @GetMapping("/api/getCatename")
    public Map<String, Object> getCatename() {
        List<String> catename = userCateService.findCatename();
        Map<String, Object> map = new HashMap<>();
        map.put("catename",catename);
        return map;
    }

    //根据分类名查询
    @GetMapping("/api/cate/{catename}")
    public Map<String, Object> getCateByCatename(@PathVariable String catename) {
        Map<String, Object> map = new HashMap<>();
        UserCate userCate = userCateService.findByCatename(catename);
        if (!userCate.isEnable()) {
            map.put("message","该分类已被禁用");
            return map;
        }
        map.put("userCate",userCate);
        return map;
    }

    @PostMapping("/api/cate")
    public Map<String, Object> AddCate(UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        if (userCateService.checkCatename(userCate.getCatename()).equals("yes")) {
            map.put("message","分类重复");
            return map;
        }
        try {
            userCateService.saveCate(userCate);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("statu","no");
            map.put("message",e.getMessage());
        }
        return map;
    }

    //检查分类是否重复
    @PostMapping("/api/cate/checkCatename")
    public Map<String, Object> checkCatename(String catename) {
        Map<String, Object> map = new HashMap<>();
        String result = userCateService.checkCatename(catename);
        if (result.equals("yes")) {
            map.put("message", "分类重复");
            return map;
        }
        map.put("statu","yes");
        return map;
    }

    @PostMapping("/api/cate/changeenable")
    public Map<String, Object> changeEnable(UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        UserCate userCate1 = userCateService.changeByCatename(userCate.getCatename());
        if(userCate1 != null) {
            userCate1.setEnable(userCate.isEnable());
            userCateRepository.save(userCate1);
            map.put("statu","yes");
        } else {
            map.put("statu", "no");
        }
        return map;
    }

    @PutMapping("/api/cate/{id}")
    public Map<String, Object> updateCateById(@PathVariable int id, UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        if (userCate.getId() == 0) {
            userCate.setId(id);
        }
        if (userCateRepository.findOne(id) != null) {
            try {
                userCateService.save(userCate);
                map.put("statu", "yes");
            } catch (Exception e) {
                map.put("message", e.getMessage());
            }
            return map;
        } else {
            map.put("message","没有该分类");
        }
        return map;
    }

    @DeleteMapping("/api/cate/{id}")
    public Map<String, Object> deleteCateById(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            userCateRepository.delete(id);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message",e.getMessage());
        }
        return map;
    }

    @PostMapping("/api/copyCate")
    public Map<String, Object> copyCate(@RequestParam String str) {
        System.out.println(str);
        Map<String, Object> map = new HashedMap();
        try {
            userCateService.copyCate(str);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }

}

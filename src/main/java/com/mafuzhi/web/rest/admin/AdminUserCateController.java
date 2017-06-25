package com.mafuzhi.web.rest.admin;

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
 * Created by mafuz on 2017/4/7.
 */
@RestController
public class AdminUserCateController {

    @Autowired
    private UserCateService userCateService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserCateRepository userCateRepository;

    /*
     * 查询所有分类
     */
    @GetMapping("/api/admin/getAllUserCates")
    public Map<String, Object> getAllCates() {
        List<UserCate> userCateList = userCateRepository.findAll();
        Map<String, Object> map = new HashMap<>();
        map.put("userCateList", userCateList);
        return map;
    }

    @GetMapping("/api/admin/getUserCate/{id}")
    public Map<String, Object> getUserCate(@PathVariable int id) {
        UserCate userCate = userCateRepository.findOne(id);
        Map<String, Object> map = new HashMap<>();
        map.put("userCate", userCate);
        return map;
    }

    @PostMapping("/api/admin/findUserCate")
    public Map<String, Object> findCate(UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        List<UserCate> userCateList = userCateService.adminSearchUserCate(userCate);
        map.put("userCateList", userCateList);
        return map;
    }



    @PostMapping("/api/admin/userCate")
    public Map<String, Object> AddCate(UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        if (userCateRepository.findByCatenameAndUsername(userCate.getCatename(), userCate.getUsername()) != null) {
            map.put("message", "分类重复");
            return map;
        } else {
            try {
                userCateRepository.save(userCate);
                map.put("statu", "yes");
            } catch (Exception e) {
                e.printStackTrace();
                map.put("message", e.getMessage());
            }
            return map;
        }
    }

    //检查分类是否重复
    @PostMapping("/api/admin/userCate/checkCatename")
    public Map<String, Object> checkCatename(UserCate userCate) {
        Map<String, Object> map = new HashedMap();
        if (userCateRepository.findByCatenameAndUsername(userCate.getCatename(), userCate.getUsername()) != null) {
            map.put("statu","yes");
        } else {
            map.put("statu", "no");
        }
        return map;
    }

    @PutMapping("/api/admin/userCate/{id}")
    public Map<String, Object> updateCateById(@PathVariable int id, UserCate userCate) {
        Map<String, Object> map = new HashMap<>();
        userCate.setId(id);
        try {
            userCateRepository.save(userCate);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }

    @DeleteMapping("/api/admin/userCate/{id}")
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

}

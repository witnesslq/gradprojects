package com.mafuzhi.web.rest.user;

import com.mafuzhi.domain.SysCate;
import com.mafuzhi.domain.SysCateRepository;
import com.mafuzhi.domain.SysSiteRepository;
import com.mafuzhi.domain.User;
import com.mafuzhi.service.UserService;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.PermitAll;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/3/31.
 */
@RestController
public class UserRestController {

    private static final Log log = LogFactory.getLog(UserRestController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private SysCateRepository sysCateRepository;


    //检查用户名是否重复
    @PreAuthorize("isAnonymous()")
    @PostMapping("/api/checkUsername/{username}")
    public Map<String, Object> checkUsername(@PathVariable String username) {
        Map<String, Object> map = new HashMap<>();
        User user = userService.checkUsername(username);
        if (user != null) {
            map.put("statu","no");
        } else {
            map.put("statu", "yes");
        }
        return map;
    }

    /*
     * 注册 sign
     */
    @PostMapping("/sign")
    public Map<String, String> userSign(User user) {
        Map<String, String> map = new HashMap<>();
        try {
            userService.userSign(user);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("statu", "no");
            map.put("message",e.getMessage());
        }
        return map;
    }

    @GetMapping("/api/getAllSysCates")
    public Map<String, Object> getAllSysCates() {
        Map<String, Object> map = new HashedMap();
        List<SysCate> sysCateList = sysCateRepository.findByEnableTrue();
        map.put("sysCateList", sysCateList);
        return map;
    }
}

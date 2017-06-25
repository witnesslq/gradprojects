package com.mafuzhi.web.rest.admin;

import com.mafuzhi.domain.User;
import com.mafuzhi.domain.UserRepository;
import com.mafuzhi.service.UserService;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/4/2.
 */
@RestController
public class SysUserRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/api/admin/getAllUsers")
    public Map<String, Object> getAllUsers() {
        Map<String, Object> map = new HashedMap();
        List<User> userList = userRepository.findAll();
        map.put("userList", userList);
        return map;
    }

    @GetMapping("/api/admin/getUser/{id}")
    public Map<String, Object> getUserById(@PathVariable int id) {
        Map<String, Object> map = new HashedMap();
        User user = userRepository.findOne(id);
        map.put("user", user);
        return map;
    }

    @PostMapping("/api/admin/searchUser")
    public Map<String, Object> searchUser(@RequestParam String keyword) {
        Map<String, Object> map = new HashedMap();
        List<User> userList = userService.searchByKeyword(keyword);
        map.put("userList", userList);
        return map;

    }

    @PostMapping("/api/admin/addUser")
    public Map<String, Object> addUser(User user) {
        Map<String, Object> map = new HashedMap();
        if (userRepository.findByUsername(user.getUsername())== null) {
            try {
                userRepository.save(user);
                map.put("statu", "yes");
            } catch (Exception e) {
                e.printStackTrace();
                map.put("message", e.getMessage());
            }
        }
        return map;
    }

    @PutMapping("/api/admin/updateUser/{id}")
    public Map<String, Object> updateUser(@PathVariable int id, User user) {
        Map<String, Object> map = new HashedMap();
        user.setId(id);
        try {
            userRepository.save(user);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }

    @DeleteMapping("/api/admin/deleteUser/{id}")
    public Map<String, Object> deleteUser(@PathVariable int id) {
        Map<String, Object> map = new HashedMap();
        try {
            userRepository.delete(id);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }


}

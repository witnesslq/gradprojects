package com.mafuzhi.web.rest.admin;

import com.mafuzhi.domain.SysCate;
import com.mafuzhi.domain.SysCateRepository;
import com.mafuzhi.service.SysCateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/4/2.
 */
@RestController
public class SysCateRestController {

    @Autowired
    private SysCateService sysCateService;

    @Autowired
    private SysCateRepository sysCateRepository;

    @GetMapping("/api/admin/getAllCates")
    public Map<String, Object> getAllCates() {
        Map<String, Object> map = new HashMap<>();
        //todo delete
        SysCate sysCate = new SysCate();
        sysCate.setDescription("视");
        List<SysCate> sysCates = sysCateService.findAll(sysCate);
        List<SysCate> sysCateList = sysCateRepository.findAll();
        map.put("sysCateList", sysCateList);
        return map;
    }

    @GetMapping("/api/admin/getCateById/{id}")
    public Map<String, Object> getCateById(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        SysCate sysCate = sysCateRepository.findOne(id);
        map.put("sysCate", sysCate);
        return map;
    }

    @PostMapping("/api/admin/cate/addCate")
    public Map<String, Object> addCate(SysCate sysCate) {
        Map<String, Object> map = new HashMap<>();
        try {
            sysCateRepository.save(sysCate);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }

    @PutMapping("/api/admin/cate/{id}")
    public Map<String, Object> updateCate(@PathVariable int id, SysCate sysCate) {
        Map<String, Object> map = new HashMap<>();
        if (sysCate.getId() == 0) {
            sysCate.setId(id);
        }
        try {
            sysCateRepository.save(sysCate);
            map.put("statu", "yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }

    @DeleteMapping("/api/admin/cate/{id}")
    public Map<String, Object> deleteCate(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            sysCateRepository.delete(id);
            map.put("statu","yes");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("message", e.getMessage());
        }
        return map;
    }
}

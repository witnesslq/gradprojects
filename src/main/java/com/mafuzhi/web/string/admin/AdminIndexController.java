package com.mafuzhi.web.string.admin;

import com.mafuzhi.domain.SysCate;
import com.mafuzhi.service.SysCateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

/**
 * Created by mafuz on 2017/4/7.
 */
@Controller
public class AdminIndexController {

    @Autowired
    private SysCateService sysCateService;

    @GetMapping("/admin")
    public String adminIndex(Model model) {
        List<SysCate> sysCateList;
        return "/admin/index";
    }

    @GetMapping("/403")
    public String auth() {
        return "403";
    }

    @GetMapping("/404.html")
    public String someThingNotFound() {
        return "404";
    }
}

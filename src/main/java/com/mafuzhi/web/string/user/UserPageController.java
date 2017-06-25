package com.mafuzhi.web.string.user;

import com.mafuzhi.domain.*;
import com.mafuzhi.service.RecordService;
import com.mafuzhi.service.UserCateService;
import com.mafuzhi.service.UserPageService;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/3/31.
 */
@Controller
public class UserPageController {

    private static final Log log = LogFactory.getLog(UserPageController.class);

    @Autowired
    private UserPageService userPageService;

    @Autowired
    private UserCateService userCateService;

    @Autowired
    private UserCateRepository userCateRepository;

    @Autowired
    private RecordService recordService;

    @GetMapping(value = {"/","/login"})
    public String indexOrlogin(Model model) {
        String page = userPageService.indexOrLogin();
        if (page.equals("index")) {
            List<UserCate> userCateList = userCateService.findAllCatesWithEnable();
            log.info(userCateList.toString());
            model.addAttribute("userCate", userCateList);
        }
        return page;
    }

    @GetMapping("/cate/{catename}")
    public String setCatename(@PathVariable String catename, Model model) {
        model.addAttribute("catename", catename);
        List<UserCate> userCateList = userCateService.findAllCatesWithEnable();
        log.info(userCateList.toString());
        model.addAttribute("userCate", userCateList);
        return "index";
    }

    //record
    @ResponseBody
    @GetMapping("/record/{id}/time/{time}")
    public String record(@PathVariable int id, @PathVariable int time ) {
        recordService.calc(id, time);
        return "";
    }


}

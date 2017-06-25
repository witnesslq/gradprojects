/**
 * Created by mafuz on 2017/4/8.
 */
$(document).ready(function () {


    function createPageNav(opt) {
        opt= opt || {};
        var $container   = opt.$container          || null, //必需，页码容器，请确保这个容器只用来存放页码导航
            pageCount    = Number(opt.pageCount)   || 0,    //必需，页码总数
            currentNum   = Number(opt.currentNum)  || 1,    //选填，当前页码
            maxCommonLen = Number(opt.maxCommonLen)|| 10,   //选填，普通页码的最大个数

            className = opt.className  || "pagination",//选填，分页类型：pagination或pager等
            preText   = opt.preText    || "上一页",      //选填，上一页文字显示，适用于只有前后页按钮的情况
            nextText  = opt.nextText   || "下一页",      //选填，下一页文字，同上
            firstText = opt.firstText  || "首页",
            lastText  = opt.lastText   || "末页",

            hasFirstBtn  = opt.hasFirstBtn   === false ? false : true,
            hasLastBtn   = opt.hasLastBtn    === false ? false : true,
            hasPreBtn    = opt.hasPreBtn     === false ? false : true,
            hasNextBtn   = opt.hasNextBtn    === false ? false : true,
            hasInput     = opt.hasInput      === false ? false : true,
            hasCommonPage= opt.hasCommonPage === false ? false : true,//选填，是否存在普通页

            beforeFun = opt.beforeFun || null,  //选填，页码跳转前调用的函数，可通过返回false来阻止跳转，可接收目标页码参数
            afterFun  = opt.afterFun  || null,  //选填，页码跳转后调用的函数，可接收目标页码参数
            noPageFun = opt.noPageFun || null;  //选填，页码总数为0时调用的函数

        //当前显示的最小页码，用于计算起始页码，直接容器,当前页，前，后，首，末，输入框
        var minNum=1,changeLen,$parent,$currentPage,$preBtn,$nextBtn,$firstBtn,$lastBtn,$input;

        //容器
        if (!$container || $container.length != 1){
            console.log("分页容器不存在或不正确");
            return false;
        }
        //总页数
        if(pageCount <= 0){
            if(noPageFun) noPageFun();
            return false;
        }
        //当前页
        if (currentNum < 1) currentNum = 1;
        else if (currentNum > pageCount) currentNum = pageCount;
        //普通页码的最大个数，起始页算法限制，不能小于3
        if(maxCommonLen<3) maxCommonLen=3;
        //跳转页响应长度，用于计算起始页码
        if(maxCommonLen>=8) changeLen=3;
        else if(maxCommonLen>=5) changeLen=2;
        else changeLen=1;

        $container.hide();
        _initPageNav();
        $container.show();

        function _initPageNav(){
            var initStr = [];
            initStr.push('<nav><ul class="'+ className +'" onselectstart="return false">');
            if(hasFirstBtn)initStr.push('<li class="first-page page-item" value="1"><span class="page-link">'+ firstText +'</span></li>');
            if(hasPreBtn)  initStr.push('<li class="pre-page page-item"  value="' + (currentNum - 1) + '"><span class="page-link">'+ preText +'</span></li>');
            if(hasNextBtn) initStr.push('<li class="next-page page-item" value="' + (currentNum + 1) + '"><span class="page-link">'+ nextText +'</span></li>');
            if(hasLastBtn) initStr.push('<li class="last-page page-item" value="' + pageCount + '"><span class="page-link">'+ lastText +'</span></li>');
            if(hasInput)
                initStr.push('<div class="input-page-div">当前第<input class="currentinput" type="text" maxlength="6" value="' + currentNum + '" />页，共<span>'
                    + pageCount
                    + '</span>页<button type="button" class="btn btn-xs input-btn-xs">确定</button></div>');
            initStr.push('</ul></nav>');

            $container.html(initStr.join(""));
            //初始化变量
            $parent=$container.children().children();
            if(hasFirstBtn) $firstBtn = $parent.children("li.first-page");
            if(hasPreBtn)   $preBtn   = $parent.children("li.pre-page");
            if(hasNextBtn)  $nextBtn  = $parent.children("li.next-page");
            if(hasLastBtn)  $lastBtn  = $parent.children("li.last-page");
            if(hasInput){
                $input  = $parent.find("div.input-page-div>input");
                $input.blur(function () {
                    if ($input.val() > pageCount) {
                        $input.val(pageCount);
                    }
                })
                $parent.find("div.input-page-div>button").click(function(){
                    refreshData($input.val());
                    _gotoPage($input.val());
                });
            }
            //初始化功能按钮
            _buttonToggle(currentNum);
            //生成普通页码
            if(hasCommonPage) {
                _createCommonPage(_computeStartNum(currentNum), currentNum);
            }
            //绑定点击事件
            $parent.on("click", "li",function () {
                var $this=$(this);
                if ($this.is("li") && $this.attr("value")){
                    if(!$this.hasClass("disabled") && !$this.hasClass("active")){
                        _gotoPage($this.attr("value"));
                    }
                }
            });
        }
        //跳转到页码
        function _gotoPage(targetNum) {
            targetNum=_formatNum(targetNum);
            if (targetNum == 0 || targetNum == currentNum) return false;
            // 跳转前回调函数
            if (beforeFun && beforeFun(targetNum) === false) return false;
            //修改值
            currentNum=targetNum;
            if(hasInput)   $input.val(targetNum);
            if(hasPreBtn)  $preBtn.attr("value", targetNum - 1);
            if(hasNextBtn) $nextBtn.attr("value", targetNum + 1);
            //修改功能按钮的状态
            _buttonToggle(targetNum);
            // 计算起始页码
            if(hasCommonPage) {
                var starNum = _computeStartNum(targetNum);
                if (starNum == minNum) {// 要显示的页码是相同的
                    $currentPage.removeClass("active");
                    $currentPage = $parent.children("li.commonPage").eq(targetNum - minNum).addClass("active");
                }
                else {// 需要刷新页码
                    _createCommonPage(starNum, targetNum);
                }
            }
            // 跳转后回调函数
            if (afterFun) afterFun(targetNum);
        }
        //整理目标页码的值
        function _formatNum(num){
            num = Number(num);
            if(isNaN(num)) num=0;
            else if (num <= 0) num = 1;
            else if (num > pageCount) num = pageCount;
            return num;
        }
        //功能按钮的开启与关闭
        function _buttonToggle(current){
            refreshData('','',current);
            if (current == 1) {
                if(hasFirstBtn) $firstBtn.addClass("disabled");
                if(hasPreBtn)   $preBtn.addClass("disabled");
            }
            else {
                if(hasFirstBtn) $firstBtn.removeClass("disabled");
                if(hasPreBtn)   $preBtn.removeClass("disabled");
            }

            if (current == pageCount) {
                if(hasNextBtn) $nextBtn.addClass("disabled");
                if(hasLastBtn) $lastBtn.addClass("disabled");
            }
            else {
                if(hasNextBtn) $nextBtn.removeClass("disabled");
                if(hasLastBtn) $lastBtn.removeClass("disabled");
            }
        }
        //计算当前显示的起始页码
        function _computeStartNum(targetNum) {
            var startNum;
            if (pageCount <= maxCommonLen)
                startNum = 1;
            else {
                if ((targetNum - minNum) >= (maxCommonLen-changeLen)) {//跳转到靠后的页码
                    startNum = targetNum - changeLen;
                    if ((startNum + maxCommonLen-1) > pageCount) startNum = pageCount - (maxCommonLen-1);// 边界修正
                }
                else if ((targetNum - minNum) <= (changeLen-1)) {//跳转到靠前的页码
                    startNum = targetNum - (maxCommonLen-changeLen-1);
                    if (startNum <= 0) startNum = 1;// 边界修正
                }
                else {// 不用改变页码
                    startNum = minNum;
                }
            }
            return startNum;
        }
        //生成普通页码
        function _createCommonPage(startNum, activeNum) {
            var initStr = [];
            for (var i = 1,pageNum=startNum; i <= pageCount && i <= maxCommonLen; i++ , pageNum++) {
                initStr.push('<li class="commonPage" value="' + pageNum + '"><a class="page-link" href="javascript:">' + pageNum + '</a></li>');
            }

            $parent.hide();
            $parent.children("li.commonPage").remove();
            if(hasPreBtn) $preBtn.after(initStr.join(""));
            else if(hasFirstBtn) $firstBtn.after(initStr.join(""));
            else $parent.prepend(initStr.join(""));
            minNum = startNum;
            $currentPage = $parent.children("li.commonPage").eq(activeNum-startNum).addClass("active");
            $parent.show();
        }
    }

    $('#adminUserSite').click(function () {
        localStorage.removeItem('userSite');
        $.ajax({
            url: '/api/admin/userSite/getAllSites',
            type:'GET',
            success: function (data) {
                getAllSites(data);
                pageNav(data.totalPages,data.number);
            }
        });
    });

    let datetime = function (data) {
        let date = new Date(data);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y+M+D+h+m+s;
    };

    function getAllSites(data) {
        let form = $('#form');
        form.html("");
        let formstr = '';
        formstr += `<h3 class="card-header">搜索</h3>
            <div class="card-block">
                <form class="form-inline">
                    <div class="form-group col-sm-5">
                            <label for="inputcatename" class="col-sm-2">Catename:</label>
                            <div class="col-sm-4">
                                <input  class="form-control" id="inputcatename" type="text">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="inputcomment" class="col-sm-2">Comment:</label>
                            <div class="col-sm-4">
                                <input class="form-control" type="text" id="inputcomment">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="inputsiteurl" class="col-sm-2">Siteurl:</label>
                            <div class="col-sm-4">
                                <input class="form-control" type="text" id="inputsiteurl">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="inputtitle" class="col-sm-2">Title:</label>
                            <div class="col-sm-4">
                                <input class="form-control" type="text" id="inputtitle">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="inputusername" class="col-sm-2">Username:</label>
                            <div class="col-sm-4">
                                <input class="form-control" type="text" id="inputusername">
                            </div>
                    </div>
                    <div class="form-group col-sm-1 offset-sm-5">
                        <button class="btn btn-primary searchUserSite">查询</button>
                    </div>
                </form>
            </div>`
        form.html(formstr);
        createTable(data);
    }

    function createTable(data) {
        let list = data.content;
        let table = $('#table');
        table.html("");
        let str = '';
        let i = 0;
        for(let userSite of list) {
            str +=`
                    <tr>
                        <td>${userSite.id}</td>
                        <td>${userSite.catename}</td>
                        <td>${userSite.siteurl}</td>
                        <td>${userSite.title}</td>
                        <td>${userSite.comment}</td>
                        <td>${userSite.username}</td>
                        <td>${userSite.hits}</td>
                        <td>${userSite.enable}</td>
                        <td>${datetime(userSite.createtime)}</td>
                        <td>
                            <button class="mdui-btn mdui-btn-icon editUserSite" data="${userSite.id}"><i class="mdui-icon material-icons">edit</i></button>
                            <button class="mdui-btn mdui-btn-icon deleteUserSite" data="${userSite.id}"><i class="mdui-icon material-icons">delete</i></button>
                        </td>
                    </tr>`
        }
        let thead = `<table class="mdui-table">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>catename</th>
                        <th>siteurl</th>
                        <th>title</th>
                        <th>comment</th>
                        <th>username</th>
                        <th>hits</th>
                        <th>enable</th>
                        <th>createtime</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>${str}</tbody>`;
        table.html(thead);
    }

    function pageNav(pageCount, currentNum) {
        createPageNav({$container:$("#page_nav"),pageCount:pageCount,currentNum:currentNum});
    }
    function refreshData(url, data, page = 0, type='GET') {
        let localurl = localStorage.getItem('url');
        if(localurl == '' || localurl == undefined) {
            type = 'GET';
            url = '/api/admin/userSite/getAllSites?page=';
        } else {
            type = 'POST';
            url = localurl;
        }
        url = url + (page - 1);
        console.log(url);
        // data == (data==undefined || data== '')? "" : data;
        // console.log(data);
        // let item = JSON.parse(localStorage.getItem('userSite'));
        let userSite = '';
        let item = JSON.parse(localStorage.getItem('userSite'));
        if(item != null) {
            userSite = {
                catename: (item.catename == undefined || item.catename == null) ? '': item.catename,
                comment: (item.comment == undefined || item.comment == null) ? '': item.comment,
                siteurl: (item.siteurl == undefined || item.siteurl == null) ? '': item.siteurl,
                title: (item.title == undefined || item.title == null) ? '': item.title,
                username: (item.username == undefined || item.username == null) ? '': item.username,
            };
        }


        $.ajax({
            // url: '/api/admin/userSite/getAllSites?page=' + (page - 1),
            url: url,
            data: userSite,
            type:type,
            success: function (data) {
                console.log(data);
                createTable(data);
            }
        });
    }

    // $(document).on('click', 'a .page-link', function () {
    //     let page = $(this).text();
    //     refreshData(page);
    // });


    $(document).on('click', '.searchUserSite', function (e) {
        let catename = $('#inputcatename').val();
        let comment = $('#inputcomment').val();
        let siteurl = $('#inputsiteurl').val();
        let title = $('#inputtitle').val();
        let username = $('#inputusername').val();

        let userSite = {
            catename: catename,
            comment: comment,
            siteurl: siteurl,
            title: title,
            username: username,
        };
        localStorage.setItem("userSite", JSON.stringify(userSite));
        let url = '/api/admin/userSite/searchForm?page=';
        localStorage.setItem("url",url);
        e.preventDefault();
        $.ajax({
            // url: '/api/admin/userSite/getAllSites?page=' + (page - 1),
            url: url + '0',
            data: userSite,
            type:'POST',
            success: function (data) {
                createTable(data);
                pageNav(data.totalPages, data.number);

            }
        });
        return false;
    });

    $(document).on('click', '.addUserSite', function () {
        let addDialog = $('.addDialog');
        addDialog.html("");
        let str = '';
        str += `<div class="mdui-dialog" id="addUserSiteDialog">
                            <div class="mdui-dialog-title">添加用户网站</div>
                            <div class="mdui-dialog-content">
                               <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">catename</label>
                                   <input id="addcatename" placeholder="分类名" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">分类名不能为空</span>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">siteurl</label>
                                   <input id="addsiteurl" placeholder="网址链接" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">描述不能为空</span>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">title</label>
                                   <input id="addtitle" placeholder="标题" class="mdui-textfield-input" type="text"/>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">comment</label>
                                   <input id="addcomment" placeholder="描述" class="mdui-textfield-input" type="text"/>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">username</label>
                                   <input id="addusername" placeholder="用户名" class="mdui-textfield-input" type="text"/>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">hits</label>
                                   <input id="addhits" placeholder="点击量" class="mdui-textfield-input" type="text"/>
                                </div>
                                <h4>启用?</h4>
                                <form>
                                <label class="mdui-radio">
                                    <input type="radio" name="addenable" value="true" checked/>
                                    <i class="mdui-radio-icon"></i>
                                    启用
                                        </label>
                                    <label class="mdui-radio">
                                    <input type="radio" name="addenable" value="false"/>
                                    <i class="mdui-radio-icon"></i>
                                    禁用
                                </label>
                                </form>
                            </div>
                              <div class="mdui-dialog-actions">
                                <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
                                <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>确定</button>
                              </div>
                            </div>`
        addDialog.html(str);
        setTimeout(function () {
            var inst = new mdui.Dialog('#addUserSiteDialog');
            inst.open();
        },100);
        return false;
    });

    $(document).on('confirm.mdui.dialog', '#addUserSiteDialog', function () {
        let catename = $('#addcatename').val();
        let siteurl = $('#addsiteurl').val();
        let title = $('#addtitle').val();
        let comment = $('#addcomment').val();
        let username = $('#addusername').val();
        let hits = $('#addhits').val();
        let enable = $('input[name="addenable"]:checked').val();
        let userSite = {
            catename: catename,
            siteurl: siteurl,
            title: title,
            comment: comment,
            username: username,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: '/api/admin/userSite/AddUserSite',
            data: userSite,
            type: 'POST',
            success: function (data) {
                if (data.statu == "yes") {
                    mdui.snackbar({
                        message: '添加成功'
                    });
                } else {
                    mdui.alert(data.message);
                }
            }
        });
    });

    $(document).on('click','.editUserSite', function () {

        $('.editDialog').html('');
        let id = $(this).attr('data');

        $.ajax({
            url:'/api/admin/userSite/getUserSiteById/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                editDialog(data);
            }
        });
        setTimeout(function () {
            var inst = new mdui.Dialog('#editUserSiteDialog');
            inst.open();
        },1000);
        return false;

    });
    function editDialog(data) {
        let editDialog = $('.editDialog');
        editDialog.html('');
        let userSite = data.userSite;
        let radioEnabled = '';
        if(true == userSite.enable) {
            radioEnabled+= `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editEnable" value="true" checked/>
                    <i class="mdui-radio-icon"></i>
                    Enable
                        </label></div>
                    <div class="mdui-col">
                    <label class="mdui-radio">
                    <input type="radio" name="editEnable" value="false"/>
                    <i class="mdui-radio-icon"></i>
                    disabled
                </label></div>`
        } else {
            radioEnabled+= `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editEnable" value="true"/>
                    <i class="mdui-radio-icon"></i>
                    Enable
                        </label></div>
                    <div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editEnable" value="false" checked/>
                    <i class="mdui-radio-icon"></i>
                    disabled
                </label></div>`
        }

        let dialoghtml = '';
        dialoghtml += `<div class="mdui-dialog" id="editUserSiteDialog">
        <input id="editid" type="hidden" class="edit" value="${userSite.id}">
        <div class="mdui-dialog-title">修改系统网站</div>
        <div class="mdui-dialog-content">
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">catename</label>
                <input id="editcatename" class="mdui-textfield-input" type="text" value="${userSite.catename}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">siteurl</label>
                <input id="editsiteurl" class="mdui-textfield-input" type="text" value="${userSite.siteurl}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">title</label>
                <input id="edittitle" placeholder="标题" class="mdui-textfield-input" type="text" value="${userSite.title}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">comment</label>
                <input id="editcomment" placeholder="描述" class="mdui-textfield-input" type="text" value="${userSite.comment}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">username</label>
                <input id="editusername" placeholder="用户名" class="mdui-textfield-input" type="text" value="${userSite.username}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">hits</label>
                <input id="edithits" placeholder="点击量" class="mdui-textfield-input" type="number" value="${userSite.hits}"/>
            </div>
            <h4>Enable?</h4>
            <div class="mdui-row-md-4">
            <form>
            ${radioEnabled}
            </form>
            </div>
        </div>
        <div class="mdui-dialog-actions">
            <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
            <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>保存</button>
        </div>
    </div></form>`;
        editDialog.append(dialoghtml);
        return false;
    };

    $(document).on('confirm.mdui.dialog', '#editUserSiteDialog', function () {
        let id = $('#editid').val();
        let catename = $('#editcatename').val();
        let siteurl = $('#editsiteurl').val();
        let title = $('#edittitle').val();
        let comment = $('#editcomment').val();
        let username = $('#editusername').val();
        let hits = $('#edithits').val();
        let enable = $('input[name="editEnable"]:checked').val();
        let url = '/api/admin/userSite/updateUserSite/' + id;
        let userSite = {
            catename: catename,
            siteurl: siteurl,
            title: title,
            comment: comment,
            username: username,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: url,
            data: userSite,
            type:'PUT',
            success: function (data) {
                if (data.statu == "yes") {
                    mdui.snackbar({
                        message: '修改成功'
                    });
                } else {
                    mdui.alert(data.message);
                }
            }

        });
    });
    $(document).on('click', '.deleteUserSite', function () {
        let id = $(this).attr('data');
        let deleteDialog = $('.deleteDialog');
        deleteDialog.html('');
        let deleteDialoghtml = '';
        deleteDialoghtml += `<div class="mdui-dialog" id="deleteUserSiteDialog">
        <input id="deleteid" type="hidden" value="${id}">
                            <div class="mdui-dialog-title">确定删除?</div>
                            <div class="mdui-dialog-content">
                               删除后无法恢复
                            </div>
                              <div class="mdui-dialog-actions">
                                <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
                                <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>确定</button>
                              </div>
                            </div>`;
        deleteDialog.append(deleteDialoghtml);
        var inst = new mdui.Dialog('#deleteUserSiteDialog');
        inst.open();
        return false;
    });
    $(document).on('confirm.mdui.dialog','#deleteUserSiteDialog',function () {
        let id = $('#deleteid').val();
        $.ajax({
            url: '/api/admin/userSite/' + id,
            type: 'DELETE',
            success:function (data) {
                if (data.statu =='yes'){
                    mdui.snackbar({
                        message: '删除成功'
                    });
                } else {
                    mdui.alert(data.message);
                }
            }
        });
    });
});
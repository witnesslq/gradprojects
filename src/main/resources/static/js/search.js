/**
 * Created by mafuz on 2017/5/11.
 */
$(function () {
    $(window).blur(function () {
        console.log(111);
    })

    var $search = $('.searchInput');
    function search() {
        var url = '/s/' + $search.val();
        $('.navlistitem').removeClass("mdui-list-item-active");
        // var currentState = {
        //     url: document.location.href,
        //     title: '',
        //     html: $('body').html(),
        // }
        $.ajax({
            url: '/api/site/search/' + $search.val(),
            method: 'GET',
            success:function (data) {
                var sitNode = $('.mdui-container');
                var navNode = $('.navlist');
                sitNode.html("");
                var strhtml = '';
                var list = data.userSiteList;
                for(var usersite of list) {
                    strhtml += `<div class="mdui-col-sm-6 mdui-col-md-3" style="margin-top: 1rem">
<div class="mdui-card opensite" href="${usersite.siteurl}">
            <div class="mdui-card-media">
                <img src="http://mini.s-shot.ru/1024x768/400/jpeg/?${usersite.siteurl}" style="overflow: hidden; width: 250px;height: 200px"/>
                <div class="mdui-card-media-covered mdui-card-media-covered-top mdui-card-media-covered-transparent" style="background-color: rgb(242,242,242)">
                    <li class="mdui-list-item">
                        <div class="mdui-list-item-avatar"><img src="https://api.byi.pw/favicon/?url=${usersite.siteurl}"/></div>
                        <div class="mdui-list-item-content">${usersite.comment}</div>
                        <div class="mdui-card-menu">
                <button class="mdui-btn mdui-btn-icon cardmenu" id="${usersite.id}open" mdui-menu="{target:'#${usersite.id}menu',position:'bottom',align:'right'}"><i class="mdui-icon material-icons">more_vert</i></button>

                <ul class="mdui-menu" id="${usersite.id}menu">
                    <li class="mdui-menu-item edit" dataid="${usersite.id}">
                        <a href="javascript:;" class="mdui-ripple"><i class="mdui-menu-item-icon mdui-icon material-icons">edit</i>修改</a>
                    </li>
                    <li class="mdui-menu-item move" dataid="${usersite.id}">
                        <a href="javascript:;" class="mdui-ripple"><i class="mdui-menu-item-icon mdui-icon material-icons">near_me</i>移动</a>
                    </li>
                    <li class="mdui-menu-item delete" dataid="${usersite.id}">
                        <a href="javascript:;"><i class="mdui-menu-item-icon mdui-icon material-icons">delete</i>删除</a>
                    </li>
                    
                </ul>
            </div>
                    </li>
                </div>
            </div>
            <div class="mdui-card-actions">
                <div class="mdui-float-left">
                    <div class="mdui-card-primary-title">${usersite.title}</div>
                    <div class="mdui-card-primary-subtitle">${usersite.siteurl}</div>
                </div>
            </div>
        </div>
            </div>`
                }
                var toolbar = `<div class="mdui-typo" style="margin-top: 2rem"><h2 class="mdui-text-color-theme">搜索结果:</h2></div>`;
                sitNode.append(toolbar);
                strhtml = `<div class="mdui-row">${strhtml}</div>`;
                sitNode.append(strhtml);

                var sysList = data.sysSiteList;
                var sysCard = '';
                for(var syssite of sysList) {
                    sysCard += `<div class="mdui-col-sm-6 mdui-col-md-3" style="margin-top: 1rem">
<div class="mdui-card opensite" href="${syssite.siteurl}">
            <div class="mdui-card-media">
                <img src="http://mini.s-shot.ru/1024x768/400/jpeg/?${syssite.siteurl}" style="overflow: hidden; width: 250px;height: 200px"/>
                <div class="mdui-card-media-covered mdui-card-media-covered-top mdui-card-media-covered-transparent" style="background-color: rgb(242,242,242)">
                    <li class="mdui-list-item">
                        <div class="mdui-list-item-avatar"><img src="https://api.byi.pw/favicon/?url=${syssite.siteurl}"/></div>
                        <div class="mdui-list-item-content">${syssite.comment}</div>
                        <div class="mdui-card-menu">
                        </div>
                    </li>
                </div>
            </div>
            <div class="mdui-card-primary">
                        <div class="mdui-card-primary-title">${syssite.title}</div>
                        <div class="mdui-card-primary-subtitle">${syssite.siteurl}</div>
                    </div>
            <div class="mdui-card-actions">
               <button class="addToUser mdui-btn mdui-ripple mdui-btn-block mdui-color-deep-purple-900" data="${syssite.id}">添加</button>
            </div>
        </div>
            </div>`
                }
                if (sysList.length > 0) {
                    var sysToolbar = `<div class="mdui-typo" style="margin-top: 2rem"><h3 class="mdui-text-color-theme">系统结果:</h3></div>`;
                    sitNode.append(sysToolbar);
                }
                sitNode.append(sysCard);
                var html = sitNode.html();
                var navlistitem = $(navNode).html();
                var state = {
                    url: url,
                    title: '',
                    html: html,
                    navlist: navlistitem
                };
                history.pushState(state, '', url);
            }
        })

    }

    $('.searchInput').keydown(function (event) {
        if ($search.val() == "") {
            return false;
        }
        if (event.keyCode == '13') {
            search();
        }
    });

    $(document).on('click', '.addToUser', function () {
        let id = $(this).attr('data');
        let $this = $(this);
        $.ajax({
            url: '/api/site/addToUser',
            method: 'POST',
            data: {
                id: id,
            },
            success:function (data) {
                if(data.statu == 'yes') {
                    mdui.snackbar({
                        message: '添加成功'
                    });
                    $this.text("已添加")
                    $this.attr("disabled","disabled");
                } else {
                    mdui.snackbar({
                        message: data.message
                    });
                }
            }
        });
        return false;
    })


})
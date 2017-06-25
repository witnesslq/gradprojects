(function($){
	var ajax;
	var currentState;
	$.fn.historyLoad = function(target,navlist){
		var obj = this;
		$(document).on('click','.navlistitem',function (){
            $(this).addClass("mdui-list-item-active").siblings().removeClass("mdui-list-item-active");
            $('.title').text($(this).text());
			var catename = $(this).attr('name');
			var url = '/cate/' + catename;
			if(ajax == null){
				currentState = {
					url: document.location.href,
					title: '',
					html: $(target).html(),
					navlist: $(navlist).html()
				};
			}else{
				ajax.abort();
			}
			ajax = $.ajax({
                url : '/api/site/' + catename,
                method: 'GET',
                success:function (data) {
                    if(catename != 'setting') {
                        var sitNode = $('.mdui-container');
                        var navNode = $('.navlist');
                        sitNode.html("");
                        var strhtml = '';
                        var list = data.userSiteList;
                        for(var usersite of list) {
                            strhtml += `<div class="mdui-col-sm-6 mdui-col-md-3" style="margin-top: 1rem">
<div class="mdui-card opensite" data="${usersite.id}" href="${usersite.siteurl}">
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
                        strhtml = `<div class="mdui-row">${strhtml}</div>`;
                        sitNode.append(strhtml);

                        var record = data.userSites;
                        if(record != '' && record != null) {
                            var recordCard = '';
                            var judgeButton = '';
                            for(var usersite of record) {
                                if(usersite.username != '' && usersite.username != null) {
                                    judgeButton = '<button class="mdui-btn mdui-ripple mdui-btn-block mdui-color-deep-purple-900" disabled="disabled">已添加</button>';
                                } else {
                                    judgeButton = `<button class="addRecordToUser mdui-btn mdui-ripple mdui-btn-block mdui-color-deep-purple-900" data="${usersite.id}">添加</button>`
                                }
                                recordCard += `<div class="mdui-col-sm-6 mdui-col-md-3" style="margin-top: 1rem">
<div class="mdui-card opensite" href="${usersite.siteurl}">
            <div class="mdui-card-media">
                <img src="http://mini.s-shot.ru/1024x768/400/jpeg/?${usersite.siteurl}" style="overflow: hidden; width: 250px;height: 200px"/>
                <div class="mdui-card-media-covered mdui-card-media-covered-top mdui-card-media-covered-transparent" style="background-color: rgb(242,242,242)">
                    <li class="mdui-list-item">
                        <div class="mdui-list-item-avatar"><img src="https://api.byi.pw/favicon/?url=${usersite.siteurl}"/></div>
                        <div class="mdui-list-item-content">${usersite.comment}</div>
                        <div class="mdui-card-menu">
                        </div>
                    </li>
                </div>
            </div>
            <div class="mdui-card-primary">
                        <div class="mdui-card-primary-title">${usersite.title}</div>
                        <div class="mdui-card-primary-subtitle">${usersite.siteurl}</div>
                    </div>
            <div class="mdui-card-actions">
               ${judgeButton}
            </div>
        </div>
            </div>`
                            }
                            if (record.length > 0) {
                                var recordToolbar = `<div class="mdui-typo" style="margin-top: 2rem"><h3 class="mdui-text-color-theme">推荐:</h3></div>`;
                                sitNode.append(recordToolbar);
                            }
                            recordCard = `<div class="mdui-row">${recordCard}</div>`;
                            sitNode.append(recordCard);
                        }

                        var html = sitNode.html();
                        var navlistitem = $(navNode).html();
                        var state = {
                            url: url,
                            title: '',
                            html: html,
                            navlist: navlistitem
                        };
                        history.pushState(state, '', url);
                        $(target).html(html);
                        $(obj).historyLoad(target,navlist);
                    } else {
                        var sitNode = $('.mdui-container');
                        var navNode = $('.navlist');
                        sitNode.html("");
                        var strhtml = '';
                        var list = data.userCates;
                        var $li = '';
                        var $ul = '';
                        let checkBoxStr = '';
                        for(var userCate of list) {
                            if(userCate.enable == true) {
                                checkBoxStr = `<input type="checkbox" class="enableCheckBox" name="enableCheckBox" data="${userCate.catename}" isChecked="yes" checked/>`;
                            } else {
                                checkBoxStr = `<input type="checkbox" class="enableCheckBox" name="enableCheckBox" data="${userCate.catename}" isChecked="no" />`;
                            }
                            $li += `<li class="mdui-list-item mdui-ripple" data="${userCate.catename}">
    <div class="mdui-list-item-content">${userCate.description}</div>
    <label class="mdui-switch">
      ${checkBoxStr}
      <i class="mdui-switch-icon"></i>
    </label>
  </li>`
                        }
                        $ul = `<ul class="mdui-list">${$li}</ul>`;
                        let $panelitem = `<div class="mdui-panel-item mdui-panel-item-open">
    <div class="mdui-panel-item-header">显示/隐藏分类</div>
    <div class="mdui-panel-item-body">
      ${$ul}
    </div>
  </div>`
                        let $panel = `<div class="mdui-panel" mdui-panel="{accordion: true}" id="panel">${$panelitem}</div>`
                        strhtml = `<div class="mdui-row">${$panel}</div>`;
                        sitNode.append(strhtml);
                        $li = '';
                        for(var userCate of list) {
                            $li += `<li class="mdui-list-item mdui-ripple" data="${userCate.catename}">
    <div class="mdui-list-item-content">${userCate.description}</div>
    <button class="mdui-btn mdui-btn-icon editUserCate" data-catename="${userCate.catename}"><i class="mdui-icon material-icons">edit</i></button>
    <button class="mdui-btn mdui-btn-icon deleteUserCate" data="${userCate.id}"><i class="mdui-icon material-icons">delete</i></button>
  </li>`
                        }
                        $ul = `<ul class="mdui-list">${$li}</ul>`;
                        $panelitem = `<div class="mdui-panel-item mdui-panel-item-open">
    <div class="mdui-panel-item-header">修改/删除分类</div>
    <div class="mdui-panel-item-body">
      ${$ul}
    </div>
  </div>`
                        $panel = `<div class="mdui-panel" mdui-panel="{accordion: true}" id="panel">${$panelitem}</div>`
                        strhtml = `<div class="mdui-row">${$panel}</div>`;
                        sitNode.append(strhtml);
                        var html = sitNode.html();
                        var navlistitem = $(navNode).html();
                        var state = {
                            url: url,
                            title: '',
                            html: html,
                            navlist: navlistitem
                        };
                        history.pushState(state, '', url);
                        $(target).html(html);
                        $(obj).historyLoad(target,navlist);

                    }

                }
            });
			return false;
		});



		window.onpopstate = function(event){
			if(ajax == null){
				return;
			}else if(event && event.state){
				document.title = event.state.title;
				$(target).html(event.state.html);
				console.log(event.state.navlist);
				$(navlist).html(event.state.navlist);
			}else{
				document.title = currentState.title;
				$(target).html(currentState.html);
                console.log(currentState.navlist);
				$(navlist).html(currentState.navlist);
			}
		}
	}
	
	function setting() {
		
    }
})(jQuery);
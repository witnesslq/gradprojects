/**
 * Created by mafuz on 2017/4/2.
 */
$(document).ready(function () {

    var second = 0;
    var intervalid;
    $.fn.getSiteByCatename = function (catename) {
        $.ajax({
            url : '/api/site/' + catename,
            method: 'GET',
            success:function (data) {
                sitedata(data);
            }
        });
    };
    $(document).on('click','.cardmenu', function () {
        return false;
    })

    $(document).on('click', '.opensite',function () {
        let href = $(this).attr("href");
        let id = $(this).attr("data");
        window.open(href);
        window.onblur = function () {
            intervalid = setInterval(function () {
                second++;
                localStorage.setItem('time', second);
            },1000);
            localStorage.setItem('clickId',id);

        };
    });

    window.onfocus = function () {
        let href = window.document.location.href
        let pos = href.indexOf(window.document.location.pathname);
        let url = href.substring(0,pos);
        if(localStorage.getItem('time') && localStorage.getItem('clickId')) {
            clearInterval(intervalid);
            (new Image).src = url+ '/record/' + localStorage.getItem('clickId') + '/time/' + localStorage.getItem('time');
            second = 0;
        }
        localStorage.removeItem('time');
        localStorage.removeItem('clickId');

    }

    function sitedata(data) {
        var sitNode = $('.mdui-container');
        sitNode.html("");
        var strhtml = '';
        var list = data.userSiteList;
        for(var usersite of list) {
            strhtml += `<div class="mdui-col-sm-6 mdui-col-md-3">
                <div class="mdui-card">

            <div class="mdui-card-media">
                <img src="http://iph.href.lu/250x200"/>
                <div class="mdui-card-media-covered mdui-card-media-covered-top mdui-card-media-covered-transparent">
                    <li class="mdui-list-item">
                        <div class="mdui-list-item-avatar"><img src="https://api.byi.pw/favicon/?url=${usersite.siteurl}"/></div>
                        <div class="mdui-list-item-content">${usersite.comment}</div>
                        <div class="mdui-card-menu">
                <button class="mdui-btn mdui-btn-icon" id="${usersite.id}open" mdui-menu="{target:'#${usersite.id}menu',position:'bottom',align:'right'}"><i class="mdui-icon material-icons">more_vert</i></button>

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
        sitNode.append(strhtml);

    }

    $(document).on('click','.edit', function () {

        $('.editDialog').html('');
        var id = $(this).attr('dataid');

        $.ajax({
            url:'/api/site/siteDetail/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                editDialog(data);
            }
        });
        setTimeout(function () {
            var inst = new mdui.Dialog('#dialog');
            inst.open();
        },1000);
        return false;

    });
    function editDialog(data) {
        var editDialog = $('.editDialog');
        editDialog.html('');
        var usersite = data.userSite;
        var radioform = '';
        var radioEnabled = '';
        var catenameRadio = data.catename;
        for(let catename of catenameRadio) {
            if(catename == usersite.catename) {
                radioform += `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editgroup" value="${catename}" checked/>
                    <i class="mdui-radio-icon"></i>
                    ${catename}
                </label></div>`
            } else {
                radioform += `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editgroup" value="${catename}"/>
                    <i class="mdui-radio-icon"></i>
                    ${catename}
                </label></div>`
            }
        }
        if(true == usersite.enable) {
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
            radioEnabled+= `<label class="mdui-radio">
                    <input type="radio" name="editEnable" value="true"/>
                    <i class="mdui-radio-icon"></i>
                    Enable
                        </label>
                    <label class="mdui-radio">
                    <input type="radio" name="editEnable" value="false" checked/>
                    <i class="mdui-radio-icon"></i>
                    disabled
                </label>`
        }
        var dialoghtml = '';
        dialoghtml += `<div class="mdui-dialog" id="dialog">
        <input id="editid" type="hidden" class="edit" value="${usersite.id}">
        <div class="mdui-dialog-title">${usersite.title}</div>
        <div class="mdui-dialog-content">
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">title</label>
                <input id="edittitle" class="mdui-textfield-input" type="text" value="${usersite.title}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">comment</label>
                <input id="editcomment" class="mdui-textfield-input comment" type="text" value="${usersite.comment}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">siteurl</label>
                <input id="editurl" class="mdui-textfield-input siteurl" type="text" value="${usersite.siteurl}"/>
            </div>
            <h4>catename</h4>
            <div class="mdui-row-md-4">
            <form>
                ${radioform}
            </form>
            </div>
            <h4>statu</h4>
            <div class="mdui-row-md-4">
            <form>
            ${radioEnabled}
            </form>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">hits</label>
                <input class="mdui-textfield-input" type="text" value="${usersite.hits}" disabled/>
            </div>
        </div>
        <div class="mdui-dialog-actions">
            <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
            <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>保存</button>
        </div>
    </div></form>`;
        editDialog.append(dialoghtml);
    }

    $(document).on('confirm.mdui.dialog','#dialog',function () {
        let id = $('#editid').val();
        let catename = $('input[name="editgroup"]:checked ').val();
        let comment = $('#editcomment').val();
        let siteurl = $('#editurl').val();
        let enable = $('input[name="editEnable"]:checked ').val();
        let title = $('#edittitle').val();
        let userSite = {
            id: id,
            catename: catename,
            comment: comment,
            siteurl: siteurl,
            title: title,
            enable: enable,
        }
        $.ajax({
            url: '/api/site/' + id,
            method: 'PUT',
            data: userSite,
            success:function (data) {
                if (data.statu =='yes'){
                    console.log("添加成功");
                    $('.mdui-list-item-active').trigger('click');
                } else {
                    alert(data);
                }
            }
        });
    });

    $(document).on('click','.move',function () {
        $('.moveDialog').html('');
        let id = $(this).attr('dataid');
        $.ajax({
            url:'/api/site/siteDetail/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                moveDialog(data);
            }
        });
        setTimeout(function () {
            var inst = new mdui.Dialog('#moveDialog');
            inst.open();
        },1000);
        return false;
    });
    function moveDialog(data) {
        var moveDialog = $('.moveDialog');
        let usersite = data.userSite;
        let catenameRadio = data.catename;
        let moveRadiohtml = '';
        for(let catename of catenameRadio) {
            if(catename == usersite.catename) {
                moveRadiohtml += `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="movegroup" value="${catename}" checked/>
                    <i class="mdui-radio-icon"></i>
                    ${catename}
                </label></div>`
            } else {
                moveRadiohtml += `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="movegroup" value="${catename}"/>
                    <i class="mdui-radio-icon"></i>
                    ${catename}
                </label></div>`
            }
        }
        let movedialoghtml = '';
        movedialoghtml += `<div class="mdui-dialog" id="moveDialog">
        <input id="moveid" type="hidden" class="edit" value="${usersite.id}">
                            <div class="mdui-dialog-title">转移分类</div>
                            <div class="mdui-dialog-content">
                            <div class="mdui-row-md-4">
                            <form>
                            ${moveRadiohtml}
                            </form>
                            </div>
                              <div class="mdui-dialog-actions">
                                <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
                                <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>确定</button>
                              </div>
                            </div>`;

        moveDialog.append(movedialoghtml);

    }
    $(document).on('confirm.mdui.dialog','#moveDialog',function () {
        let id = $('#moveid').val();
        let catename = $('input[name="movegroup"]:checked ').val();
        let userSite = {
            id: id,
            catename: catename,
        };
        $.ajax({
            url: '/api/site/updatecatename/' + id,
            method: 'PUT',
            data: userSite,
            success:function (data) {
                if (data.statu =='yes'){
                    $('.mdui-list-item-active').trigger('click');
                } else {
                    alert(data);
                }
            }
        });
    });

    $(document).on('click', '.delete', function () {
        $('.deleteDialog').html('');
        let id = $(this).attr('dataid');
        let deleteDialog = $('.deleteDialog');
        deleteDialog.html('');
        let deleteDialoghtml = '';
        deleteDialoghtml += `<div class="mdui-dialog" id="deleteDialog">
        <input id="deleteid" type="hidden" class="edit" value="${id}">
                            <div class="mdui-dialog-title">确定删除?</div>
                            <div class="mdui-dialog-content">
                               删除后无法恢复
                            </div>
                              <div class="mdui-dialog-actions">
                                <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
                                <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>确定</button>
                              </div>
                            </div>`
        deleteDialog.append(deleteDialoghtml);
        var inst = new mdui.Dialog('#deleteDialog');
        inst.open();
        return false;
    });
    $(document).on('confirm.mdui.dialog','#deleteDialog',function () {
        let id = $('#deleteid').val();
        $.ajax({
            url: '/api/site/' + id,
            method: 'DELETE',
            success:function (data) {
                if (data.statu =='yes'){
                    $('.mdui-list-item-active').trigger('click');
                    console.log("删除成功");
                } else {
                    alert(data);
                }
            }
        });
    });
})
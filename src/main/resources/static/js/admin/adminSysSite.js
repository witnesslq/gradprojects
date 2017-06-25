/**
 * Created by mafuz on 2017/4/8.
 */
/**
 * Created by mafuz on 2017/4/8.
 */
$(document).ready(function () {
    $('#adminSysSite').click(function () {
        $.ajax({
            url: '/api/admin/site/getAllSites',
            type:'GET',
            success: function (data) {
                getAllSites(data);
                createFab();
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
                            <label for="searchcatename" class="col-sm-2">Catename:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchcatename" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="searchsiteurl" class="col-sm-2">SiteUrl:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchsiteurl" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="searchtitle" class="col-sm-2">Title:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchtitle" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="searchcomment" class="col-sm-2">Comment:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchcomment" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-1">
                        <button class="btn btn-primary sysSiteSearch">查询</button>
                    </div>
                </form>
            </div>`
        form.html(formstr);
        createTable(data);
    }

    function createFab() {
        let $fab = $('.fab');
        $fab.html('');
        let fabstr = '';
        fabstr += `<button class="mdui-fab mdui-fab-fixed mdui-ripple addSysSite"><i class="mdui-icon material-icons">&#xe145;</i></button>`
        $fab.append(fabstr);
    }

    function createTable(data) {
        let list = data.sysSiteList;
        let table = $('#table');
        table.html("");
        let str = '';
        let i = 0;
        for(let sysSite of list) {
            i++;
            str +=`
                    <tr>
                        <td>${i}</td>
                        <td>${sysSite.id}</td>
                        <td>${sysSite.catename}</td>
                        <td>${sysSite.siteurl}</td>
                        <td>${sysSite.title}</td>
                        <td>${sysSite.comment}</td>
                        <td>${sysSite.hits}</td>
                        <td>${sysSite.enable}</td>
                        <td>${datetime(sysSite.createtime)}</td>
                        <td>
                            <button class="mdui-btn mdui-btn-icon editSysSite" data="${sysSite.id}"><i class="mdui-icon material-icons">edit</i></button>
                            <button class="mdui-btn mdui-btn-icon deleteSysSite" data="${sysSite.id}"><i class="mdui-icon material-icons">delete</i></button>
                        </td>
                    </tr>`
        }
        let thead = `<table class="mdui-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>id</th>
                        <th>catename</th>
                        <th>siteurl</th>
                        <th>title</th>
                        <th>comment</th>
                        <th>hits</th>
                        <th>enable</th>
                        <th>createtime</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>${str}</tbody>`;
        table.html(thead);
    }

    $(document).on('click', '.sysSiteSearch', function () {
        let catename = $('#searchcatename').val();
        let siteurl = $('#searchsiteurl').val();
        let title = $('#searchtitle').val();
        let comment = $('#searchcomment').val();
        if (catename == ''&& siteurl == '' && title== '' && comment == '') {
            return false;
        }
        let sysSite = {
            catename: catename,
            siteurl: siteurl,
            title: title,
            comment: comment,
        };
        $.ajax({
            url: '/api/admin/searchSysSite',
            method: 'POST',
            data: sysSite,
            success:function (data) {
                createTable(data);
            }
        });
        return false;

    });
    $(document).on('click', '.addSysSite', function () {
        let addDialog = $('.addDialog');
        addDialog.html("");
        let str = '';
        str += `<div class="mdui-dialog" id="addSysSiteDialog">
                            <div class="mdui-dialog-title">添加系统网站</div>
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
            var inst = new mdui.Dialog('#addSysSiteDialog');
            inst.open();
        },100);
        return false;
    });

    $(document).on('confirm.mdui.dialog', '#addSysSiteDialog', function () {
        let catename = $('#addcatename').val();
        let siteurl = $('#addsiteurl').val();
        let title = $('#addtitle').val();
        let comment = $('#addcomment').val();
        let hits = $('#addhits').val();
        let enable = $('input[name="addenable"]:checked').val();
        let sysSite = {
            catename: catename,
            siteurl: siteurl,
            title: title,
            comment: comment,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: '/api/admin/site',
            data: sysSite,
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

    $(document).on('click','.editSysSite', function () {

        $('.editDialog').html('');
        let id = $(this).attr('data');

        $.ajax({
            url:'/api/admin/site/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                editDialog(data);
            }
        });
        setTimeout(function () {
            var inst = new mdui.Dialog('#editSysSiteDialog');
            inst.open();
        },1000);
        return false;

    });
    function editDialog(data) {
        let editDialog = $('.editDialog');
        editDialog.html('');
        let sysSite = data.sysSite;
        let radioEnabled = '';
        if(true == sysSite.enable) {
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
        dialoghtml += `<div class="mdui-dialog" id="editSysSiteDialog">
        <input id="editid" type="hidden" class="edit" value="${sysSite.id}">
        <div class="mdui-dialog-title">修改系统网站</div>
        <div class="mdui-dialog-content">
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">catename</label>
                <input id="editcatename" class="mdui-textfield-input" type="text" value="${sysSite.catename}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">siteurl</label>
                <input id="editsiteurl" class="mdui-textfield-input" type="text" value="${sysSite.siteurl}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">title</label>
                <input id="edittitle" placeholder="标题" class="mdui-textfield-input" type="text" value="${sysSite.title}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">comment</label>
                <input id="editcomment" placeholder="描述" class="mdui-textfield-input" type="text" value="${sysSite.comment}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">hits</label>
                <input id="edithits" placeholder="点击量" class="mdui-textfield-input" type="number" value="${sysSite.hits}"/>
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

    $(document).on('confirm.mdui.dialog', '#editSysSiteDialog', function () {
        let catename = $('#editcatename').val();
        let siteurl = $('#editsiteurl').val();
        let title = $('#edittitle').val();
        let comment = $('#editcomment').val();
        let hits = $('#edithits').val();
        let enable = $('input[name="editEnable"]:checked').val();
        let url = '/api/admin/site/' + id;
        let sysSite = {
            catename: catename,
            siteurl: siteurl,
            title: title,
            comment: comment,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: url,
            data: sysSite,
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
    $(document).on('click', '.deleteSysSite', function () {
        let id = $(this).attr('data');
        let deleteDialog = $('.deleteDialog');
        deleteDialog.html('');
        let deleteDialoghtml = '';
        deleteDialoghtml += `<div class="mdui-dialog" id="deleteSysSiteDialog">
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
        var inst = new mdui.Dialog('#deleteSysSiteDialog');
        inst.open();
        return false;
    });
    $(document).on('confirm.mdui.dialog','#deleteSysSiteDialog',function () {
        let id = $('#deleteid').val();
        $.ajax({
            url: '/api/admin/site/' + id,
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
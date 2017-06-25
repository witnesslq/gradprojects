/**
 * Created by mafuz on 2017/4/8.
 */
/**
 * Created by mafuz on 2017/4/8.
 */
$(document).ready(function () {
    $('#adminUserCate').click(function () {
        $.ajax({
            url: '/api/admin/getAllUserCates',
            type:'GET',
            success: function (data) {
                getAllCates(data);
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
    $(document).on('click', '.searchUserCate', function () {
        let catename = $('#searchusercatename').val();
        let description = $('#searchusercatedescription').val();
        let username = $('#searchusercateusername').val();
        if (catename == ''&& description == '' && username== '') {
            return false;
        }
        let userCate = {
            catename: catename,
            description: description,
            username: username,
        }
        $.ajax({
            url: '/api/admin/findUserCate',
            type: 'POST',
            data: userCate,
            success:function (data) {
                createTable(data);
            }
        });
        return false;
    });

    function getAllCates(data) {
        let form = $('#form');
        form.html("");
        let formstr = '';
        formstr += `<h3 class="card-header">搜索</h3>
            <div class="card-block">
                <form class="form-inline">
                    <div class="form-group col-sm-5">
                            <label for="searchusercatename" class="col-sm-2">Catename:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchusercatename" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="searchusercatedescription" class="col-sm-2">Description:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchusercatedescription" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-5">
                            <label for="searchusercateusername" class="col-sm-2">Username:</label>
                            <div class="col-sm-4">
                                <input type="text" id="searchusercateusername" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-1 offset-sm-5">
                        <button class="btn btn-primary searchUserCate">查询</button>
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
        fabstr += `<button class="mdui-fab mdui-fab-fixed mdui-ripple addUserCate"><i class="mdui-icon material-icons">&#xe145;</i></button>`
        $fab.append(fabstr);
    }

    function createTable(data) {
        let list = data.userCateList;
        let table = $('#table');
        table.html("");
        let str = '';
        let i = 0;
        for(let userCate of list) {
            i++;
            str +=`
                    <tr>
                        <td>${i}</td>
                        <td>${userCate.id}</td>
                        <td>${userCate.catename}</td>
                        <td>${userCate.description}</td>
                        <td>${userCate.username}</td>
                        <td>${userCate.hits}</td>
                        <td>${userCate.enable}</td>
                        <td>${datetime(userCate.createtime)}</td>
                        <td>
                            <button class="mdui-btn mdui-btn-icon editUserCate" data="${userCate.id}"><i class="mdui-icon material-icons">edit</i></button>
                            <button class="mdui-btn mdui-btn-icon deleteUserCate" data="${userCate.id}"><i class="mdui-icon material-icons">delete</i></button>
                        </td>
                    </tr>`
        }
        let thead = `<table class="mdui-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>id</th>
                        <th>catename</th>
                        <th>description</th>
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
    $(document).on('click', '.addUserCate', function () {
        let addDialog = $('.addDialog');
        addDialog.html("");
        let str = '';
        str += `<div class="mdui-dialog" id="addUserCateDialog">
                            <div class="mdui-dialog-title">添加用户分类</div>
                            <div class="mdui-dialog-content">
                               <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">catename</label>
                                   <input id="addcatename" placeholder="分类名" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">分类名不能为空</span>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">description</label>
                                   <input id="adddescription" placeholder="描述" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">描述不能为空</span>
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
            var inst = new mdui.Dialog('#addUserCateDialog');
            inst.open();
        },100);
        return false;
    });

    $(document).on('confirm.mdui.dialog', '#addUserCateDialog', function () {
        let catename = $('#addcatename').val();
        let description = $('#adddescription').val();
        let username = $('#addusername').val();
        let hits = $('#addhits').val();
        let enable = $('input[name="addenable"]:checked').val();
        let userCate = {
            catename: catename,
            description: description,
            username: username,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: '/api/admin/userCate',
            data: userCate,
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

    $(document).on('click','.editUserCate', function () {

        $('.editDialog').html('');
        let id = $(this).attr('data');

        $.ajax({
            url:'/api/admin/getUserCate/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                editDialog(data);
            }
        });
        setTimeout(function () {
            let inst = new mdui.Dialog('#editUserCateDialog');
            inst.open();
        },1000);
        return false;

    });
    function editDialog(data) {
        let editDialog = $('.editDialog');
        editDialog.html('');
        let userCate = data.userCate;
        let radioEnabled = '';
        if(true == userCate.enable) {
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
        dialoghtml += `<div class="mdui-dialog" id="editUserCateDialog">
        <input id="editid" type="hidden" class="edit" value="${userCate.id}">
        <div class="mdui-dialog-title">修改用户分类</div>
        <div class="mdui-dialog-content">
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">catename</label>
                <input id="editcatename" class="mdui-textfield-input" type="text" value="${userCate.catename}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">description</label>
                <input id="editdescription" class="mdui-textfield-input" type="text" value="${userCate.description}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">username</label>
                <input id="editusername" class="mdui-textfield-input" type="text" value="${userCate.username}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">hits</label>
                <input id="edithits" placeholder="点击量" class="mdui-textfield-input" type="number" value="${userCate.hits}"/>
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

    $(document).on('confirm.mdui.dialog', '#editUserCateDialog', function () {
        let id = $('#editid').val();
        let catename = $('#editcatename').val();
        let description = $('#editdescription').val();
        let username = $('#editusername').val();
        let hits = $('#edithits').val();
        let enable = $('input[name="editEnable"]:checked').val();
        let url = '/api/admin/userCate/' + id;
        let userCate = {
            catename: catename,
            description: description,
            username: username,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: url,
            data: userCate,
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
    $(document).on('click', '.deleteUserCate', function () {
        let id = $(this).attr('data');
        let deleteDialog = $('.deleteDialog');
        deleteDialog.html('');
        let deleteDialoghtml = '';
        deleteDialoghtml += `<div class="mdui-dialog" id="deleteUserCateDialog">
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
        let inst = new mdui.Dialog('#deleteUserCateDialog');
        inst.open();
        return false;
    });
    $(document).on('confirm.mdui.dialog','#deleteUserCateDialog',function () {
        let id = $('#deleteid').val();
        $.ajax({
            url: '/api/admin/userCate/' + id,
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
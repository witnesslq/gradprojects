/**
 * Created by mafuz on 2017/4/8.
 */
$(document).ready(function () {
    
    $('#adminUser').click(function () {
        $.ajax({
            url: '/api/admin/getAllUsers',
            type: 'GET',
            success:function (data) {
                getAllUsers(data);
                createFab();
            }
        })
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

    function createFab() {
        let $fab = $('.fab');
        $fab.html('');
        let fabstr = '';
        fabstr += `<button class="mdui-fab mdui-fab-fixed mdui-ripple addUser"><i class="mdui-icon material-icons">&#xe145;</i></button>`
        $fab.append(fabstr);
    }
    function getAllUsers(data) {
        let form = $('#form');
        form.html("");
        let formstr = '';
        formstr += `<h3 class="card-header">搜索</h3>
            <div class="card-block">
                <form class="form-inline">
                    <div class="form-group col-sm-6">
                            <label for="username" class="col-sm-2">用户名</label>
                            <div class="col-sm-4">
                                <input type="text" id="username" class="form-control">
                            </div>
                    </div>
                    <div class="form-group col-sm-3 offset-sm-2">
                        <button class="btn btn-primary userSearch">查询</button>
                    </div>
                </form>
            </div>`
        form.html(formstr);
        createTabled(data);

    }
    function createTabled(data) {
        let list = data.userList;
        let table = $('#table');
        table.html("");
        let str = '';
        let i = 0;
        for(let userinfo of list) {
            i++;
            str +=`
                    <tr>
                        <td>${i}</td>
                        <td>${userinfo.id}</td>
                        <td>${userinfo.username}</td>
                        <td>${userinfo.enable}</td>
                        <td>${userinfo.nolock}</td>
                        <td>${datetime(userinfo.createtime)}</td>
                        <td>
                            <button class="mdui-btn mdui-btn-icon editUser" id="editBtn" data="${userinfo.id}"><i class="mdui-icon material-icons">edit</i></button>
                            <button class="mdui-btn mdui-btn-icon deleteUser" id="deleteBtn" data="${userinfo.id}"><i class="mdui-icon material-icons">delete</i></button>
                        </td>
                    </tr>`
        }
        let thead = `<table class="mdui-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>id</th>
                        <th>username</th>
                        <th>enabled</th>
                        <th>nolock</th>
                        <th>createtime</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>${str}</tbody>`;
        table.html(thead);

    }

    $(document).on('click','.userSearch', function () {
        let $username = $('#username');
        if($username.val() == null || $username.val() == '') {
            alert(111);
            return false;
        } else {
            $.ajax({
                url: '/api/admin/searchUser',
                method: 'POST',
                data: {
                    keyword: $username.val(),
                },
                success:function (data) {
                    createTabled(data);
                }
            });
            return false;
        }
    });

    $(document).on('click', '.addUser', function () {
        let addDialog = $('.addDialog');
        addDialog.html("");
        let str = '';
        str += `<div class="mdui-dialog" id="addDialog">
                            <div class="mdui-dialog-title">添加用户</div>
                            <div class="mdui-dialog-content">
                               <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">用户名</label>
                                   <input id="addusername" placeholder="用户名" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">用户名不能为空</span>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">密码</label>
                                   <input id="addpassword" placeholder="密码：" class="mdui-textfield-input" type="password" required/>
                                   <span class="mdui-textfield-error">密码不能为空</span>
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
                                </br>
                                <h4>不锁定？</h4>
                                <form>
                                <label class="mdui-radio">
                                    <input type="radio" name="addnolock" value="true" checked/>
                                    <i class="mdui-radio-icon"></i>
                                    不锁定
                                        </label>
                                    <label class="mdui-radio">
                                    <input type="radio" name="addnolock" value="false"/>
                                    <i class="mdui-radio-icon"></i>
                                    锁定
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
            var inst = new mdui.Dialog('#addDialog');
            inst.open();
        },100);
        return false;

    });

    $(document).on('confirm.mdui.dialog', '#addDialog', function () {
        let username = $('#addusername').val();
        let password = $('#addpassword').val();
        let enable = $('input[name="addenable"]:checked').val();
        let nolock = $('input[name="addnolock"]:checked').val();
        let user = {
            username: username,
            password: password,
            enable: enable,
            nolock: nolock,
        };
        $.ajax({
            url: '/api/admin/addUser',
            data: user,
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

    $(document).on('click','#editBtn', function () {

        $('.editDialog').html('');
        let id = $(this).attr('data');

        $.ajax({
            url:'/api/admin/getUser/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                editDialog(data);
            }
        });
        setTimeout(function () {
            var inst = new mdui.Dialog('#editDialog');
            inst.open();
        },1000);
        return false;

    });
    function editDialog(data) {
        let editDialog = $('.editDialog');
        editDialog.html('');
        let user = data.user;
        let radioEnabled = '';
        let radioNoLock = '';
        let catenameRadio = data.catename;
        if(true == user.enable) {
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
        if(true == user.nolock) {
            radioNoLock += `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editNoLock" value="true" checked/>
                    <i class="mdui-radio-icon"></i>
                    NoLock
                        </label></div>
                    <div class="mdui-col">
                    <label class="mdui-radio">
                    <input type="radio" name="editNoLock" value="false"/>
                    <i class="mdui-radio-icon"></i>
                    Lock
                </label></div>`
        } else {
            radioNoLock += `<div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editNoLock" value="true"/>
                    <i class="mdui-radio-icon"></i>
                    NoLock
                        </label></div>
                    <div class="mdui-col"><label class="mdui-radio">
                    <input type="radio" name="editNoLock" value="false" checked/>
                    <i class="mdui-radio-icon"></i>
                    Lock
                </label></div>`
        }

        var dialoghtml = '';
        dialoghtml += `<div class="mdui-dialog" id="editDialog">
        <input id="editid" type="hidden" class="edit" value="${user.id}">
        <div class="mdui-dialog-title">修改用户</div>
        <div class="mdui-dialog-content">
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">用户名</label>
                <input id="editusername" class="mdui-textfield-input" type="text" value="${user.username}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">密码</label>
                <input id="editpassword" type="password" class="mdui-textfield-input comment" type="text" value="${user.password}"/>
            </div>
            <h4>Enable?</h4>
            <div class="mdui-row-md-4">
            <form>
            ${radioEnabled}
            </form>
            </div>
            <h4>NoLock?</h4>
            <div class="mdui-row-md-4">
            <form>
                ${radioNoLock}
            </form>
            </div>
        </div>
        <div class="mdui-dialog-actions">
            <button class="mdui-btn mdui-ripple" mdui-dialog-cancel>取消</button>
            <button class="mdui-btn mdui-ripple" mdui-dialog-confirm>保存</button>
        </div>
    </div></form>`;
        editDialog.append(dialoghtml);
    };

    $(document).on('confirm.mdui.dialog', '#editDialog', function () {
        let id = $('#editid').val();
        let username = $('#editusername').val();
        let password = $('#editpassword').val();
        let enable = $('input[name="editEnable"]:checked').val();
        let nolock = $('input[name="editNoLock"]:checked').val();
        let url = '/api/admin/updateUser/' + id;
        let user = {
            username: username,
            password: password,
            enable: enable,
            nolock: nolock,
        };
        $.ajax({
            url: url,
            data: user,
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
    $(document).on('click', '#deleteBtn', function () {
        $('.deleteDialog').html('');
        let id = $(this).attr('data');
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
            url: '/api/admin/deleteUser/' + id,
            method: 'DELETE',
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
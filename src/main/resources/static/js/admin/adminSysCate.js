/**
 * Created by mafuz on 2017/4/8.
 */
$(document).ready(function () {
   $('#adminSysCate').click(function () {
       $.ajax({
           url: '/api/admin/getAllCates',
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

   function getAllCates(data) {
       let form = $('#form');
       form.html("");
       let list = data.sysCateList;
       let table = $('#table');
       table.html("");
       let str = '';
       let i = 0;
       for(let sysCate of list) {
           i++;
           str +=`
                    <tr>
                        <td>${i}</td>
                        <td>${sysCate.id}</td>
                        <td>${sysCate.catename}</td>
                        <td>${sysCate.description}</td>
                        <td>${sysCate.hits}</td>
                        <td>${sysCate.enable}</td>
                        <td>${datetime(sysCate.createtime)}</td>
                        <td>
                            <button class="mdui-btn mdui-btn-icon editSysCate" data="${sysCate.id}"><i class="mdui-icon material-icons">edit</i></button>
                            <button class="mdui-btn mdui-btn-icon deleteSysCate" data="${sysCate.id}"><i class="mdui-icon material-icons">delete</i></button>
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
                        <th>hits</th>
                        <th>enable</th>
                        <th>createtime</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>${str}</tbody>`;
       table.html(thead);
   }

    function createFab() {
        let $fab = $('.fab');
        $fab.html('');
        let fabstr = '';
        fabstr += `<button class="mdui-fab mdui-fab-fixed mdui-ripple addSysCate"><i class="mdui-icon material-icons">&#xe145;</i></button>`
        $fab.append(fabstr);
    }
    $(document).on('click', '.addSysCate', function () {
        let addDialog = $('.addDialog');
        addDialog.html("");
        let str = '';
        str += `<div class="mdui-dialog" id="addSysCateDialog">
                            <div class="mdui-dialog-title">添加系统分类</div>
                            <div class="mdui-dialog-content">
                               <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">catename</label>
                                   <input id="addcatename" placeholder="用户名" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">分类名不能为空</span>
                                </div>
                                <div class="mdui-textfield">
                                   <label class="mdui-textfield-label">description</label>
                                   <input id="adddescription" placeholder="描述" class="mdui-textfield-input" type="text" required/>
                                   <span class="mdui-textfield-error">描述不能为空</span>
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
            var inst = new mdui.Dialog('#addSysCateDialog');
            inst.open();
        },100);
        return false;
    });

    $(document).on('confirm.mdui.dialog', '#addSysCateDialog', function () {
        let catename = $('#addcatename').val();
        let description = $('#adddescription').val();
        let hits = $('#addhits').val();
        let enable = $('input[name="addenable"]:checked').val();
        let sysCate = {
            catename: catename,
            description: description,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: '/api/admin/cate/addCate',
            data: sysCate,
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

    $(document).on('click','.editSysCate', function () {

        $('.editDialog').html('');
        let id = $(this).attr('data');

        $.ajax({
            url:'/api/admin/getCateById/' + id,
            method:'GET',
            async: 'false',
            success:function (data) {
                editDialog(data);
            }
        });
        setTimeout(function () {
            var inst = new mdui.Dialog('#editSysCateDialog');
            inst.open();
        },1000);
        return false;

    });
    function editDialog(data) {
        let editDialog = $('.editDialog');
        editDialog.html('');
        let sysCate = data.sysCate;
        let radioEnabled = '';
        if(true == sysCate.enable) {
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
        dialoghtml += `<div class="mdui-dialog" id="editSysCateDialog">
        <input id="editid" type="hidden" class="edit" value="${sysCate.id}">
        <div class="mdui-dialog-title">修改系统分类</div>
        <div class="mdui-dialog-content">
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">catename</label>
                <input id="editcatename" class="mdui-textfield-input" type="text" value="${sysCate.catename}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">description</label>
                <input id="editdescription" class="mdui-textfield-input" type="text" value="${sysCate.description}"/>
            </div>
            <div class="mdui-textfield">
                <label class="mdui-textfield-label">hits</label>
                <input id="edithits" placeholder="点击量" class="mdui-textfield-input" type="number" value="${sysCate.hits}"/>
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

    $(document).on('confirm.mdui.dialog', '#editSysCateDialog', function () {
        let id = $('#editid').val();
        let catename = $('#editcatename').val();
        let description = $('#editdescription').val();
        let hits = $('#edithits').val();
        let enable = $('input[name="editEnable"]:checked').val();
        let url = '/api/admin/cate/' + id;
        let sysCate = {
            catename: catename,
            description: description,
            hits: hits,
            enable: enable,
        };
        $.ajax({
            url: url,
            data: sysCate,
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
    $(document).on('click', '.deleteSysCate', function () {
        let id = $(this).attr('data');
        let deleteDialog = $('.deleteDialog');
        deleteDialog.html('');
        let deleteDialoghtml = '';
        deleteDialoghtml += `<div class="mdui-dialog" id="deleteSysCateDialog">
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
        var inst = new mdui.Dialog('#deleteSysCateDialog');
        inst.open();
        return false;
    });
    $(document).on('confirm.mdui.dialog','#deleteSysCateDialog',function () {
        let id = $('#deleteid').val();
        $.ajax({
            url: '/api/admin/cate/' + id,
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
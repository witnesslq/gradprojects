/**
 * Created by mafuz on 2017/4/2.
 */


$(document).ready(function () {

    $.ajax({
        url: '/api/getAllCates',
        method: 'GET',
        success:function (data) {
            encodedata(data);
        }
    });

    function encodedata(data) {
        var navlist = $('#nav-list');
        navlist.html("");
        var strtemp = '';
        var list = data.userCateList;
        for(var usercate of list) {
            strtemp += `<a class="mdui-list-item mdui-ripple" data = "${usercate.id}" name="${usercate.catename}" createtime="${usercate.createtime}">${usercate.catename}</a>`
        }
        navlist.append(strtemp);
    };
})
/**
 * Created by Administrator on 2017/3/2 0002.
 */
$(function (){
    var prt_list = [],
        $add_prt = $('.add-btn'),
        $add = $('.add'),
        $cancel = $('.cancel'),
        $sure = $('.sure'),
        $add_name = $('.t1'),
        $add_stock = $('.t2'),
        $add_alert = $('.add .alert'),
        $table = $('.table'),
        $info = $('.table .info'),
        $tb = $('.tb'),
        $kq = $('.kq'),
        $tab_tb = $('.tab li:first-child'),
        $tab_kq = $('.tab li:last-child');
    // store.clear();
    $tab_tb.click(function (){
        $kq.slideUp();
        $tb.show(300);
    });
    $tab_kq.click(function (){
        $tb.hide(300);
        $kq.fadeIn();
    });
    $add_prt.click(function (){
        $add.slideDown();
    });
    $cancel.click(function (){
        $add.hide('slow');
        $add_alert.hide();
        $add_name.val('');
        $add_stock.val('');
    });
    $sure.click(function (){
        var re = /^\s|\s$/;
        var re2 = /[^\d]/;
        if(re.test($add_name.val()) || re.test($add_stock.val())) {
            $add_alert.fadeIn().addClass('alert-danger').html('内容不能为空格或去掉内容前后空格再试');
        }
        else if(!$add_stock.val() || !$add_name.val()) {
            $add_alert.fadeIn().addClass('alert-danger').html('要添加啥？不能空着哦');
        }
        else if(re2.test($add_stock.val())) {
            $add_alert.fadeIn().addClass('alert-danger').html('库存不应该写数字吗？');
        } else {
            $add_alert.removeClass('alert-danger').addClass('alert-success').hide().fadeIn().html('添加成功！');
            var new_prt = {};
            new_prt.name = $add_name.val();
            new_prt.stock = $add_stock.val();
            addData(new_prt);
            var list = [];
            list.unshift(new_prt);
            updata(list);
            $add_name.val('');
            $add_stock.val('');
        }
    });
    function addData(data) {
        if(data) prt_list.unshift(data);
        store.set('prt_list',prt_list);
    }
    function getData() {
        if(store.get('prt_list')) {
            prt_list = store.get('prt_list');
            updata(prt_list);
        }
        if(store.get('tmp')) {
            showUser();
            initKq();
        }
    }
    function idx(obj) {
        return obj.parents('tr').index() - 1;
    }
    $table.on('click','.delete',function (){
        var $this = $(this);
        var tmp = confirm('你确定吗？');
        var $parent = $this.parents('tr');
        var index = idx($this);
        if(tmp) {
            $parent.remove();
            prt_list.splice(index,1);
            addData();
        }
    });
    $table.on('dblclick','.ipt,.out',function (){
        var $this = $(this);
        var $iptDiv = $this.next('div');
        var $input = $iptDiv.children('input');
        $this.hide();
        $iptDiv.css('display','table');
        $input.val($this.html());
        $input.focus();
    });
    $table.on('click','.input-group-btn .btn',function (){
        var $this = $(this);
        var $parent = $this.parents('.input-group');
        var $prevSpan = $parent.prev();
        var $prevInt = $this.parents('.input-group-btn').prev();
        var re = /[^\d]/;
        if(re.test($prevInt.val()) || !$prevInt.val()) {
            alert('只允许输入数字');
            return;
        }
        var index = idx($this);
        $parent.hide();
        $prevSpan.html($prevInt.val()).slideDown();
        var result = Number($('.ipt').get(index).innerHTML) - Number($('.out').get(index).innerHTML) + Number(prt_list[index].stock);
        $('.ipt').get(index).innerHTML = $('.out').get(index).innerHTML = 0;
        prt_list[index].stock = result;
        addData();
        $this.parents('tr').find('.stock').html(result).hide().slideDown();
    });
    $table.on('click','.form-control',function (ev){
        ev.stopPropagation();
    });
    $table.on('mouseover','tr',function (){
        $(this).css('background','rgba(247,234,217,1');
    });
    $table.on('mouseout','tr',function (){
        $(this).css('background','');
    });
    $(document.documentElement).click(function (){
        var $div1 = $('.ipt').next('.input-group'),
            $div2 = $('.out').next('.input-group');
        $div1.hide();
        $div2.hide();
        $div1.prev().slideDown();
        $div2.prev().slideDown();
    });
    function updata(data) {
        if(data) {
            var result = '';
            for(var i=0;i<data.length;i++) {
                result += '<tr>'+
                    '<td>'+
                    '<span>'+data[i].name+'</span>'+
                    '</td>'+
                    '<td>'+
                    '<span class="ipt">0</span>'+
                    '<div class="input-group input-group-sm">'+
                    '<input type="text" value="" class="form-control">'+
                    '<span class="input-group-btn"><button class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span></button></span>'+
                    '</div>'+
                    '</td>'+
                    '<td>'+
                    '<span class="out">0</span>'+
                    '<div class="input-group input-group-sm">'+
                    '<input type="text" value="" class="form-control">'+
                    '<span class="input-group-btn"><button class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span></button></span>'+
                    '</div>'+
                    '</td>'+
                    '<td>'+
                    '<span class="stock">'+data[i].stock+'</span>'+
                    '</td>'+
                    '<td><span class="glyphicon glyphicon-remove text-danger delete"></span></td>'+
                    '</tr>';
            }
            $info.after(result);
        }
    }


    //考勤
    var $register = $('.register'),
        $signup = $('.signup'),
        $signup_close = $('.signup-close'),
        $login = $('.login'),
        $signin = $('.signin'),
        $signin_close = $('.signin-close'),
        $register_btn = $('.register-btn'),
        $signupUser = $('.signup .form-group input[type=text]'),
        $signupPassword = $('.signup .form-group input[type=password]'),
        $signinUser = $('.signin .form-group input[type=text]'),
        $signinPassword = $('.signin .form-group input[type=password]'),
        $forget = $('.signin-div .forget'),
        $loginCancel = $('.login-cancel'),
        $loginConfirm = $('.login-confirm'),
        $signinAlert = $('.signin .alert'),
        $signupAlert = $('.signup .alert'),
        $signout = $('.signout');
    var signWidth = (document.documentElement.clientWidth-parseInt($('.signin').css('width'))) / 2,
        signHeight = (document.documentElement.clientHeight-parseInt($('.signin').css('height'))) / 2;
    $('.signin,.signup').css({
        'left': signWidth,
        'top': signHeight
    });
    $register.click(function (){
        $signup.fadeIn();
    });
    $signup_close.click(function (){
        hide($signup);
    });
    $login.click(function (){
        $signin.fadeIn();
    });
    $signin_close.click(function (){
        hide($signin);
    });
    var userData = {};
    $register_btn.click(function (){
        var user = $signupUser.val(),
            password = $signupPassword.val(),
            re = /\s+/;
        if(re.test(user) || re.test(password)) {
            showAlert($signupAlert,'alert-success','alert-danger','不可以有空格哦');
        }
        else if(!user) {
            showAlert($signupAlert,'alert-success','alert-danger','请输入账号密码');
        }
        else if(!store.get(user)) {
            var data = {};
            data.user = user;
            data.password = password;
            data.num = 0;
            data.arr = [];
            data.arrMonth = [];
            store.set(user,data);
            showAlert($signupAlert,'alert-danger','alert-success','恭喜注册成功');
        }
        else if(store.get(user)) {
            showAlert($signupAlert,'alert-success','alert-danger','此账号已被注册');
        }
    });

    $forget.click(function (){
        showAlert($signinAlert,'alert-success','alert-danger','你再好好想想！');
    });
    $loginConfirm.click(function (){
        var user = $signinUser.val(),
            password = $signinPassword.val();
        if(!user) {
            showAlert($signinAlert,'alert-success','alert-danger','请输入账号密码');
        }
        else if(!store.get(user)) {
            showAlert($signinAlert,'alert-success','alert-danger','此账号未注册');
        }
        else if(store.get(user)) {
            if(password == store.get(user).password) {
                showAlert($signinAlert,'alert-danger','alert-success','登录成功！');
                sucess(user);
            } else {
                showAlert($signinAlert,'alert-success','alert-danger','密码错误！');
            }
        }
    });
    $signout.click(function (){
        if(store.get('tmp')) {
            store.remove('tmp');
        }
        window.location.reload();
    });
    function sucess(user) {
        store.set('tmp',store.get(user).user);
        userData = store.get(user);
        showUser();
        setTimeout(function (){
            hide($signin);
        },200);
        initKq();
    }
    function getUser() {
        return store.get('tmp');
    }
    function showUser() {
        var $parent = $('.user-name'),
            tmp = getUser(),
            userData = store.get(tmp);
        $parent.fadeIn();
        $parent.children(':first').html(userData.user);
        console.log(userData)
        $('.login-register').hide();
    }
    $loginCancel.click(function (){
        hide($signin);
    });
    function hide(obj) {
        if(obj == $signin) {
            $signinUser.get(0).value = $signinPassword.get(0).value = '';
            $signinAlert.fadeOut();
            $signin.fadeOut();
        }
        else if(obj == $signup) {
            $signupUser.get(0).value = $signupPassword.get(0).value = '';
            $signupAlert.fadeOut();
            $signup.fadeOut();
        }
    }
    function showAlert(obj,rem,add,html) {
        obj.fadeIn().removeClass(rem).addClass(add).html(html);
    }
    var $nextMonth = $('.next-month'),
        $qdBtn = $('.qd-btn'),
        iMonth = new Date().getMonth();
    $nextMonth.click(function (){
         var result = '',
             month = 30,
             tmp = getUser(),
             userData = store.get(tmp);
         if(!userData) {
             alert('请先登录');
             return;
         }
         if((iMonth+1)%2) {
             month = 31
         }
         else if(iMonth == 1) {
             month = 28;
         }
         var tmp = confirm('确定添加下一个月吗，添加后上个月将不可签到');
         if(tmp) {
             for(var i=0;i<month;i++) {
                 result += '<div class="col-lg-2"></div>';
             }
             iMonth++;
             $nextMonth.after('<div class="container wrap">'+result+'</div>');
             userData.arrMonth.push(month);
             userData.num = $('.wrap').length;
             updataUser(userData);
         }
    });
    function updataUser(data) {
        var tmp = getUser();
        store.set(tmp,data);
    }

    $qdBtn.click(function (){
        var iDate = new Date(),
            iDay = iDate.getDate(),
            iYear = iDate.getFullYear(),
            iMonth = iDate.getMonth(),
            iWeek = iDate.getDay(),
            iHours = iDate.getHours(),
            iMinute = iDate.getMinutes(),
            iSec = iDate.getSeconds(),
            tmp = getUser(),
            userData = store.get(tmp),
            len = $('.wrap').eq(0).children().length,
            time = iYear+'年'+(iMonth+1)+'月'+iDay+'日'+'星期'+(iWeek==0? 7: iWeek)+'  '+iHours+':'+iMinute+':'+iSec;
        if(iHours >= 8) {
            if(iHours==8 && iMinute<=10) {
                time = time;
            } else {
                time += ' late';
            }
        }
        for(var i=0;i<len;i++) {
            if(!$('.wrap').children().eq(i).html()) {
                $('.wrap').children().eq(i).html(time);
                if(time.search('late') != -1) {
                    $('.wrap').children().eq(i).addClass('late');
                }
                if(!userData.arr[userData.num-1]) {
                    userData.arr[userData.num-1] = [];
                }
                userData.arr[userData.num-1].push(time);
                updataUser(userData);
                break;
            }
        }
    });
    function initKq() {
        var tmp = getUser(),
            data = store.get(tmp);
        if(data) {
                var arrChild = [];
                if(data.arrMonth) {
                    for(i=0;i<data.arrMonth.length;i++) {
                        for(var j=0;j<data.arrMonth[i];j++) {
                            if(data.arr[i]) {
                                if(!arrChild[i]) {
                                    if(data.arr[i][j].search('late') != -1) {
                                        var late = ' late';
                                    }
                                    arrChild[i] = '<div class="col-lg-2'+late+'">'+data.arr[i][j]+'</div>';
                                    j++;
                                }
                                if(!data.arr[i][j]) {
                                    data.arr[i][j] = '';
                                }
                                arrChild[i] += '<div class="col-lg-2'+(data.arr[i][j].search('late') != -1? ' late': '')+'">'+data.arr[i][j]+'</div>';
                            } else {
                                if(!arrChild[i]) {
                                    arrChild[i] = '<div class="col-lg-2"></div>';
                                    j++;
                                }
                                arrChild[i] += '<div class="col-lg-2"></div>';
                            }
                        }
                    }
                }
            if(data.num) {
                for(var i=0;i<data.num;i++) {
                    $nextMonth.after('<div class="container wrap">'+arrChild[i]+'</div>');
                }
            }
        }
    }
    getData();
});
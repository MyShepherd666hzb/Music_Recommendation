require.config({
　paths: {
    "jquery": "jquery.min",
    "com": "common.min"
  }
});

require(['jquery','com'], function ($,com){
  //登录注册切换
  $('#unauth_main').on('click','.switch',function(){
    var _this = this;
    setTimeout(function(){
      $(_this).closest('.switch_box').hide().siblings().show();
    },400);
    setTimeout(function(){
      $('#unauth_main').removeClass('switching');
    },600);

    $('#unauth_main').addClass('switching');
});
  //验证正则
  var regPhone = /^1[34578]\d{9}$/;
  var regPwd = /^[\w!@#$%^&*()]{4,16}$/;
  var regUser = /^\w{3,16}$/;
  //登录框对象
  var J_LoginUser = $('input[name="loginUser"]');
  var J_LoginPsw = $('input[name="password"]');
  var J_LoginButton = $('#J_LoginButton');
  var loginTipCon = $('#loginTipCon');
  //注册框对象
  var J_RegistUser = $('input[name="username"]');
  var J_RegistMobile = $('input[name="mobile"]');
  var J_RegistPsw = $('input[name="password1"]');
  var repeat_pwd = $('input[name="password2"]');
  var J_RegButton = $('#J_RegButton');
  var agree = $('#agree');
  var regTipCon = $('#regTipCon');

  J_LoginUser.on('blur',function(){
    detect(regUser,$(this).val(),'请输入正确的用户名或手机号','请输入用户名或手机号',loginTipCon);
  });
  J_LoginPsw.on('blur',function(){
    detect(regPwd,$(this).val(),'密码必须是4-16位字母数字或符号','请输入密码',loginTipCon);
  });
  J_RegistUser.on('blur',function(){
    detect(regUser,$(this).val(),'用户名必须是3-16位字母数字或下划线','请输入用户名',regTipCon);
  });
  J_RegistMobile.on('blur',function(){
    detect(regPhone,$(this).val(),'请输入有效的手机号','请输入手机号',regTipCon);
  });
  J_RegistPsw.on('blur',function(){
    detect(regPwd,$(this).val(),'密码必须是4-16位字母数字或符号','请输入密码',regTipCon);
  });
  repeat_pwd.on('blur',function(){
    if($(this).val()!=J_RegistPsw.val()){
      regTipCon.text('两次输入的密码必须一致').parent().show();
    }else{
      regTipCon.empty().parent().hide();
    }
  });
 
  
  //检测输入内容
  function detect(regexp,val,text,air,tip){
    if(val.trim() == ''){
      tip.text(air).parent().show();
      return false;
    }else if(!regexp.test(val)){
      tip.text(text).parent().show();
      return false;
    }else{
      tip.parent().hide();
      return true;//user_login?userid=xxx&pwd=xx&remember_me=T
    }
  }

  $('#registerForm').on('submit', function(e){
    e.preventDefault();
    
    if(!detect(regUser, J_RegistUser.val(), '用户名格式错误', '请输入用户名', regTipCon)) {
      return false;
    }
    if(!detect(regPhone, J_RegistMobile.val(), '手机号格式错误', '请输入手机号', regTipCon)) {
      return false;
    }
    if(!detect(regPwd, J_RegistPsw.val(), '密码格式错误', '请输入密码', regTipCon)) {
      return false;
    }
    if(repeat_pwd.val() !== J_RegistPsw.val()) {
      regTipCon.text('两次输入的密码不一致').parent().show();
      return false;
    }
    if(!agree.prop('checked')) {
      regTipCon.text('请同意用户注册协议').parent().show();
      return false;
    }
    
    this.submit();
  });
});

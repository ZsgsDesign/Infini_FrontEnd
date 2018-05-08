apiready = function(){
    $ocf.inputFocus($ocf.byId("email"));
    $ocf.val($ocf.byId("email"),api.getPrefs({sync: true,key: 'email'}));
    $ocf.inputBlur($ocf.byId("email"));
    //$ocf.css($ocf.byId("login_bg"),'height:'+api.winHeight+'px;')
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWidget({
            id: 'A6943107131657',
            silent:true
        });
    });
};

function openRegister(){
    api.openWin({
        name: 'register',
        url: './register.html',
        animation:{
            type:"push",
            subType:"from_right",
            duration:300
        }
    });
}

function actionLogin(){
    if(!$ocf.val($ocf.byId("email")) || !$ocf.val($ocf.byId("password"))) {
        api.toast({msg: '请填写邮箱、密码！',duration: 2000,global:true});
        return;
    }
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    console.log(timestamp);
    console.log(hex_md5(timestamp));
    console.log(hex_sha1(hex_md5(timestamp)+"rand2333"));
    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
    api.ajax({
        url:'https://infini.1cf.co/api/AccountLogin',
        method: 'post',
        data:
        {
            values:
            {
                email: $ocf.val($ocf.byId("email")),
                password:$ocf.val($ocf.byId("password")),
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            //console.log(JSON.stringify(ret));
            if(ret.ret>=1000){
                api.toast({
                    msg: '请检查您的邮箱与密码！',
                    duration: 2000,
                    global:true
                });
            }else{
                api.setPrefs({key: 'uid',value: ret.data.uid });
                api.setPrefs({key: 'email',value: ret.data.email });
                api.setPrefs({key: 'name',value: ret.data.name });
                api.setPrefs({key: 'OPENID',value: ret.data.OPENID });
                api.setPrefs({key: 'real_name',value: ret.data.real_name });
                api.setPrefs({key: 'gender',value: ret.data.gender });
                api.setPrefs({key: 'bind_uid',value: ret.data.bind_uid });
                api.setPrefs({key: 'bind_date',value: ret.data.bind_date });
                api.setPrefs({key: 'email_verified',value: ret.data.email_verified });
                api.setPrefs({key: 'avatar',value: ret.data.avatar });
                api.toast({
                    msg: '登录成功！',
                    duration: 2000,
                    global:true
                });
                api.rebootApp();
            }

        }
        else
        {
            api.toast({
                msg: '连接数据库失败，请检查网络连接！',
                duration: 2000,
                location: 'top'
            });
        }
        api.hideProgress();
    });
}

apiready = function(){

};

function actionRegister(){
    if(!$ocf.val($ocf.byId("email")) || !$ocf.val($ocf.byId("password"))) {
        api.toast({msg: '请填写邮箱、密码！',duration: 2000,global:true});
        return;
    }
    if($ocf.getByteLen($ocf.val($ocf.byId("password")))<6) {
        api.toast({
            msg: '请设置一个超过6位的密码',
            duration: 2000,
            global:true
        });
        return ;
    }
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
    api.ajax({
        url:'https://infini.1cf.co/api/AccountRegister',
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
            if(ret.ret==2003){
                api.toast({
                    msg: '邮箱已注册',
                    duration: 2000,
                    global:true
                });
            }else if(ret.ret>=1002){
                api.toast({
                    msg: '服务器异常',
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
                    msg: '注册成功！',
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

var charTa="它";
var charSex="";
var qrcode = new QRCode($ocf.byId("qrcode"), {
    colorDark : '#757575',
    colorLight : 'transparent'
});

apiready = function() {
    init();
};

function init(){
    var gender=api.getPrefs({sync: true,key: 'gender'});
    var real_name=api.getPrefs({sync: true,key: 'real_name'});
    var uid=api.getPrefs({sync: true,key: 'uid'});
    var OPENID=api.getPrefs({sync: true,key: 'OPENID'});
    if(gender==0 || !real_name){
        $ocf.css($ocf.byId("update_form"),'display:block;');
        $ocf.css($ocf.byId("bind_form"),'display:none;');
        $ocf.css($ocf.byId("binded"),'display:none;');
    }else{
        if(gender==1) {
            charTa="她";
            charSex="女";
        }
        else {
            charTa="他";
            charSex="男";
        }
        $ocf.html($ocf.byId("sex"),charSex);
        $ocf.html($ocf.byId("ta"),charTa);
        var bind_uid=api.getPrefs({sync: true,key: 'bind_uid'});
        if(bind_uid>0){
            $ocf.css($ocf.byId("binded"),'display:block;');
            $ocf.css($ocf.byId("bind_form"),'display:none;');
            $ocf.css($ocf.byId("update_form"),'display:none;');
            getFriendInfo();
        }else{
            $ocf.css($ocf.byId("bind_form"),'display:block;');
            $ocf.css($ocf.byId("binded"),'display:none;');
            $ocf.css($ocf.byId("update_form"),'display:none;');
            if($ocf.getByteLen(real_name)<=16) $ocf.html($ocf.byId("real_name_span"),real_name); else $ocf.html($ocf.byId("real_name_span"),"名字太长不显示了");
            GeneCode();
            //Add to the length of the original text of the bar code to make it more professional and SMART just like Trump's hair
            //infini protocol's a joke and do nothing at all, never mind
        }
    }
    $ocf.loaded();
}

function GeneCode(){
    var uid=api.getPrefs({sync: true,key: 'uid'});
    var d = new Date();
    var hr=d.getHours();
    var mn=d.getMinutes()+1;
    var minStamp=parseInt(Math.round(new Date().getTime()/1000)/60).toString();
    //var timestamp=Math.round(new Date().getTime()/1000).toString();
    qrcode.makeCode("infini://"+hex_md5(minStamp+"0"+uid)+"|"+uid);
    $ocf.html($ocf.byId("time"),hr+":"+mn);
    api.toast({
        msg: '刷新成功！',
        duration: 2000,
        global:true
    });
    /*
    api.ajax({
        url:'https://infini.1cf.co/api/GetBindCode',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                minStamp: minStamp,
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            console.log(JSON.stringify(ret));
            if(ret.ret!=200){
                api.toast({
                    msg: '服务器异常',
                    duration: 2000,
                    global:true
                });
            }else{
                qrcode.makeCode(ret.data.code);
                $ocf.html($ocf.byId("time"),hr+":"+mn);
                api.toast({
                    msg: '刷新成功！',
                    duration: 2000,
                    global:true
                });
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
    });
    */

}

function refresh(){
    var bind_uid=api.getPrefs({sync: true,key: 'bind_uid'});
    if(!bind_uid){
        GeneCode();
    }
}

function actionUpdateData(){
    var gender=$ocf.byId("g1").checked?1:2;
    console.log(gender);
    if(!$ocf.val($ocf.byId("real_name"))) {
        api.toast({msg: '请填写姓名！',duration: 2000,global:true});
        return;
    }
    if($ocf.getByteLen($ocf.val($ocf.byId("real_name")))>20) {
        api.toast({
            msg: '姓名再写短点吧',
            duration: 2000,
            global:true
        });
        return ;
    }
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
    api.ajax({
        url:'https://infini.1cf.co/api/AccountUpdate',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                gender: gender,
                real_name:$ocf.val($ocf.byId("real_name")),
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            console.log(JSON.stringify(ret));
            if(ret.ret!=200){
                api.toast({
                    msg: '服务器异常',
                    duration: 2000,
                    global:true
                });
            }else{
                api.setPrefs({key: 'real_name',value: $ocf.val($ocf.byId("real_name")) });
                api.setPrefs({key: 'gender',value: $ocf.byId("g1").checked?1:2 });
                api.toast({
                    msg: '更新成功！',
                    duration: 2000,
                    global:true
                });
                $ocf.css($ocf.byId("update_form"),'display:none;');
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

function getFriendInfo(){
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.ajax({
        url:'https://infini.1cf.co/api/GetFriendInfo',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            console.log(JSON.stringify(ret));
            if(ret.ret!=200){
                api.toast({
                    msg: '暂时没有获取到ta的信息~',
                    duration: 2000,
                    global:true
                });
            }else{
                api.setPrefs({key: 'binded_uid',value: ret.data.uid });
                api.setPrefs({key: 'binded_email',value: ret.data.email });
                api.setPrefs({key: 'binded_name',value: ret.data.name });
                api.setPrefs({key: 'binded_OPENID',value: ret.data.OPENID });
                api.setPrefs({key: 'binded_real_name',value: ret.data.real_name });
                api.setPrefs({key: 'binded_gender',value: ret.data.gender });
                api.setPrefs({key: 'binded_avatar',value: ret.data.avatar });
                $ocf.byId("avatar").src=ret.data.avatar;
                $ocf.html($ocf.byId("binded_real_name"),ret.data.real_name);
                if(ret.data.uid==2){
                    $ocf.html($ocf.byId("binded_comment"),"找女朋友是不可能的,这辈子都不可能找到女朋友的 买不起化妆品又不懂套路，只能靠和小姐姐们聊聊天才能维持生活这样子，每次进了软研就像回了家一样，那里的女装大佬们故事又多整天什么酱什么酱还会嘤嘤嘤,我超喜欢这里的");
                    $ocf.html($ocf.byId("binded_comment_author"),"——单身狗保护协会");
                }else if(ret.data.gender==api.getPrefs({sync: true,key: 'gender'})){
                    $ocf.html($ocf.byId("binded_comment"),"好基友一辈子。");
                    $ocf.html($ocf.byId("binded_comment_author"),"——鲁迅");
                }
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
    });
}

function unbind(){
    console.warn("-1s");
}

function dogeButton(){
    api.confirm({
        title: 'Infini Doge模式',
        msg: '实在找不到女朋友？追不上心仪的小哥哥？真的吗？',
        buttons: ['嗯！', '不不不']
    }, function(ret, err) {
        var index = ret.buttonIndex;
        if(index==1){
            //init doge mode
            dogeMode();
        }
    });
}

function dogeMode(){
    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.ajax({
        url:'https://infini.1cf.co/api/AccountDogeMode',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            console.log(JSON.stringify(ret));
            if(ret.ret!=200){
                api.toast({
                    msg: '服务器异常',
                    duration: 2000,
                    global:true
                });
            }else{
                api.toast({
                    msg: 'Doge模式，启动！',
                    duration: 2000,
                    global:true
                });
                api.setPrefs({key: 'doge',value: 1 });
                api.closeWidget({
                    id: 'A6943107131657',
                    silent:true
                });
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

pullToRefresh({
    container: document.querySelector("body"),
    animates: ptrAnimatesMaterial,
    refresh() {
        $ocf.loading();
        init();
        return new Promise(resolve => {
            setTimeout(resolve, 500)
        })
    }
});

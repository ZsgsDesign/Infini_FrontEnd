var tab = new auiTab({
    element:$ocf.byId("tab"),
    index:1,
    repeatClick:false
},function(ret){
    api.setFrameGroupIndex({
        name: 'main_group',
        index: ret.index-1,
        scroll: true
    });
});

var tapBack=0;
var _bind_secure_bind;
var _bind_uid;
apiready = function(){
    var header = $ocf.byId('wrap');
    $ocf.fixStatusBar(header);
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.ajax({
        url:'https://infini.1cf.co/api/VerifyLogin',
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
            //console.log(JSON.stringify(ret));
            if(ret.ret==2007){
                api.toast({
                    msg: '身份校验异常',
                    duration: 2000,
                    global:true
                });
                api.openWin({
                    name: 'login',
                    url: './login.html',
                    animation:{
                        type:"movein",
                        subType:"from_bottom",
                        duration:300
                    }
                });
            }else if(ret.ret==200){
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
    var doge=api.getPrefs({sync: true,key: 'doge'});
    if(doge){
        api.confirm({
            title: '单身狗禁止入内！',
            msg: '注意！Infini是专为情侣和基佬打造的App，谢绝单身狗入内！',
            buttons:["我不是单身狗","我不服","好吧"]
        }, function(ret, err) {
            var index = ret.buttonIndex;
            if(index==1){
                api.toast({
                    msg: '骗人',
                    duration: 2000,
                    global:true
                });
            }else if(index==2){
                api.toast({
                    msg: '哦',
                    duration: 2000,
                    global:true
                });
            }
            api.closeWidget({
                id: 'A6943107131657',
                silent:true
            });
        });
    }
    //api.openDrawerPane({type: 'left'});
    //api.closeDrawerPane();
    //预缓存
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        if(tapBack>=10){
            api.closeWidget({
                id: 'A6943107131657',
                silent:true
            });
        }  else if(tapBack>0)  {
            api.toast({
                msg: '要不你再按一下>_+',
                duration: 2000
            });
            tapBack+=10;
            setTimeout("tapBack-=10;",2000);
        }  else  {
            api.toast({
                msg: '再按一下退出~',
                duration: 2000
            });
            tapBack++;
            setTimeout("tapBack--;",2000);
        }
    });
    api.openFrameGroup({
        name: 'main_group',
        preload:3,
        rect: {
            x: 0,
            y: $ocf.offset($ocf.byId('wrap')).h,
            w: 'auto',
            h: api.winHeight - $ocf.offset($ocf.byId('wrap')).h
        },
        frames: [{
            name: 'home',
            url: './home.html',
            useWKWebView:true,
            bounces: false,
            overScrollMode: "scrolls"
        }, {
            name: 'diary',
            url: './diary.html',
            useWKWebView:true,
            bounces: false,
            overScrollMode: "scrolls"
        }, {
            name: 'countdown',
            url: './countdown.html',
            useWKWebView:true,
            bounces: false,
            overScrollMode: "scrolls"
        }]
    }, function(ret, err) {
        var index = ret.index;
        document.getElementById("tab").children[0].className="aui-tab-item";
        document.getElementById("tab").children[1].className="aui-tab-item";
        document.getElementById("tab").children[2].className="aui-tab-item";
        document.getElementById("tab").children[index].className="aui-tab-item aui-active";
        $("tab > style").html("tab:after{left:"+index*33.3+"vw;}");
    });
};

function changeTab(index){
    api.setFrameGroupIndex({
        name: 'main_group',
        index: index,
        scroll: true
    });
}

function scan(){
    if(api.getPrefs({sync: true,key: 'gender'})==0){
        api.toast({
            msg: '请先完善个人信息',
            duration: 2000,
            global:true
        });
        return;
    }
    var bind_uid=api.getPrefs({sync: true,key: 'bind_uid'});
    if(bind_uid!=0){
        api.toast({
            msg: '您已绑定',
            duration: 2000,
            global:true
        });
        return;
    }
    var FNScanner = api.require('FNScanner');
    FNScanner.open({
        autorotation: true
    }, function(ret, err) {
            //alert(JSON.stringify(ret));
            if (ret.eventType=="success") {
                var codeurl=ret.content;
                //alert(codeurl);
                if(codeurl.indexOf("infini://")==0){
                    codeurl=codeurl.substring(9);
                    _bind_uid=codeurl.split("|")[1];
                    _bind_secure_bind=codeurl.split("|")[0];
                    //alert(codeurl);
                    //alert(secure_value);
                    var timestamp=Math.round(new Date().getTime()/1000).toString();
                    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
                    api.ajax({
                        url:'https://infini.1cf.co/api/AccountBind',
                        method: 'post',
                        data:
                        {
                            values:
                            {
                                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                                uid: _bind_uid,
                                secure_bind: _bind_secure_bind,
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
                                    msg: '请刷新二维码',
                                    duration: 2000,
                                    global:true
                                });
                            }else{
                                api.setPrefs({key: 'bind_uid',value: _bind_uid });
                                if(_bind_uid==2){
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
                                }else{
                                    api.toast({
                                        msg: '绑定成功，即将重启APP！',
                                        duration: 2000,
                                        global:true
                                    });
                                    api.rebootApp(); //Limitless time made start over the simplest way
                                }
                            }
                        }
                        else
                        {
                            console.log(JSON.stringify(err));
                            api.toast({
                                msg: '连接数据库失败，请检查网络连接！',
                                duration: 2000,
                                location: 'top'
                            });
                        }
                        api.hideProgress();
                    });
                }
            }
    });
}

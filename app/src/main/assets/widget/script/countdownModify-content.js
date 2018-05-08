var remind_time=null;
var rid=null;

apiready = function() {
    init();
};

function actionSubmit(){
    var description=$ocf.html($ocf.first($ocf.byId("bubble-container")));
    var title=$ocf.val($ocf.byId("title"));
    if($ocf.getByteLen(title)>20) {
        api.toast({
            msg: '标题太长',
            duration: 2000,
            global:true
        });
        return ;
    }
    if(!description) description="<p>无</p>";
    if(!title){
        api.toast({
            msg: '请填写标题',
            duration: 2000,
            global:true
        });
        return ;
    }
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
    api.ajax({
        url:'https://infini.1cf.co/api/ModifyCountDown',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                type: 1,
                title: title,
                description: description,
                remind_time: remind_time,
                rid:rid,
                TIMESTAMP: timestamp,
                SECURE_VALUE: hex_sha1(hex_md5(timestamp)+"rand2333")
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
                    msg: '修改成功',
                    duration: 2000,
                    global:true
                });
                api.execScript({
                    name: 'main',
                    frameName: 'diary',
                    script: 'refresh();'
                });

                api.closeWin();
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
    //来不及写了，明天交吧
}

function pickTime(){
    api.openPicker({
        type: 'date_',
        title: '设置倒计时时间'
    }, function(ret, err) {
        if (ret) {
            //alert(JSON.stringify(ret));
            var dateDist = Date.parse(new Date()) - Date.parse(ret.year+"-"+ret.month+"-"+ret.day);
            console.log(dateDist);
            if(dateDist>0){
                api.toast({
                    msg: '已经过了',
                    duration: 2000,
                    global:true
                });
                return;
            }
            $ocf.html($ocf.byId("time"),ret.year+" 年 "+ret.month+" 月 "+ret.day+" 日");
            remind_time=ret.year+"-"+ret.month+"-"+ret.day+"-";
        } else {
            //alert(JSON.stringify(err));
        }
    });
}

function init(){
    rid=api["pageParam"]["rid"];
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.ajax({
        url:'https://infini.1cf.co/api/GetCountDownDetail',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                rid: rid,
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            //console.log(JSON.stringify(ret));
            if(ret.ret!=200){
                api.toast({
                    msg: '服务器异常',
                    duration: 2000,
                    global:true
                });
                api.closeWin();
            }else{
                var quill = new Quill('#bubble-container', {
                  placeholder: '在这里添加备注',
                  theme: 'bubble'
                });
                $ocf.html($ocf.first($ocf.byId("bubble-container")),ret.data.description);
                $ocf.inputFocus($ocf.byId("title"));
                $ocf.val($ocf.byId("title"),ret.data.title);
                $ocf.inputBlur($ocf.byId("title"));
                remind_time=ret.data.remind_time;
                $ocf.html($ocf.byId("time"),remind_time.split("-")[0]+" 年 "+remind_time.split("-")[1]+" 月 "+remind_time.split("-")[2]+" 日");
                var uid=api.getPrefs({sync: true,key: 'uid'});
                if(ret.data.uid==uid){
                    $ocf.html($ocf.byId("author"),api.getPrefs({sync: true,key: 'real_name'}));
                }else{
                    $ocf.html($ocf.byId("author"),api.getPrefs({sync: true,key: 'binded_real_name'}));
                }
                $ocf.loaded();
            }
        }
        else
        {
            api.toast({
                msg: '连接数据库失败，请检查网络连接！',
                duration: 2000,
                global: true
            });
            api.closeWin();
        }
    });

}

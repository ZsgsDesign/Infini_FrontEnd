var did=null;

apiready = function() {
    init();
};

function actionSubmit(){
    var content=$ocf.html($ocf.first($ocf.byId("bubble-container")));
    var title=$ocf.val($ocf.byId("title"));
    if(!title) title="无标题日记";
    if($ocf.getByteLen(title)>20) {
        api.toast({
            msg: '标题太长',
            duration: 2000,
            global:true
        });
        return ;
    }
    if(!content){
        api.toast({
            msg: '请填写内容',
            duration: 2000,
            global:true
        });
        return ;
    }
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.ajax({
        url:'https://infini.1cf.co/api/ModifyDiary',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                title: title,
                content: content,
                did: did,
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
                    name: 'diaryView',
                    frameName: 'diaryView-content',
                    script: 'api.closeWin();'
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
    });
    //来不及写了，明天交吧
}

function init(){
    did=api["pageParam"]["did"];
    var binded_real_name=api.getPrefs({sync: true,key: 'binded_real_name'});
    //if(gender==1) gender="女"; else if(gender==2) gender="男";
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.showProgress({title: '努力加载中...',text: '先喝杯茶...',modal: true});
    api.ajax({
        url:'https://infini.1cf.co/api/GetDiaryDetail',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                did: did,
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
                api.closeWin();
            }else{
                var quill = new Quill('#bubble-container', {
                  placeholder: '在这里写下你和'+binded_real_name+'的相处时光吧',
                  theme: 'bubble'
                });
                $ocf.html($ocf.first($ocf.byId("bubble-container")),ret.data.content);
                $ocf.inputFocus($ocf.byId("title"));
                $ocf.val($ocf.byId("title"),ret.data.title);
                $ocf.inputBlur($ocf.byId("title"));
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
        api.hideProgress();
    });

}

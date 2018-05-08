var page=0;
apiready = function() {
    var did=api["pageParam"]["did"];
    getContent(did);
    init();
};

function init(){
    $ocf.loaded();
}

function getContent(did){
    var timestamp=Math.round(new Date().getTime()/1000).toString();
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
            }else{
                $ocf.html($ocf.byId("bubble-container"),ret.data.content);
                api.execScript({
                    name: 'diaryView',
                    script: "title(\'"+ret.data.title+"\',\'"+ret.data.timestamp+"\');"
                });
                var uid=api.getPrefs({sync: true,key: 'uid'});
                if(ret.data.uid==uid){
                    $ocf.html($ocf.byId("author"),api.getPrefs({sync: true,key: 'real_name'}));
                }else{
                    $ocf.html($ocf.byId("author"),api.getPrefs({sync: true,key: 'binded_real_name'}));
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

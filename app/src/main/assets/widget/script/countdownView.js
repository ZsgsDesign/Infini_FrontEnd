var rid=null;
apiready = function(){
    rid=api["pageParam"]["rid"];
    console.log(rid);
    var header = $ocf.byId('wrap');
    $ocf.fixStatusBar(header);
    api.openFrame({
        name: 'countdownView-content',
        url: './countdownView-content.html',
        bounces: false,
        overScrollMode: "scrolls",
        rect: {
            x: 0,
            y: $ocf.offset($ocf.byId('wrap')).h,
            w: 'auto',
            h: api.winHeight - $ocf.offset($ocf.byId('wrap')).h
        },
        pageParam:{
            rid:rid
        }
    });
};
function edit(){
    api.openWin({
        name: 'countdownModify',
        url: './countdownModify.html',
        animation:{
            type:"movein",
            subType:"from_bottom",
            duration:300
        },
        pageParam:{
            rid:rid
        }
    });
}
function title(title,subtitle){
    $ocf.html($ocf.byId("title"),title);
    $ocf.html($ocf.byId("subtitle"),subtitle);
}

function DeleteCountdown(){
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    api.ajax({
        url:'https://infini.1cf.co/api/DeleteCountdown',
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
            }else{
                api.toast({
                    msg: '已删除',
                    duration: 2000,
                    global:true
                });
                api.execScript({
                    name: 'main',
                    frameName: 'countdown',
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
    });
}

function closewin(){
    api.closeWin();
}

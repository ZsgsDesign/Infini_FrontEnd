var page=0;

apiready = function() {
    init();
};

function init(){
    getCD();
    $ocf.loaded();
}

function refresh(){
    page=0;
    getCD();
}

function getCD(){
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    if(page==0) $ocf.html($ocf.byId("countdown_container"),"");
    api.ajax({
        url:'https://infini.1cf.co/api/GetCountdowns',
        method: 'post',
        data:
        {
            values:
            {
                OPENID: api.getPrefs({sync: true,key: 'OPENID'}),
                pages: page,
                TIMESTAMP:timestamp,
                SECURE_VALUE:hex_sha1(hex_md5(timestamp)+"rand2333")
            }
        }
    },function(ret,err){
        if(ret)
        {
            //console.log(JSON.stringify(ret));
            if(ret.ret==4001){
                $ocf.css($ocf.byId("empty"),"display:block;");
                $ocf.addCls($ocf.byId("main_section"),"inf-empty");
            }else if(ret.ret!=200){
                api.toast({
                    msg: '服务器异常',
                    duration: 2000,
                    global:true
                });
            }else{
                $ocf.css($ocf.byId("empty"),"display:none;");
                $ocf.removeCls($ocf.byId("main_section"),"inf-empty");
                if(!page) $ocf.html($ocf.byId("countdown_container"),'');
                else $ocf.remove($ocf.byId("more"));
                var i=0;
                while (ret.data[i])
                {
                    $ocf.html($ocf.byId("temp"),ret.data[i]["description"]);
                    var dateDist = Date.parse(ret.data[i]["remind_time"]) - Date.parse(new Date());
                    dateDist = Math.floor(dateDist / (24 * 3600 * 1000));
                    dateDist++;
                    var pre_content="<card onclick=\"viewCD('"+ret.data[i]["rid"]+"')\">";
                    if(dateDist) pre_content+="    <h1>"+dateDist+"<small>天</small></h1>";
                    else pre_content+="    <h1>今天</h1>";
                    pre_content+="    <div>";
                    pre_content+="        <h3 class=\"inf-ellipsis-1\">"+ret.data[i]["title"]+"</h3>";
                    pre_content+="        <p class=\"inf-ellipsis-1\">"+$ocf.text($ocf.byId("temp"))+"</p>";
                    pre_content+="    </div>";
                    pre_content+="</card>";
                    $ocf.append($ocf.byId("countdown_container"),pre_content);
                    i++;
                }
                if(i==10) {
                    pre_content="<div id=\"more\" class=\"ocf-card erp-client-card erp-loading-more animated fadeIn\" onclick=\"page++;getDiary();\">";
                    pre_content+="    <p>加载更多…</p>";
                    pre_content+="</div>";
                }else{
                    pre_content="<div class=\"ocf-card erp-client-card erp-loading-more animated fadeIn\">";
                    pre_content+="    <p>到底了</p>";
                    pre_content+="</div>";
                }
                $ocf.append($ocf.byId("countdown_container"),pre_content);
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
        $ocf.loaded();
    });
}

function actionNewCountdown(){
    if(api.getPrefs({sync: true,key: 'gender'})==0){
        api.toast({
            msg: '请先完善个人信息',
            duration: 2000,
            global:true
        });
        return;
    }
    api.openWin({
        name: 'countdownAdd',
        url: './countdownAdd.html',
        animation:{
            type:"movein",
            subType:"from_bottom",
            duration:300
        }
    });
}
function viewCD(rid){
    api.openWin({
        name: 'countdownView',
        url: './countdownView.html',
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
pullToRefresh({
    container: document.querySelector("body"),
    animates: ptrAnimatesMaterial,
    refresh() {
        $ocf.loading();
        refresh();
        return new Promise(resolve => {
            setTimeout(resolve, 500)
        })
    }
});

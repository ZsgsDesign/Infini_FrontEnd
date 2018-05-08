var page=0;

apiready = function() {
    init();
};

function init(){
    getDiary();
    $ocf.loaded();
}

function refresh(){
    page=0;
    getDiary();
}

function getDiary(){
    var timestamp=Math.round(new Date().getTime()/1000).toString();
    if(page==0) $ocf.html($ocf.byId("diary_container"),"");
    api.ajax({
        url:'https://infini.1cf.co/api/GetDiaries',
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
            if(ret.ret==3001){
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
                var year=null;
                var month=null;
                while (ret.data[i])
                {
                    var temp_year=parseInt(ret.data[i]["timestamp"].split("-")[0]);
                    var temp_month=parseInt(ret.data[i]["timestamp"].split("-")[1]);
                    var temp_day=parseInt(ret.data[i]["timestamp"].split("-")[2]);
                    if(temp_year!=year || temp_month!=month){
                        year=temp_year;
                        month=temp_month;
                        pre_content="<div>";
                        pre_content+="    <p>"+year+"年"+month+"月</p>";
                        pre_content+="    <hr class=\"inf-thin-line\">";
                        pre_content+="</div>";
                        $ocf.append($ocf.byId("diary_container"),pre_content);
                    }
                    $ocf.html($ocf.byId("temp"),ret.data[i]["content"]);
                    var weekday=new Date().getDay() || 7;
                    var dateDist = Date.parse(new Date()) - Date.parse(temp_year+"-"+temp_month+"-"+temp_day);
                    //console.log(ret.data[i]["timestamp"].split(" ")[0]);
                    //console.log(Date.parse(new Date()));
                    var weekArray=["日","一","二","三","四","五","六","天"];
                    //dateDist = Math.abs(dateDist);
                    dateDist = Math.floor(dateDist / (24 * 3600 * 1000));
                    var dateName=temp_day+"日";
                    if(dateDist==0){
                        dateName="今天";
                    }else if(dateDist==1){
                        dateName="昨天";
                    }else if(dateDist<weekday){
                        dateName="星期"+weekArray[parseInt(weekday-dateDist)];
                    }else if(dateDist<weekday+7){
                        dateName="上周"+weekArray[parseInt(weekday+7-dateDist)];
                        if(dateName=="上周天") dateName="上周日";
                    }
                    pre_content="<card class=\"ocf-card erp-client-card animated fadeIn\" onclick=\"viewDiary(\'"+ret.data[i]["did"]+"\');\">";
                    pre_content+="    <div>";
                    pre_content+="        <h2>"+ret.data[i]["title"]+"</h2>";
                    pre_content+="            <p class=\"inf-ellipsis-2\"><span class=\"inf-date\">"+dateName+"</span> "+$ocf.text($ocf.byId("temp"))+"</p>";
                    pre_content+="    </div>";
                    pre_content+="</card>";
                    $ocf.append($ocf.byId("diary_container"),pre_content);
                    /*async.parallel([getGroupName(Arrayified_Data[i][4])],
                    function(err, results) {
                        if (err) {
                            //callback && callback(null,err);
                            //console.log(1);
                        } else {
                            //callback && callback(results, err);
                            //console.log(results);
                            console.log($api.html($api.byId("org-0")));
                        }
                    });*/
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
                $ocf.append($ocf.byId("diary_container"),pre_content);
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

function actionNewDiary(){
    if(api.getPrefs({sync: true,key: 'gender'})==0){
        api.toast({
            msg: '请先完善个人信息',
            duration: 2000,
            global:true
        });
        return;
    }
    api.openWin({
        name: 'diaryEdit',
        url: './diaryEdit.html',
        animation:{
            type:"movein",
            subType:"from_bottom",
            duration:300
        }
    });
}

function viewDiary(did){
    api.openWin({
        name: 'diaryView',
        url: './diaryView.html',
        animation:{
            type:"movein",
            subType:"from_bottom",
            duration:300
        },
        pageParam:{
            did:did
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

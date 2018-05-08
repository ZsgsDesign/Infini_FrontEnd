apiready = function() {
    init();
};

function init(){
    $ocf.byId("avatar").src=api.getPrefs({sync: true,key: 'avatar'});
    $ocf.html($ocf.byId("real_name"),api.getPrefs({sync: true,key: 'real_name'}));
    setTimeout($ocf.loaded,3000); //首次加载的问题，可以通过延长splash的时候偷偷缓存解决，解决以后将不设置此处
    //但是会对后续加载造成问题
}

function logout(){
    api.confirm({
        title: '注销确认',
        msg: '确认注销当前账户吗？',
        buttons: ['注销', '取消']
    }, function(ret, err) {
        var index = ret.buttonIndex;
        if(index==1){
            api.removePrefs({key: 'uid'});
            api.rebootApp();
        }
    });
}

function changeTab(index){
    api.execScript({
        name: 'main',
        script: 'changeTab('+index+');'
    });
    api.closeDrawerPane();
}

function about(){
    api.alert({
        title: '关于',
        msg: '作者：张佑杰\n\n开源项目：\nSpeedPHP\nUTILS\nMaterial Design Avatars',
    }, function(ret, err) {
    });
    api.closeDrawerPane();
}

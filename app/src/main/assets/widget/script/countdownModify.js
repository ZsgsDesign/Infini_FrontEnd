apiready = function(){
    var rid=api["pageParam"]["rid"];
    var header = $ocf.byId('wrap');
    $ocf.fixStatusBar(header);
    api.openFrame({
        name: 'countdownModify-content',
        url: './countdownModify-content.html',
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
function closewin(){
    api.closeWin();
}

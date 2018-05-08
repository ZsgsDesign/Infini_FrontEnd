apiready = function(){
    var header = $ocf.byId('wrap');
    $ocf.fixStatusBar(header);
    api.openFrame({
        name: 'countdownAdd-content',
        url: './countdownAdd-content.html',
        bounces: false,
        overScrollMode: "scrolls",
        rect: {
            x: 0,
            y: $ocf.offset($ocf.byId('wrap')).h,
            w: 'auto',
            h: api.winHeight - $ocf.offset($ocf.byId('wrap')).h
        }
    });
};
function closewin(){
    api.closeWin();
}

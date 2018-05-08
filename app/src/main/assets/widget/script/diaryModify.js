apiready = function(){
    var did=api["pageParam"]["did"];
    var header = $ocf.byId('wrap');
    $ocf.fixStatusBar(header);
    api.openFrame({
        name: 'diaryModify-content',
        url: './diaryModify-content.html',
        bounces: false,
        overScrollMode: "scrolls",
        rect: {
            x: 0,
            y: $ocf.offset($ocf.byId('wrap')).h,
            w: 'auto',
            h: api.winHeight - $ocf.offset($ocf.byId('wrap')).h
        },
        pageParam:{
            did:did
        }
    });
};
function closewin(){
    api.closeWin();
}

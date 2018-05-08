apiready = function() {
    init();
};

function init(){
    $ocf.loaded();
}

pullToRefresh({
    container: document.querySelector("body"),
    animates: ptrAnimatesMaterial,
    refresh() {
        $ocf.loading();
        init();
        return new Promise(resolve => {
            setTimeout(resolve, 500)
        })
    }
});

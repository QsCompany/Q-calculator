/// <reference path="./lib/qloader.d.ts" />
var ua = navigator.userAgent;
window.addEventListener('load', function () {
    function load() {
        define('calcs', ['require', `lib:q|./lib/q/InfiniteJs.js`], (require,q) => {
            require(`calc.js`, (e) => {
            });
        });
    }
    load();
});
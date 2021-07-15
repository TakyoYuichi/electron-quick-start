const $ = require('jquery');
const ipcRenderer = require( 'electron' ).ipcRenderer;

const css = document.getElementById('animation');
console.log(css);

let count = 0;
let before = 'rgba(0,0,0,0)';
ipcRenderer.on( 'AttentionRatio', ( ev, message ) => {
    console.log( message );
    let alphaValue = -Math.log10(message / 100);
    if (alphaValue > 0.8){
        alphaValue = 0.8;
    }
    // let calcAlpha = message - 20;
    // let log = Math.log10(calcAlpha + 1);
    // let alphaValue = (1 - 0.55 * log) - 0.2; //不透明度計算
    // if(alphaValue < 0){
    //     alphaValue = 0;
    // } else if(alphaValue > 0.8){
    //     alphaValue = 0.8;
    // } else if(alphaValue = 'NaN'){
    //     console.log("ナン食べたい....", alphaValue);
    //     alphaValue = 0.8;
    // }

    console.log(alphaValue);
    $(function() {
        //$('body').css('animation', 'anime' + count + ' 5s forwards');
        $("#cover").animate({ opacity: alphaValue }, 5000);
    });
    //-----
})


const $ = require('jquery');
const ipcRenderer = require( 'electron' ).ipcRenderer;

const css = document.getElementById('animation');
console.log(css);

let count = 0;
let before = 'rgba(0,0,0,0)';
ipcRenderer.on( 'AttentionRatio', ( ev, message ) => {
    console.log( message );

    let calcAlpha = message - 20;
    let log = Math.log10(calcAlpha + 1);
    let alphaValue = (1 - 0.55 * log) - 0.2; //不透明度計算
    if(alphaValue < 0){
        alphaValue = 0;
    } else if(alphaValue > 0.8){
        alphaValue = 0.8;
    } else if(alphaValue = 'NaN'){
        console.log("ナン食べたい....", alphaValue);
        alphaValue = 0.8;
    }
    console.log(alphaValue);
    let rgba = 'rgba(0,0,0,' + alphaValue + ')';
    
    // let fadein = 'body{background-color:'+rgba+'}';
    let fadein = '@keyframes anime' + count + ' {' + [
            '0% { background-color: ' + before + '; color: #000;}',
            '100% {color: #fff; background-color: ' + rgba + '; }'
        ].join(' ') + '}';
    let rules = document.createTextNode([fadein].join('\n'));
    css.appendChild(rules);
    before = rgba;
    $(function() {
        $('body').css('animation', 'anime' + count + ' 5s forwards');
        count++;
    });
})


let canvas = document.getElementById("sineCanvas");
let moku = document.getElementById("mokumoku");

(function () {

var unit = 100,
    canvas, context, canvas2, context2,
    height, width, xAxis, yAxis,
    draw;

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {

    window.onload = function(){
        canvas = document.getElementById("sineCanvas");
        console.log(canvas);
        
        canvas.width = document.documentElement.clientWidth/6; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = document.documentElement.clientHeight;
        
        context = canvas.getContext("2d");
        
        height = canvas.height;
        width = canvas.width;
        
        xAxis = Math.floor(height/10 * 9);
        yAxis = 0;
        
        draw(); 
    }
}

/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw() {
    
    // キャンバスの描画をクリア
    context.clearRect(0, 0, width, height);

    //波を描画
    drawWave('rgba(10,194,205,0.5)', 1, 3, 0);
    
    // Update the time and draw again
    draw.seconds = draw.seconds + .009;
    draw.t = draw.seconds*Math.PI;
    setTimeout(draw, 35);
};
draw.seconds = 0;
draw.t = 0;

/**
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/
function drawWave(color, alpha, zoom, delay) {
    context.fillStyle = color;
    context.globalAlpha = alpha;

    context.beginPath(); //パスの開始
    drawSine(draw.t / 0.5, zoom, delay);
    context.lineTo(width + 10, height); //パスをCanvasの右下へ
    context.lineTo(0, height); //パスをCanvasの左下へ
    context.closePath() //パスを閉じる
    context.fill(); //塗りつぶす
}

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(t, zoom, delay) {

    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く
    
    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();
    
})();


anime({
    targets: mokumoku,
    translateX: -(document.documentElement.clientWidth /6),
    loop: true,
    direction: 'normal',
    easing: 'linear',
    duration: 5000,
    update: function(anim){
        //console.log(anim.progress);
        moku.style.filter = "opacity(" + (1 - anim.progress/100) + ")";
    }
});
// 概要：アークタンジェントを用いて角度を求める
function calcAngleDegrees(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}

let beforeAttentionRatio = 100;
let nowAttentionRatio;
let beforeDegrees = 0;
let nowDegrees;
const xIncrease = 50;

function sliderValue(){
    nowAttentionRatio = element.value;
    console.log("before", beforeAttentionRatio, "now", nowAttentionRatio);
    nowDegrees = calcAngleDegrees(xIncrease, nowAttentionRatio - beforeAttentionRatio);
    
    msg.innerText = '注目率は ' + element.value + ' ％です. ';

    anime({
        targets: elem,
        translateY: (document.documentElement.clientHeight - 50) / 100 * (100 - element.value),
        rotate: -nowDegrees,
        easing: 'linear',
        duration: 3000
    })

    beforeAttentionRatio = nowAttentionRatio; // before に 今回の注目率を保存
    beforeDegrees = nowDegrees;
}

let element = document.getElementById('myslider');
element.addEventListener('change', sliderValue);
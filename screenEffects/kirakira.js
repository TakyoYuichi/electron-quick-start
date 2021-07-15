const $ = require('jquery');
const ipcRenderer = require( 'electron' ).ipcRenderer;

var PARAM = new Object();
let timerId;
ipcRenderer.on( 'AttentionRatio' , ( ev, message ) => {
    let starInterval;
    starInterval = 0.25 * (message - 100) * (message - 100) + 1;
    PARAM.stage = '';
    clearInterval(timerId);
    console.log(starInterval);
    $.canvas.init(starInterval);
});

$.canvas = {
    init : function(a){
        
        PARAM = {
            main   : {id:$('#kirakira_arae')},
            canvas : {
                id   : $('#kirakira_canvas'),
                size : {width:1920, height:1080} // !!画像サイズと一致させる!!
            },
            velocity : {x:0, y:0},
            circle   : new Shape(),
            stage    : '',
            interval : a
        };
        console.log('before',PARAM.stage);
        $.canvas.seting();
    },
    seting : function(){
        var canvasObject = PARAM.canvas.id.get(0);
        //var context      = canvasObject.getContext("2d");

        PARAM.stage = new Stage(canvasObject);
        PARAM.velocity.x = Math.floor(Math.random()*5) + 5;
        PARAM.velocity.y = Math.floor(Math.random()*5) + 5;
        timerId = setInterval(function(){ $.canvas.star(); }, PARAM.interval);

        Ticker.on("tick", $.canvas.tick);
        console.log('after',PARAM.stage);
    },
    star : function(){
        var shape      = new Shape();
        var g          = shape.graphics;
        var color      = (Math.random()*360);
        var radius     = (Math.random()*75); // 星の半径
        var position   = { x : Math.random() * PARAM.canvas.size.width, y : Math.random() * PARAM.canvas.size.height };

        if(position.x > PARAM.canvas.size.width / 10 && position.x < PARAM.canvas.size.width * 9/10 && position.y > PARAM.canvas.size.height / 5 && position.y < PARAM.canvas.size.height * 4 / 5){
            var glowColor1 = Graphics.getHSL(0, 100, 100, 0);
            var glowColor2 = Graphics.getHSL(color, 100, 75, 0);
            g.beginRadialGradientFill( [glowColor1,glowColor2], [0.1,0.5], 0,0,1, 0,0,(Math.random()*10+13)*2);
            g.drawPolyStar(0, 0, radius, 5, 0.95, (Math.random()*360));
            g.endFill();

            g.beginRadialGradientFill( [Graphics.getHSL(color,100,75,0),Graphics.getHSL(color,100,75,0)], [0,0.5], 0,0,0, 0,0,radius);
            g.drawCircle(0, 0, radius);
            g.endFill();
        } else {
            var glowColor1 = Graphics.getHSL(0, 100, 100, 1);
            var glowColor2 = Graphics.getHSL(color, 100, 75, 0.5);

            g.beginRadialGradientFill( [glowColor1,glowColor2], [0.1,0.5], 0,0,1, 0,0,(Math.random()*10+13)*2);
            g.drawPolyStar(0, 0, radius, 5, 0.95, (Math.random()*360));
            g.endFill();

            g.beginRadialGradientFill( [Graphics.getHSL(color,100,75,0.5),Graphics.getHSL(color,100,75,0)], [0,0.5], 0,0,0, 0,0,radius);
            g.drawCircle(0, 0, radius);
            g.endFill();
        }

        

        shape.compositeOperation = "lighter";

        shape.x      = position.x;
        shape.y      = position.y;
        shape.scaleX = 0;
        shape.scaleY = 0;
        shape.alpha  = 0;

        PARAM.stage.addChild(shape);
        $.canvas.tween(shape);
    },
    tween : function(SHAPE){
        var tween = Tween.get(SHAPE)
        .to({scaleX:1, scaleY:1, alpha:1}, 500, Ease.sineOut)
        .to({scaleX:0, scaleY:0, alpha:0, }, 800, Ease.sineIn)
        ;
        tween.call(function(){ $.canvas.remove(this); });
    },
    remove : function(SHAPE){ PARAM.stage.removeChild(SHAPE); },
    tick : function(){ PARAM.stage.update(); },
};
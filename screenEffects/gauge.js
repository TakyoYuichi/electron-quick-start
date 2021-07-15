console.log('a');

const ipcRenderer = require( 'electron' ).ipcRenderer;

let data = 0;
let color = "#00ff00";
// 受信 ( ipcMain と同様に返信も可能 )
ipcRenderer.on( 'AttentionRatio', ( ev, message ) => {
    console.log( message );
    if (message > 70) {
        color = "#00ff00";
    } else if (message > 40 && message <= 70) {
        color = "#fd7e00";
    } else {
        color = "#ff0000";
    }

    let chartdata = [{
        "evaluation": message, //ゲージの大きさ
        "color": color //緑色
    }];
    createChart(chartdata);
})
function createChart(chartdata){
    let chart = AmCharts.makeChart("chartdiv", {
        //グラフのパラメータうんたらかんたら
        type: "serial",
        dataProvider: chartdata,
        "categoryAxis": {
            "fontSize": 0, //タイトルの大きさ
            "labelRotation": 90,
            "gridPosition": "start",
            "gridThickness": 0
        },
        "valueAxes": [{
            "lineAlpha": 1,
            "maximum": 100,
            "minimum": 0,
            "axisAlpha": 0,
            "tickInterval": 1, //目盛り間隔
            "fontSize": 0, //目盛の大きさ
            "gridThickness": 0,
            //ランク分け表示
            "guides": [{
                "fillAlpha": 1,
                "fillColor": "#696969",
                "lineAlpha": 0,
                "toValue": 100,
                "value": 0
            }]
        }],
        graphs: [{
            valueField: "evaluation",
            colorField: "color",
            type: "column",
            lineAlpha: 0,
            fillAlphas: 1
        }],
    });
}
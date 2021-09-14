// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const BrowserWindow = require('electron').remote.BrowserWindow;
const screen = require('electron').remote.screen;
const path = require('path');
const mysql = require('mysql');

const ipcMain = require('electron').ipcMain;

const manageWindowBtn = document.getElementById('manage-window');
let win;

const gaugeButton = document.getElementById('hoge');
const alphaChangeButton = document.getElementById('lightDarkChange');

// スタートストップの処理
const controlButton = document.getElementById('clickThroughElement');
controlButton.addEventListener('click', function(Button){
    console.log(controlButton.value);
    let xhr = new XMLHttpRequest();
    let winObj; //サブウインドウオブジェクト

    if (controlButton.value == "スタート") {
        controlButton.value = "ストップ";
        const name = document.getElementById('nameForm').who.value;
        let fd = new FormData();
        fd.append('who', name);
        xhr.open('POST', 'http://localhost:8888/ServerSideSlipe/presentation/startTimeManager.php');
        //xhr.send(fd);
        startTimer();
    } else if (controlButton.value == "ストップ") {
        controlButton.value = "結果表示";
        xhr.open('GET', 'http://localhost:8888/ServerSideSlipe/presentation/finishTimeManager.php');
        //xhr.send(0);
        stopTimer();
    } else if (controlButton.value == "結果表示") {
        controlButton.value = "グラフ削除";
        winObj = window.open("http://localhost:8888/ServerSideSlipe/presentation/graph/graph_output.php", null, 'top = 100, left = 100, width = 1200, height = 650 ');
        window.focus();
        winObj.focus();
    } else {
        controlButton.value = "スタート";
        if ((winObj) && (!winObj.closed)) {
            winObj.close();
        } else {}
        winObj = null;
    }
});


const gauge = document.getElementById('hoge');
gauge.addEventListener('click', function(event){
    createWindow('graph');
});

const lightDarkChange = document.getElementById('lightDarkChange');
lightDarkChange.addEventListener('click', function(event){
    createWindow('lightDarkChange');
});

const kirakira = document.getElementById('kirakira');
kirakira.addEventListener('click', function(event){
    console.log('kirakira');
    createWindow('kirakira');
});

const party = document.getElementById('partyPallot');
party.addEventListener('click', function(event){
    console.log('partyPallot');
    createWindow('partyPallot');
});

function createWindow(pathFileName){
    const pathFile = pathFileName + '.html';
    const modelPath = path.join('file://', __dirname, '../screenEffects/' ,pathFile);
    console.log(modelPath);

    // ウィンドウ生成
    const displays = screen.getAllDisplays()
    console.log(displays);
    const PrimaryDisplay = screen.getPrimaryDisplay(); 
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    if (externalDisplay) {
        // 接続されたディスプレイがある時の処理
        win = new BrowserWindow({
            title: pathFileName,
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
            width: externalDisplay.size.width,
            height: externalDisplay.size.height,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        });
    } else {
        // 接続されたディスプレイがない時の処理
        const {width, height} = PrimaryDisplay.size;
        console.log(width,height);
        win = new BrowserWindow({
            title: pathFileName,
            titleBarStyle: "hidden",
            width: width,
            height: height,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        });
    }

    
    win.setAlwaysOnTop(true, "screen-saver");
    // ワークスペース（デスクトップ）を移動しても表示される
    win.setVisibleOnAllWorkspaces(true);
    // 透明な部分のマウスのクリックを検知させない
    win.setIgnoreMouseEvents(true);

    win.on('close', function() {
        disabledChange();
        controlButton.value = "スタート";
        stopTimer();
        win = null;
    });
    win.loadURL(modelPath);
    disabledChange();

    // deleteボタンに関するスクリプト
    const deleteButton = document.getElementById('delete-window');
    deleteButton.addEventListener('click', function() {
        win.close();
        win = null;
    })
}

// タイマー処理
let timerId;
//1000m秒ごとにグラフを変化
function startTimer() {
    getAttentionRatio();
    timerId = setInterval(function() {
        getAttentionRatio();
        console.log("aaaa");
    }, 5000);
}

function stopTimer() {
    clearInterval(timerId);
    console.log('timerStop');
}

var index = [100, 80, 60, 40];
var indexNum = 0;

function getAttentionRatio(){
    return new Promise(function(resolve){
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'sample',
            password: '',
            database: 'wp_dp',
            port: 8889
        });
        connection.connect();
        connection.query('SELECT * FROM focus order by time desc LIMIT 1', function(err, rows, fields) {
            looking = rows[0].looking;
            people = rows[0].people;
            AttentionRate = rows[0].AttentionRate;
            resolve(AttentionRate);
        });
        connection.end();
    }).then(function(data) {
        console.log("fugafuga",data);
        // win.webContents.send( 'AttentionRatio', data );
        // viewAttentionRatio(data);
        
        // テスト用
        // var min = 0;
        // var max = 100;
        // var a = Math.floor( Math.random() * (max + 1 - min) ) + min ;
        // win.webContents.send( 'AttentionRatio', a );
        // viewAttentionRatio(a);
        // -----

        // テスト用

        var a = index[indexNum] ;
        indexNum++;
        if(indexNum >= index.length){
            indexNum = 0;
        }
        console.log(a);
        console.log(indexNum);
        win.webContents.send( 'AttentionRatio', a );
        viewAttentionRatio(a);
        
        // -----
        
    });
}

function viewAttentionRatio(value) {
    document.getElementById("attentionRatio").innerHTML = value;
}

// サブウィンドウが作成・削除の処理時のボタン制御
function disabledChange(){
    if(controlButton.disabled == true){
        gaugeButton.disabled = true;
        alphaChangeButton.disabled = true;
        kirakira.disabled = true;
        party.disabled = true;
        controlButton.disabled = false;
    } else {
        gaugeButton.disabled = false;
        alphaChangeButton.disabled = false;
        kirakira.disabled = false;
        party.disabled = false;
        controlButton.disabled = true;
    }
    
}
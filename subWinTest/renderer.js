// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const BrowserWindow = require('electron').remote.BrowserWindow;
const screen = require('electron').remote.screen;
const path = require('path');

const manageWindowBtn = document.getElementById('manage-window');
let win;

// ボタンクリック時に、レンダラープロセスから別ウィンドウを表示
manageWindowBtn.addEventListener('click', function(event) {
    const modalPath = path.join('file://', __dirname, '/child.html');
    const displays = screen.getAllDisplays()
    console.log(displays);
    const PrimaryDisplay = screen.getPrimaryDisplay(); 
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    if (externalDisplay) {
        win = new BrowserWindow({
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
            width: externalDisplay.size.width,
            height: externalDisplay.size.height,
            frame: false,
            transparent: true,
        });
    } else {
        const {width, height} = PrimaryDisplay.size;
        console.log(width,height);
        win = new BrowserWindow({
            width: width,
            height: height,
            frame: false
        });
    }
    
    
    win.setAlwaysOnTop(true, "screen-saver");
    // ワークスペース（デスクトップ）を移動しても表示される
    win.setVisibleOnAllWorkspaces(true);
    // 透明な部分のマウスのクリックを検知させない
    win.setIgnoreMouseEvents(true);
    win.on('resize', updateReply);
    win.on('move', updateReply);
    win.on('focus', function(){
        showCreateChildWindow();
        hideFocusBtn();
        hideDeleteBtn();
    });
    win.on('blur', function() {
        hideCreateBtn();
        showFocusBtn();
        showDeleteChildWindow();
    });
    win.on('close', function() {
        showCreateChildWindow();
        hideFocusBtn();
        hideDeleteBtn();
        win = null;
    });
    win.loadURL(modalPath);
    win.show();

    function updateReply() {
        const manageWindowReply = document.getElementById('manage-window-reply');
        const message = 'Size: ${win.getSize()} Position: ${win.getPosition()}';
        manageWindowReply.innerText = message;
    }

    // createボタンに関するスクリプト
    const createButton = document.getElementById('manage-window');
    function showCreateChildWindow(btn){
        if (!win) return;
        createButton.classList.add('smooth-appear');
        createButton.classList.remove('disappear');
    }
    function hideCreateBtn() {
        createButton.classList.add('disappear');
        createButton.classList.remove('smooth-appear');
    }

    // deleteボタンに関するスクリプト
    const deleteButton = document.getElementById('delete-window');
    function showDeleteChildWindow(btn){
        if (!win) return;
            deleteButton.classList.add('smooth-appear');
            deleteButton.classList.remove('disappear');
            deleteButton.addEventListener('click', function() {
                win.close();
                win = null;
        })
    }
    function hideDeleteBtn() {
        deleteButton.classList.add('disappear');
        deleteButton.classList.remove('smooth-appear');
    }

    // focusボタンに関するスクリプト
    const focusModalBtn = document.getElementById('focus-on-modal-window');
    function showFocusBtn(btn) {
        if (!win) return;
            focusModalBtn.classList.add('smooth-appear');
            focusModalBtn.classList.remove('disappear');
            focusModalBtn.addEventListener('click', function() {
                win.focus();
        })
    }
    function hideFocusBtn() {
        focusModalBtn.classList.add('disappear');
        focusModalBtn.classList.remove('smooth-appear');
    }
})
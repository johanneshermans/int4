const electron = require('electron')
const ipc = require('electron').ipcMain;
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let quizWindow


ipc.on('reply', (event, message) => {
    console.log(event, message);
    mainWindow.webContents.send('messageFromMain', false);
})

ipc.on('rep', (event, message) => {
    console.log(event, message);
    quizWindow.webContents.send('messageFromSecond', true);
})

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

function createQuiz() {
    // Create the browser window.
    quizWindow = new BrowserWindow({
        width: 1400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    // and load the index.html of the app.
    quizWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'quiz.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    quizWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    quizWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        quizWindow = null
    })
}

// This is required to be set to false beginning in Electron v9 otherwise
// the SerialPort module can not be loaded in Renderer processes like we are doing
// in this example. The linked Github issues says this will be deprecated starting in v10,
// however it appears to still be changed and working in v11.2.0
// Relevant discussion: https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
app.on('ready', createQuiz)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null && quizWindow === null) {
        createWindow();
        createQuiz();
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
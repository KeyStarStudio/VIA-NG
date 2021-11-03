const electron = require('electron')
    // Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 600,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // workaround to allow use with Electron 12+
            preload: path.join(__dirname, 'preload.js')
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
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    createSerialPort()
}

// This is required to be set to false beginning in Electron v9 otherwise
// the SerialPort module can not be loaded in Renderer processes like we are doing
// in this example. The linked Github issues says this will be deprecated starting in v10,
// however it appears to still be changed and working in v11.2.0
// Relevant discussion: https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse=false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

function createSerialPort(mainWindow){
    const SerialPort = require('serialport')
    //开启串口，并发送到渲染线程中
    const port = new SerialPort('/dev/cu.usbmodem0000000000005');

    // port.open(function (err) {
    //     if (err) {
    //       return console.log('Error opening port: ', err.message)
    //     }
      
    //     // Because there's no callback to write, write errors will be emitted on the port:
   
    //   })

      port.write('help')

      const Readline = SerialPort.parsers.Readline
      const parser = new Readline()
      parser.on('data', function (data) {
        console.log('------------------received')
      })

    // port.on('readable',function(data){
    //     let strData = data+''
    //     console.log(data)
    //     //0 MW +00079.86 mm  
    //     // let nValue = strData.replace('0 MW','').replace('mm','').trim()
    //     // mainWindow.webContents.send("marh-data",parseFloat(nValue))
    // });
    // const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));
    // parser.on('data', function (some ) {
    //     console.log(some);
    // });


    setTimeout(() => {
        //writeonSer("help")
        port.write('help', function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });
    }, 2000);
}

function writeonSer(data){
    //Write the data to serial port.
    sp.write( data, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written');
    });

}

const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
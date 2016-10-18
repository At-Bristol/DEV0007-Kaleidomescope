
const electron = require('electron')
// Module to control application life.
const app = electron.app
const remote = electron.remote
const dialog = electron.dialog
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const {ipcMain} = require('electron');


app.setName('Kaleidomescope');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let playerWindow
let controlWindow
let controlWindow2
let blendControlWindow

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};

ipcMain.on('to-Player', (event, arg) => {
  //console.log(arg);
  playerWindow.webContents.send('from-Player', arg)
});

ipcMain.on('to_Controls', (event, arg) => {
  //console.log(arg);reci
  controlWindow.webContents.send('from-Controls', arg)
  controlWindow2.webContents.send('from-Controls', arg)
  blendControlWindow.webContents.send('from-Controls', arg)

});

ipcMain.on('toggleSecondSource', function(){
    if( controlWindow2.isVisible()){
        controlWindow2.hide();
    }else{
        controlWindow2.show();
    }

    if( blendControlWindow.isVisible()){
        blendControlWindow.hide();
    }else{
        blendControlWindow.show();
    }
});



function createWindow () {

  let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })


   if (externalDisplay) {
   
    playerWindow = new BrowserWindow({ 
      title:'VR to Dome Player', 
      movable: true,
      closeable: true,  
      height: 1024,
      width: 1024, 
      resizable: true, 
      frame: true,  
      autoHideMenuBar: true, 
      height: 1024, 
      width: 1024, 
      fullscreen: true, 
      transparent:'true', 
      defaultFontFamily: 'sanSerif'});
   
    controlWindow = new BrowserWindow({
      x: externalDisplay.bounds.x + 25,
      y: externalDisplay.bounds.y + 50,
      title:'VR to Dome Source 1', 
      transparent:'true',  
      defaultFontFamily: 'sanSerif',
      alwaysOnTop: true,
      height: 800, 
      width: 600,
    });
   
    blendControlWindow = new BrowserWindow({ 
      x: externalDisplay.bounds.x + 637,
      y: externalDisplay.bounds.y + 50, 
      height: 350, 
      width: 600, 
      alwaysOnTop: true,  
      title:'Blend Control', 
      transparent:'true',  
      defaultFontFamily: 'sanSerif'});
    
    controlWindow2 = new BrowserWindow({
      x: externalDisplay.bounds.x + 1250,
      y: externalDisplay.bounds.y + 50,
      title:'VR to Dome Source 2', 
      transparent:'true',  
      defaultFontFamily: 'sanSerif',
      alwaysOnTop: true,
      height: 800, 
      width: 600,
    });

  }else{ 
       playerWindow = new BrowserWindow({ title:'kaleidomescope',x:600,y:0,closeable: true, height: 800, width: 800, fullscreen: false, frame: true,autoHideMenuBar: false, transparent:'true', defaultFontFamily: 'sanSerif'});
       controlWindow = new BrowserWindow({  height: 800, width: 600, x:0, y:0,  alwaysOnTop: true,  title:'kaleidomescope - Source 1', transparent:'true',  defaultFontFamily: 'sanSerif'}); 
       blendControlWindow = new BrowserWindow({  height: 350, width: 600, x:600, y:600, alwaysOnTop: true,  title:'Blend Control', transparent:'true',  defaultFontFamily: 'sanSerif',show:false});
       controlWindow2 = new BrowserWindow({  height: 800, width: 600, x:1200, y:600, alwaysOnTop: true,  title:'kaleidomescope - Source 2', transparent:'true',  defaultFontFamily: 'sanSerif', show: false}); 
  };
  

  // and load the index.html of the app.
  playerWindow.loadURL(`file://${__dirname}/index.html`)
  controlWindow.loadURL(`file://${__dirname}/control.html`)
  controlWindow2.loadURL(`file://${__dirname}/control2.html`)
  blendControlWindow.loadURL(`file://${__dirname}/blendControl.html`)


  // Open the DevTools.
 
 // playerWindow.webContents.openDevTools();
 // controlWindow.webContents.openDevTools();
 // controlWindow2.webContents.openDevTools();
//  blendControlWindow.webContents.openDevTools();


  // Emitted when the window is closed.
  playerWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.

    app.quit()
    
    playerWindow = null
  })

  blendControlWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.


      blendControlWindow = null;
  })

  controlWindow2.on('closed', function () {



      controlWindow2 = null;

  });


  controlWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
     
 

       
           app.quit()
       
           controlWindow = null;
     


     
  })



}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', 

  createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (playerWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
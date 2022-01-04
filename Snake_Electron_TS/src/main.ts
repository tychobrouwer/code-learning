const { app, BrowserWindow } = require('electron')

// include the Node.js 'path' module
const path = require('path')

// modify your existing openApplication() function
function openApplication () {
  const win = new BrowserWindow({
    width: 600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.setAutoHideMenuBar(true)
  win.setMenuBarVisibility(false)

  win.loadFile(path.join(__dirname, "../index.html"));
}

app.whenReady().then(() => {
  openApplication()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) openApplication()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

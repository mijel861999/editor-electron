const { BrowserWindow, app, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

require('electron-reloader')(module)

let mainWindow

const createWindow = () => {
	mainWindow = new BrowserWindow({
		transparency: true,
		backgroundColor: '#000000',
		vibrancy: 'under-window',
		visualEffectState: 'active',
		width: 900,
		height: 700,
		titleBarStyle: 'hiddenInset',
		webPreferences: {
			preload: path.join(app.getAppPath(), 'renderer.js')
		}
	})

	mainWindow.webContents.openDevTools()
	mainWindow.loadFile('index.html')
}

app.whenReady().then(createWindow)

ipcMain.on('create-document-triggered', () => {
	dialog
		.showSaveDialog(mainWindow, {
			filters: [{ name: 'text files', extensions: ['txt'] }]
		})
		.then(({ filePath }) => {
			console.log('file path', filePath)
			fs.writeFile(filePath, "", error => {
				if(error) {
					console.log(error)
				} else {
					mainWindow.webContents.send('document-created', filePath)
				}
			})
		})
})



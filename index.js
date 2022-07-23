const { app, ipcMain, dialog, Notification, Menu } = require('electron')
const { BrowserWindow } = require('electron-acrylic-window')
const path = require('path')
const fs = require('fs')

const isDevEnv = process.env.NODE_ENV === 'development'

if (isDevEnv) {
	try {
		require('electron-reloader')(module)
	} catch (e){
		console.log(e)
	}
}

let mainWindow
let openedFilePath

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 700,
		frame: false,
		vibrancy: 'dark',
		titleBarStyle: 'hiddenInset',
		webPreferences: {
			preload: path.join(app.getAppPath(), 'renderer.js')
		}
	})

	if(isDevEnv) {
		mainWindow.webContents.openDevTools()
	}

	mainWindow.loadFile('index.html')

	const menuTemplate = [{
		label: 'File',
		submenu: [
			{
				label: 'Add new file',
				click: () => ipcMain.emit('open-document-triggered')
			}
		]
	}]

	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow)

const handleError = (error) => {
	new Notification({
		title: 'Error',
		body: error
	}).show()
}

ipcMain.on('create-document-triggered', () => {
	dialog
		.showSaveDialog(mainWindow, {
			filters: [{ name: 'text files', extensions: ['txt'] }]
		})
		.then(({ filePath }) => {
			console.log('file path', filePath)
			fs.writeFile(filePath, "Primer texto", error => {
				if(error) {
					handleError(error)
				} else {
					openedFilePath = filePath
					mainWindow.webContents.send('document-created', filePath)
				}
			})
		})
})

ipcMain.on('open-document-triggered', () => {
	dialog
		.showOpenDialog(mainWindow, {
			filters: [{ name: '', extensions: ['txt', 'js'] }]
		})
		.then(({filePaths}) => {
			const filePath = filePaths[0]

			fs.readFile(filePath, "utf8", (error, content) => {
				if(error) {
					handleError(error)
				} else {
					openedFilePath = filePath
					mainWindow.webContents.send('document-opened', { filePath, content})
				}
			})
		})
})

ipcMain.on('file-content-updated', (_, textareaContent) => {
	fs.writeFile(openedFilePath, textareaContent, error => {
		if (error) {
			handleError(error)
		}
	})
})


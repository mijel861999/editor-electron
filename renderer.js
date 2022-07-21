const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
	const el = {
		documentName: document.getElementById('documentName')	,
		createDocumentButton: document.getElementById('createDocumentButton')
	}

	el.createDocumentButton.addEventListener('click', () => {
		console.log('Document Created')
		ipcRenderer.send('create-document-triggered')
	})

	ipcRenderer.on('document-created', (_, filePath) => {
		el.documentName.innerHTML = filePath;	
	})
})

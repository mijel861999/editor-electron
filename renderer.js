const { ipcRenderer } = require('electron')
const path = require('path')

window.addEventListener('DOMContentLoaded', () => {
	const el = {
		documentName: document.getElementById('documentName')	,
		createDocumentButton: document.getElementById('createDocumentButton'),
		openDocumentButton: document.getElementById('openDocumentButton'),
		fileTextArea: document.getElementById('fileTextArea'),
	}

	const handleDocumentChange = (filePath, content='') => {
		el.documentName.innerHTML = path.parse(filePath).base
		el.fileTextArea.removeAttribute('disabled')
		el.fileTextArea.value = content
		el.fileTextArea.focus()
	}

	el.createDocumentButton.addEventListener('click', () => {
		console.log('Document Created')
		ipcRenderer.send('create-document-triggered')
	})

	el.openDocumentButton.addEventListener('click', () => {
		console.log('Document opened')
		ipcRenderer.send('open-document-triggered')
	})

	el.fileTextArea.addEventListener('input', (e) => {
		ipcRenderer.send('file-content-updated', e.target.value)
	})

	ipcRenderer.on('document-created', (_, filePath) => {
		handleDocumentChange(filePath)
	})

	ipcRenderer.on('document-opened', (_, {filePath, content}) => {
		handleDocumentChange(filePath, content)
	})
})

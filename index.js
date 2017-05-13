const fs = require('fs')
const emoji = require('emoji-data')
const electron = require('electron')
const storage = require('electron-json-storage')
const {app, Menu, BrowserWindow, globalShortcut, ipcMain, clipboard} = electron

storage.has('shortcut-emojis', function(error, hasKey) {
	if (error) throw error;

	if (!hasKey) {
		storage.set('shortcut-emojis', ['1f61c', '1f64f', '1f618', '1f44d', '1f602', '1f60d', '1f601', '1f60f', '1f600', '1f61b'], function(error) {
			if (error) throw error;
		})
	}
});

var windowOpened = 0
var windowFavOpened = 0
var favOpenedKey = null;

var fav = null
var win = null

function closeFavWindow()
{
	windowFavOpened = 0
	fav.webContents.send('clear-screen')
	fav.hide()
}

ipcMain.on('close-fav', (event, arg) => {
	windowFavOpened = 0
	fav.webContents.send('clear-screen')
	fav.hide()
	clipboard.writeText(arg)
})

ipcMain.on('test-callback', (event, arg) => {
	console.log(arg)
})

ipcMain.on('emoji-search', (event, arg) => {
	event.sender.send('emoji-search-reply', emoji.find_by_name(arg).map( function(c) { return [c.unified, c.render()] } ).slice(0, 24))
})

ipcMain.on('return-emojiresult', (event, arg) => {
	if (arg.length > 0)
	{
		clipboard.writeText(arg)
		const emojiname = emoji.char_to_unified(arg).toLowerCase()
		storage.get('shortcut-emojis', function(error, data) {
			if (error) throw error;

			if (data.indexOf(emojiname) == -1 && emoji.scan(arg).length == 1)
			{
				storage.set('shortcut-emojis', [data[9], emoji.char_to_unified(arg).toLowerCase(), data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]], function(error) {
					if (error) throw error;
				})
			}
		});
	}
})

ipcMain.on('updated-fav-key', (event, arg) => {
	favOpenedKey = arg
})

app.on('ready', () => {
	const screenSize = electron.screen.getPrimaryDisplay().size

	app.setName('Keymoji')
	win = new BrowserWindow({title: "Keymoji", name: "Keymoji", frame: false, width: screenSize.width*0.22, height: screenSize.height*0.2, resizable: false, 'min-width': 480, 'min-height': 320, icon: __dirname + '/icon.ico'})
	fav = new BrowserWindow({title: "Keymoji", name: "Keymoji", frame: false, width: screenSize.width*0.22, height: screenSize.height*0.1, resizable: false, 'min-width': 480, 'min-height': 160, icon: __dirname + '/icon.ico'})
	win.loadURL(`file://${__dirname}/emoji.html`)
	win.hide()
	win.setVisibleOnAllWorkspaces(true)
	fav.loadURL(`file://${__dirname}/shortcuts.html`)
	fav.hide()
	fav.setVisibleOnAllWorkspaces(true)

	const ret = globalShortcut.register('CommandOrControl+Alt+E', () => {
		if (windowOpened)
		{
			win.hide()
			windowOpened = 0
			win.webContents.send('fetch-emojiresult')
			win.webContents.send('clear-emojiresult')
		}
		else
		{
			win.show()
			win.focus()
			windowOpened = 1
		}
	})

	function retFavCheck(numkey) {
		if (windowFavOpened)
		{
			if (numkey == favOpenedKey)
			{
				fav.hide()
				windowFavOpened = 0
			}
			else
			{
				favOpenedKey = numkey
				fav.webContents.send('numkey-updated', numkey)
			}
		}
		else
		{
			favOpenedKey = numkey
			fav.show()
			fav.focus()
			fav.webContents.send('numkey-pressed', numkey)
			windowFavOpened = 1
		}
	}

	const retFav0 = globalShortcut.register('Command+Control+Alt+0', () => {
		retFavCheck(0)
	})

	const retFav1 = globalShortcut.register('Command+Control+Alt+1', () => {
		retFavCheck(1)
	})

	const retFav2 = globalShortcut.register('Command+Control+Alt+2', () => {
		retFavCheck(2)
	})

	const retFav3 = globalShortcut.register('Command+Control+Alt+3', () => {
		retFavCheck(3)
	})

	const retFav4 = globalShortcut.register('Command+Control+Alt+4', () => {
		retFavCheck(4)
	})

	const retFav5 = globalShortcut.register('Command+Control+Alt+5', () => {
		retFavCheck(5)
	})

	const retFav6 = globalShortcut.register('Command+Control+Alt+6', () => {
		retFavCheck(6)
	})

	const retFav7 = globalShortcut.register('Command+Control+Alt+7', () => {
		retFavCheck(7)
	})

	const retFav8 = globalShortcut.register('Command+Control+Alt+8', () => {
		retFavCheck(8)
	})

	const retFav9 = globalShortcut.register('Command+Control+Alt+9', () => {
		retFavCheck(9)
	})

	win.on('blur', () => {
		win.hide()
		windowOpened = 0
		win.webContents.send('fetch-emojiresult')
		win.webContents.send('clear-emojiresult')
	})

	fav.on('blur', () => {
		closeFavWindow()
	})
})

app.on('will-quit', () => {
	globalShortcut.unregisterAll()
})
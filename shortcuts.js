var electron;

function init() {
	const electron = require('electron')
	const storage = require('electron-json-storage')
	const emoji = require('emoji-data')
	var emojiData = null;

	previouslySelectedItem = null;

	function updateEmojiFavView()
	{
		for (var i = 0; i < emojiData.length; i++)
		{
			const emojiImageElement = document.getElementById("row"+i).firstChild
			emojiImageElement.src="emojis/"+emojiData[i]+".svg";
			emojiImageElement.setAttribute('emoji', emoji.from_unified(emojiData[i]).render())
		}
	}

	storage.get('shortcut-emojis', function(error, data) {
		if (error) throw error;

		emojiData = data
		updateEmojiFavView()
	});

	function arraysEqual(arr1, arr2) {
	    if (arr1.length !== arr2.length)
	    {
	        return false;
	    }

	    for (var i = arr1.length; i--;)
	    {
	        if (arr1[i] !== arr2[i])
	        {
	            return false;
	        }
	    }

	    return true;
	}

	electron.ipcRenderer.on('numkey-pressed', (event, arg) => {
		storage.get('shortcut-emojis', function(error, data) {
			if (!arraysEqual(emojiData, data))
			{
				emojiData=data
				updateEmojiFavView()
			}
		});

		previouslySelectedItem = document.getElementById("row"+arg).firstChild
		previouslySelectedItem.style.backgroundColor = "grey"
	})

	electron.ipcRenderer.on('numkey-updated', (event, arg) => {
		previouslySelectedItem.style.backgroundColor = "white"
		previouslySelectedItem = document.getElementById("row"+arg).firstChild
		previouslySelectedItem.style.backgroundColor = "grey"
		electron.ipcRenderer.send('updated-fav-key', arg)
	})

	electron.ipcRenderer.on('clear-screen', (event, arg) => {
		const foundElementsToReset = document.getElementsByClassName("row")
		for (i = 0; i < foundElementsToReset.length; i++)
		{
			foundElementsToReset[i].firstChild.style.backgroundColor = "white"
		}
		electron.ipcRenderer.send('return-emojiresult', previouslySelectedItem.getAttribute('emoji'))
	})

	function checkKey(e) {
		e = e || window.event

		switch (e.keyCode)
		{
			case 13:
				electron.ipcRenderer.send('close-fav', previouslySelectedItem.getAttribute('emoji'))
				break
		}
	}

	document.onkeydown = checkKey
}

window.onload = init
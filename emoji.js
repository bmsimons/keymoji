var electron;
var itemCounter = 0
var emojiString = ""
var leftOffset = 1
var topOffset = 1
var keyboardNavigationEnabled = false
var storedEmojiInput = ""

function init() {
	electron = require('electron')
	document.getElementById("emojiinput").focus();

	electron.ipcRenderer.on('emoji-search-reply', (event, arg) => {
		const domObjects = document.getElementsByClassName("column")
		for (var i = 0; i < domObjects.length; i++) {
			if (arg[i]) {
				domObjects[i].innerHTML = "<img class=\"emoji\" src=\"emojis/" + arg[i][0].toLowerCase() + ".svg\" />"
				domObjects[i].setAttribute('emoji', arg[i][1])
				domObjects[i].onclick = function() { if (itemCounter < 10) { const currentHTML = document.getElementById("emojiresult").innerHTML; document.getElementById("emojiresult").innerHTML = currentHTML + this.innerHTML; document.getElementById("emojiinput").focus(); emojiString = emojiString + this.getAttribute('emoji'); itemCounter++ } }
			} else {
				domObjects[i].innerHTML = ""
			}
		}
	})

	electron.ipcRenderer.on('clear-emojiresult', (event, arg) => {
		document.getElementById("emojiresult").value = ""
		itemCounter = 0
		emojiString = ""
		document.getElementById("emojiresult").innerHTML = ""
	})

	electron.ipcRenderer.on('fetch-emojiresult', (event, arg) => {
		electron.ipcRenderer.send('return-emojiresult', emojiString)
	})

	function addCharacterToInput(c) {
		var oldElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset)
		if (oldElement.querySelector("img"))
		{
			oldElement.querySelector("img").style.backgroundColor = "white"
		}
		const emojiInputElement = document.getElementById("emojiinput")
		emojiInputElement.value = emojiInputElement.value + c
		electron.ipcRenderer.send('emoji-search', emojiInputElement.value)
		leftOffset = 1
		topOffset  = 1
		keyboardNavigationEnabled = false
	}

	function checkKey(e) {
		e = e || window.event

		switch (e.keyCode)
		{
			case 38:
				//Up
				if (topOffset > 1)
				{
					var oldElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img")
					var newElement = document.querySelector("div#column"+leftOffset+".column.row"+(topOffset-1)).querySelector("img")
					if (newElement)
					{
						topOffset = topOffset - 1
						oldElement.style.backgroundColor = "white"
						newElement.style.backgroundColor = "grey"
					}
				}
				break

			case 40:
				//Down
				if (topOffset == 1 && leftOffset == 1 && keyboardNavigationEnabled == false)
				{
					var oldElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img")
					if (oldElement)
					{
						oldElement.style.backgroundColor = "grey"
					}
					keyboardNavigationEnabled = true
				}
				else if (topOffset < 3)
				{
					var oldElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img")
					var newElement = document.querySelector("div#column"+leftOffset+".column.row"+(topOffset+1)).querySelector("img")
					if (newElement)
					{
						topOffset = topOffset + 1
						oldElement.style.backgroundColor = "white"
						newElement.style.backgroundColor = "grey"
					}
				}
				break

			case 37:
				//Left
				if (leftOffset > 1)
				{
					var oldElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img")
					var newElement = document.querySelector("div#column"+(leftOffset-1)+".column.row"+topOffset).querySelector("img")
					if (newElement)
					{
						leftOffset = leftOffset - 1
						oldElement.style.backgroundColor = "white"
						newElement.style.backgroundColor = "grey"
					}
				}
				break

			case 39:
				//Right
				if (leftOffset < 8)
				{
					var oldElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img")
					var newElement = document.querySelector("div#column"+(leftOffset+1)+".column.row"+topOffset).querySelector("img")
					if (newElement)
					{
						leftOffset = leftOffset + 1
						oldElement.style.backgroundColor = "white"
						newElement.style.backgroundColor = "grey"
					}
				}
				break

			case 13:
				//Enter
				if (itemCounter < 10)
				{
					var selectedElement = document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img")
					if (selectedElement)
					{
						const currentHTML = document.getElementById("emojiresult").innerHTML
						document.getElementById("emojiresult").innerHTML = currentHTML + selectedElement.outerHTML
						document.getElementById("emojiinput").focus()
						emojiString = emojiString + selectedElement.parentElement.getAttribute('emoji')
						itemCounter++
					}
				}
				break

			case 8:
				//Backspace
				if (document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img"))
				{
					document.querySelector("div#column"+leftOffset+".column.row"+topOffset).querySelector("img").style.backgroundColor = "white"
				}
				const emojiInputElement = document.getElementById("emojiinput")
				emojiInputElement.value = emojiInputElement.value.substring(0, emojiInputElement.value.length - 1)
				electron.ipcRenderer.send('emoji-search', emojiInputElement.value)
				leftOffset = 1
				topOffset  = 1
				keyboardNavigationEnabled = false
				break

			case 65:
				//a
				addCharacterToInput("a")
				break

			case 66:
				//b
				addCharacterToInput("b")
				break

			case 67:
				//c
				addCharacterToInput("c")
				break

			case 68:
				//d
				addCharacterToInput("d")
				break

			case 69:
				//e
				addCharacterToInput("e")
				break

			case 70:
				//f
				addCharacterToInput("f")
				break

			case 71:
				//g
				addCharacterToInput("g")
				break

			case 72:
				//h
				addCharacterToInput("h")
				break

			case 73:
				//i
				addCharacterToInput("i")
				break

			case 74:
				//j
				addCharacterToInput("j")
				break

			case 75:
				//k
				addCharacterToInput("k")
				break

			case 76:
				//l
				addCharacterToInput("l")
				break

			case 77:
				//m
				addCharacterToInput("m")
				break

			case 78:
				//n
				addCharacterToInput("n")
				break

			case 79:
				//o
				addCharacterToInput("o")
				break

			case 80:
				//p
				addCharacterToInput("p")
				break

			case 81:
				//q
				addCharacterToInput("q")
				break

			case 82:
				//r
				addCharacterToInput("r")
				break

			case 83:
				//s
				addCharacterToInput("s")
				break

			case 84:
				//t
				addCharacterToInput("t")
				break

			case 85:
				//u
				addCharacterToInput("u")
				break

			case 86:
				//v
				addCharacterToInput("v")
				break

			case 87:
				//w
				addCharacterToInput("w")
				break

			case 88:
				//x
				addCharacterToInput("x")
				break

			case 89:
				//y
				addCharacterToInput("y")
				break

			case 90:
				//z
				addCharacterToInput("z")
				break
		}
	}

	document.onkeydown = checkKey
}

window.onload = init;

//function onInputChange(value) {
//	electron.ipcRenderer.send('emoji-search', value)
//}
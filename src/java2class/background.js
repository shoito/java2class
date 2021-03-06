function getItem(key) { return getStorage().getItem(key); }
function setItem(key, map) { return getStorage().setItem(key, map); }
function removeItem(key) { return getStorage().removeItem(key); }
function getStorage() { return window.localStorage; }

function loadModifiers(json) {
    var showPublic = localStorage["showPublic"];
    var showProtected = localStorage["showProtected"];
    var showNone = localStorage["showNone"];
    var showPrivate = localStorage["showPrivate"];
    
    if (showPublic === undefined || showProtected === undefined
            || showNone === undefined || showPrivate === undefined) {
        showPublic = "true";
        showProtected = showNone = showPrivate = "false";
    }
    
	var showModifiers = json["showModifiers"] = {};
	showModifiers["showPublic"] = showPublic;
	showModifiers["showProtected"] = showProtected;
	showModifiers["showNone"] = showNone;
	showModifiers["showPrivate"] = showPrivate;
}

function getClassInfo(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var json = JSON.parse(xhr.responseText)
				loadModifiers(json);
				callback(json);
			} else {
				callback('false');
			}
		}
	}

	xhr.open('GET', 'http://japarser.appspot.com/src?url=' + url, true);
	//xhr.open('GET', 'http://localhost:8888/src/?url=' + url, true);
	xhr.send(null);
	return xhr;
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	switch (request.action) {
	case 'isRunning':
        if (getItem('isRunning') === 'true') {
            var json = {};
            loadModifiers(json);
            callback(json);
        } else {
            callback('false');
        }
        break;
	case 'getClassInfo':
		if (getItem('isRunning') === 'true') {
			getClassInfo(sender.tab.url, callback);
		} else {
			callback('false');
		}
		break;
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	if (getItem('isRunning') !== 'true') {
		setItem('isRunning', 'true');
		chrome.browserAction.setBadgeText({
			text : "on"
		});
	} else {
		setItem('isRunning', 'false');
		chrome.browserAction.setBadgeText({
			text : "off"
		})
	}
	chrome.tabs.executeScript(tab.id, {
		code : "location.reload();"
	});
});

(function() {
	if (getItem('isRunning') !== 'true') {
		chrome.browserAction.setBadgeText({
			text : "off"
		});
	} else {
		chrome.browserAction.setBadgeText({
			text : "on"
		})
	}
})();
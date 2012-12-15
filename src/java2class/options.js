function saveOptions() {
	saveToLocalStorage();
	
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

function saveToLocalStorage() {
    localStorage["showPublic"] = document.getElementById("public").checked + "";
    localStorage["showProtected"] = document.getElementById("protected").checked + "";
    localStorage["showNone"] = document.getElementById("none").checked + "";
    localStorage["showPrivate"] = document.getElementById("private").checked + "";
}

function restoreOptions() {
	var showPublic = localStorage["showPublic"];
	var showProtected = localStorage["showProtected"];
	var showNone = localStorage["showNone"];
	var showPrivate = localStorage["showPrivate"];
	
    if (showPublic === undefined || showProtected === undefined
            || showNone === undefined || showPrivate === undefined) {
    	showPublic = "true";
    	showProtected = showNone = showPrivate = "false";
    }
	
	document.getElementById("public").checked = (showPublic == "true");
	document.getElementById("protected").checked = (showProtected == "true");
	document.getElementById("none").checked = (showNone == "true");
	document.getElementById("private").checked = (showPrivate == "true");
	
    saveToLocalStorage();
}

(function() {
	restoreOptions();
	
	document.getElementById("saveButton").addEventListener("click", saveOptions);
})();
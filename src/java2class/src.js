(function() {
	execute();

	function clearClass() {
		cv = document.getElementById("classView");
		if (cv) {
			cv.parentElement.removeChild(cv);
		}
	}

	function execute() {
		chrome.extension.sendRequest({'action' : 'getClassInfo'},
			function(response) {
				if (response === null || response === '' || response === 'false') {
					return;
				}
		
				(function() {
					var _document = document;
					
					var classInfo = response;
					var classView = _document.createElement('div');
					classView.id = 'classView';
					classView.setAttribute('style', 'font-size: 12px; line-height: 1.2em; z-index: 100; top:10px; right:10px; border: 1px solid; opacity: 0.8; box-shadow:0 0 3px #000; background-color:#fff; overflow: auto; max-height: 600px; max-width: 360px; position:fixed;');
					classView.innerHTML = buildHtml(classInfo.name, extractFields(classInfo), extractMethods(classInfo));//extractMethods(classInfo.methods));
					//classView.innerHTML = Japarser.generateImage(classInfo, false, 'dir:lr');

					if (classInfo.name != '') {
						_document.body.appendChild(classView);
					}
				})();
		
				function extractFields(classInfo) {
					var ret = [];
					try {
						var fields = classInfo.fields;
						for (var i = 0; i < fields.length; i++) {
							var line = fields[i].line;
							line = correctLine(line);
							var modifiers = fields[i].modifiersName;
			
							var fieldType = fields[i].simpleTypeName;
							var fieldName = fields[i].name;
							var modifier = '   ';
							if (modifiers.indexOf('public') > -1) {
								if (classInfo.showModifiers.showPublic != 'true') continue;
								modifier = ' + ';
							} else if (modifiers.indexOf('protected') > -1) {
								if (classInfo.showModifiers.showProtected != 'true') continue;
								modifier = ' # ';
							} else if (modifiers.indexOf('private') > -1) {
								if (classInfo.showModifiers.showPrivate != 'true') continue;
								modifier = ' - ';
							} else {
								if (classInfo.showModifiers.showNone != 'true') continue;
							}

							if (modifiers.indexOf('static') > -1) {
								ret[i] = ['<u>', modifier, '<a href=#', line, ' style="color: #000; text-decoration: none;">', fieldName, '</a>', ' : ', fieldType, '</u>'].join('');
							} else {
								ret[i] = [modifier, '<a href=#', line, ' style="color: #000; text-decoration: none;">', fieldName, '</a>', ' : ', fieldType].join('');
							}
						}
					} catch (e) { console.error(e); }
					
					return ret;
				}
				
				function extractMethods(classInfo) {
					var ret = [];
					try {
						var methods = classInfo.methods;
						for (var i = 0; i < methods.length; i++) {
							var line = methods[i].line;
							line = correctLine(line);
							var modifiers = methods[i].modifiersName;
							var returnName = methods[i].returnName;
							var paramName = methods[i].paramName;
							var methodName = methods[i].name;
							
						    var methodNameWithParams = methodName + '(' + paramName + ')';
							var modifier = '   ';
							if (modifiers.indexOf('public') > -1) {
								if (classInfo.showModifiers.showPublic != 'true') continue;
								modifier = ' + ';
							} else if (modifiers.indexOf('protected') > -1) {
								if (classInfo.showModifiers.showProtected != 'true') continue;
								modifier = ' # ';
							} else if (modifiers.indexOf('private') > -1) {
								if (classInfo.showModifiers.showPrivate != 'true') continue;
								modifier = ' - ';
							} else {
								if (classInfo.showModifiers.showNone != 'true') continue;
							}
							
							if (modifiers.indexOf('static') > -1) {
								ret[i] = ['<u>', modifier,  '<a href=#', line, ' style="color: #000; text-decoration: none;">', methodNameWithParams, '</a>', ' : ', returnName, '</u>'].join('');
							} else {
								ret[i] = [modifier,  '<a href=#', line, ' style="color: #000; text-decoration: none;">', methodNameWithParams, '</a>', ' : ', returnName].join('');
							}
						}
					} catch (e) { console.error(e); }
					
					return ret;
				}

				function correctLine(line) {
					var hostname = window.location.hostname;
					if (hostname === "github.com") {
						return "L" + line;
					} else if (hostname === "bitbucket.org") {
						return "cl-" + line;
					}
					return line;
				}
				
				function buildHtml(className, fields, methods) {
					return ['<h4 style="margin: 4px 0; padding: 0 6px; font-size: 1em;">', 
					        '<a href="#0" style="color: #000; text-decoration: none;">', className, '</a>', 
					        '</h4>', 
					        '<hr style="margin: 3px 0;">', 
					        '<div style="padding: 0 6px;">', fields.join('<p style="margin-top: 0; margin-bottom: 0;">'), '</div>', 
					        '<hr style="margin: 3px 0;">', 
					        '<div style="padding: 0 6px;">',  methods.join('<p style="margin-top: 0; margin-bottom: 0;">'), '</div>'
					        ].join('');
				}
			}
		);
	}

	function pjaxClickHandler(event) {
		if (event.target.nodeName === "A" || event.target.nodeName === "SPAN") {
			clearClass();
			if (/\.java/.test(event.target.innerText)) {
				execute();
			}
		}
	}
	
	window.addEventListener("click", function(event) {
		if (window.location.hostname === "github.com") {
			pjaxClickHandler(event);
		}
	});
	
	document.addEventListener("click", function(event) {
		if (window.location.hostname === "bitbucket.org") {
			pjaxClickHandler(event);
		}
	});
})();
(function() {
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
				classView.setAttribute('style', 'font-size: xx-small; z-index: 100; top:10px; right:10px; border: 1px solid; opacity: 0.8; box-shadow:0 0 3px #000; background-color:#fff; overflow: auto; max-height: 600px; max-width: 360px; position:fixed;');
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
				} catch (e) { console.log(e); }
				
				return ret;
			}
			
			function extractMethods(classInfo) {
				var ret = [];
				try {
					var methods = classInfo.methods;
					for (var i = 0; i < methods.length; i++) {
						var line = methods[i].line;
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
				} catch (e) { console.log(e); }
				
				return ret;
			}
			
			function buildHtml(className, fields, methods) {
				return ['<h4 style="padding: 0 6px; margin: 3px 0">', 
				        '<a href="#0" style="color: #000; text-decoration: none;">', className, '</a>', 
				        '</h4>', 
				        '<hr>', 
				        '<div style="padding: 0px 6px 4px 6px;">', fields.join('<p style="margin-top: 0; margin-bottom: 0;">'), '</div>', 
				        '<hr>', 
				        '<div style="padding: 0px 6px 4px 6px;">',  methods.join('<p style="margin-top: 0; margin-bottom: 0;">'), '</div>'
				        ].join('');
			}
		}
	);
})();
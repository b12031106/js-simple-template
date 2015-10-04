(function(window, document) {

	"use strict";

	var _templates = {};

	var _textNodeToElement = function(textNode) {
		var tmpNode = document.implementation.createHTMLDocument();
		tmpNode.body.innerHTML = textNode.nodeValue;
		return tmpNode.body.children[0];
	};

	var _isArray = function(object) {
		return (Object.prototype.toString.call(object) === '[object Array]');
	};

	var _parse = function(scriptElement) {
		var templateName,
			childNodes,
			tmpNode,
			refNodes,
			refs = {};

		templateName = scriptElement.getAttribute('data-name');

		if (templateName === null) {
			console.warning('template name missing.');
			return null;
		}

		childNodes = scriptElement.childNodes;

		if (childNodes.length <= 0) {
			console.warning('child node not found.')
			return null;
		}

		tmpNode = _textNodeToElement(childNodes[0]);
		refNodes = tmpNode.querySelectorAll('[refs]');

		for (var i = 0, len = refNodes.length; i < len; i += 1) {
			var refNode = refNodes[i];
			var refName = refNode.getAttribute('refs');

			if (refName === null) {
				console.warning('has refs attribute but no value.');
				continue;
			}

			refs[refName] = refNode;
		}

		_templates[templateName] = scriptElement;

		return {
			name: templateName,
			element: tmpNode,
			refs: refs
		};
	};

	window.SimpleTemplate = {

		get: function(templateName) {
			if (typeof _templates[templateName] === 'undefined' && !this.scan(templateName)) {
				return null;
			}
			return _parse(_templates[templateName]);
		},

		list: function() {
			return Object.keys(_templates);
		},

		scan: function() {
			var scriptElements = document.querySelectorAll('script[type="js-simple-template"]');
			for (var i = 0, len = scriptElements.length; i < len; i += 1) {
				var scriptElement = scriptElements[i];
				if (scriptElement.hasAttribute('scaned')) {
					console.warning('template already scaned');
					continue;
				}
				_parse(scriptElement);
			}
		}

	};
	
}(window, document));
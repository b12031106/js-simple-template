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
			return null;
		}

		childNodes = scriptElement.childNodes;

		if (childNodes.length <= 0) {
			return null;
		}

		tmpNode = _textNodeToElement(childNodes[0]);
		refNodes = tmpNode.querySelectorAll('[refs]');

		for (var i = 0, len = refNodes.length; i < len; i += 1) {
			var refNode = refNodes[i];
			var refName = refNode.getAttribute('refs');

			if (refName === null) {
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
			if (typeof _templates[templateName] === 'undefined') {
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
					continue;
				} else {
					scriptElement.setAttribute('scaned', '1');
				}
				_parse(scriptElement);
			}
		}

	};
	
}(window, document));
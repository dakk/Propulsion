var showContent = function(id) {
	jQuery('.contentContainer').hide();
	jQuery(id).show();
};

(function($) {
	var replaceDots = function(str) {
		return str.replace(/\./g, '_');
	};

	var getId = function(str) {
		return 'DOC_' + replaceDots(str);
	};

	var hideAll = function(contentList) {
		contentList.forEach(function($content) {
			$content.hide();
		});
	};

	var showAll = function(contentList) {
		contentList.forEach(function($content) {
			$content.show();
		});
	};

	var parseText = function(text) {
		var match,
			re = /\#.*?\#.*?\#/g;

		while (true) {
			match = re.exec(text);
			if (match === null) {
				break;
			}

			var url = match[0].split('#'),
				address = url[1],
				linkText = url[2];

			var attribute = '';
			if (address.indexOf('://') !== -1) {
				attribute = 'href="' + address + '"';
			} else {
				attribute = 'onclick="showContent(\'#' + getId(address) + '\')"';
			}

			text = text.substr(0, match.index) + '<a ' + attribute + '>' + linkText + '</a>' + text.substr(match.index + match[0].length);
		}

		return text;
	};

	$pageTitle = $('title');

	var lookup = {};

	var recursive = function(obj, path, $menuParent, $contentParent, contentList) {
		var value, $li, $ul, $menu_title, $a, id, $content, thisPath, innerContentList, subcontent, parametersList,
			usageStr, i, parameterObj, $parametersBox;
		innerContentList = [];
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (path === '') {
					thisPath = key;
				} else {
					thisPath = path + '.' + key
				}
				value = obj[key];
				$li = $('<li/>');
				$a = $('<a/>');
				if (value.type === undefined) {
					$ul = $('<ul/>');
					$menu_title = $('<div/>', {
						'class': 'menu_title'
					});
					$a.html(key);
					$menu_title.append($a);
					$li.append($menu_title);
					$li.append($ul);
					subcontent = recursive(value, thisPath, $ul, $contentParent, contentList);
					innerContentList = innerContentList.concat(subcontent);
					lookup[thisPath] = subcontent;
					(function(subcontent, thisPath) {
						$a.click(function() {
							hideAll(contentList);
							showAll(subcontent);
							$pageTitle.html(thisPath);
						});
					}(subcontent, thisPath));
				} else {
					$li.addClass('item');
					$a.html(key);
					$li.append($a);
					$contentTitle = $('<div/>', {
						'class': 'title'
					});
					$contentTitle.html(thisPath);
					$usage = $('<div/>', {
						'class': 'usage'
					});

					id = getId(thisPath);
					$content = $('<div/>', {
						'id': id,
						'class': 'contentContainer'
					});
					contentList.push($content);
					innerContentList.push($content);
					lookup[thisPath] = [$content];

					(function($content, thisPath) {
						$a.click(function() {
							hideAll(contentList);
							$content.show();
							$pageTitle.html(thisPath);
						});
					}($content, thisPath));

					usageStr = thisPath;
					if (value.type === 'function') {
						usageStr += '(';
						parametersList = value.parameters;
						if (parametersList !== undefined) {
							$parametersBox = $('<table class="parameters"><thead><tr><td>Name</td><td>Type</td><td>Description</td></tr></thead></table>');
							for (i = 0; i < parametersList.length; i++) {
								parameterObj = parametersList[i];
								usageStr += parameterObj.name;
								if (i !== parametersList.length - 1) {
									usageStr += ', ';
								}
								$parametersBox.append($('<tr><td>'+parameterObj.name+'</td><td>'+parameterObj.type+'</td><td>'+parameterObj.description+'</td></tr>'));
							}
						}
						usageStr += ')';
					} else if (value.type === 'property') {
						
					}

					$usage.html(usageStr);

					$description = $('<div/>', {
						'class': 'description'
					});

					$description.html(parseText(value.description));
					$content.append($contentTitle);
					$content.append($usage);
					if (value.type === "function" && value.parameters) {
						$content.append($parametersBox);
					}
					$content.append($description);
					$contentParent.append($content);
				}
				$menuParent.append($li);
			}
		}

		return innerContentList;
	};

	$menu_ul = $('<ul/>');
	var contentList = [];
	recursive(doc, '', $menu_ul, $('#content'), contentList);
	$('#menu').append($menu_ul);

	$quicksearch = $('#quicksearch')
	$quicksearch.keyup(function() {
		var difference,
			title,
			minKey = null,
			result = [],
			value = $quicksearch.val();
		for (key in lookup) {
			if (lookup.hasOwnProperty(key)) {
				difference = key.length - value.length;
				if (difference >= 0) {
					if (key.indexOf(value) === 0) {
						result = result.concat(lookup[key]);
						minKey = key;
					}
				}
			}
		}

		if (value === '') {
			title = 'Propulsion Documentation';
		} else {
			title = 'Quick search - ' + value;
		}

		if (result.length !== 0) {
			hideAll(contentList);
			showAll(result);
			if (result.length === 1) {
				title = minKey;
			}
		}

		$pageTitle.html(title);
	});

	var defaultQuickSearch = 'Quick search';
	$quicksearch.val(defaultQuickSearch);

	$quicksearch.focusout(function() {
		if ($quicksearch.val() === '') {
			$quicksearch.val(defaultQuickSearch);
		}
		$quicksearch.removeClass('qsactive');
	});

	$quicksearch.focusin(function() {
		if ($quicksearch.val() === defaultQuickSearch) {
			$quicksearch.val('');
		}
		$quicksearch.addClass('qsactive');
	});
}(jQuery));
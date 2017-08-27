function format_date_from_php(date_in_seconds) {
	var date_in_milliseconds = date_in_seconds * 1000;  // php uses seconds; javascript uses milliseconds
	var date_obj = new Date(date_in_milliseconds);
	var month = date_obj.getMonth()+1;
	var date_format = date_obj.getFullYear() + '-' + month + '-' + date_obj.getDate();

	return date_format;
}
function format_date_from_javascript(date_obj) {
	var month = date_obj.getMonth()+1;
	return date_obj.getFullYear() + '-' + month + '-' + date_obj.getDate();
}

function sort_keys(associative_array, use_numeric) {
	var keys = new Array();
	for(var k in associative_array) {
		keys.push(k);
	}
	if (use_numeric)
		keys.sort( function (a, b){ a=parseFloat(a); b=parseFloat(b); return (a > b) - (a < b);} );
	else
		keys.sort( function (a, b){ return (a > b) - (a < b);} );

	return keys;
}

function write_select(label, name, id, options, selected, show_blank, values) {
	var html = '<div data-role="fieldcontain">'+
		'<label for="select-choice-1" class="select">' + label + ':</label>' +
		'<select name="' + name + '" id="' + id + '">';


	if (show_blank) {
		if (selected < 0)
			html += '<option value="0" selected></option>';
		else
			html += '<option value="0"></option>';
	}

	for (var i=0; i<options.length; i++) {
		var option = options[i];
		var value = option;
		if (values)
			value = values[i];
			if (i == selected)
				html += '<option value="' + option + '" selected>' + value + '</option>';
			else
				html += '<option value="' + option + '">' + value + '</option>';
	}

	html += '</select></div>';
	return html;
}



var MyAppRouter;

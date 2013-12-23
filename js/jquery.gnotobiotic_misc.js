/*
	TO DO:

	DONE:
*/
//

// create closure
(function($) { // alias jQuery to name $
	// shared plugin variables	

	// BEGIN PLUGIN DEFINIATION
	$.fn.gnotobiotic_misc = function(options, $selector) {
		// MAIN FUNCTION, ITERATE OVER SUBMITTED OPTIONS FOR "each" DOM ELEMENT
		return this.each(function() {
                        var MOUSE = {
                                url : 'mouse.php',
                                pane_id : this.id
                        };

			var $pane = $(this);

			if (options && options.show == "home")
				help_pane($pane, MOUSE);
			else if (options && options.show == "morgue")
				init_morgue($pane, MOUSE);
			else
				init_misc($pane, MOUSE);

			debug('here in misc');
		});
			

		/* PRIVATE FUNCTIONS */

		// private function for debugging
		function debug(text) {
			if (window.console && window.console.log)
				window.console.log(text);
  		}

                function help_pane($pane, MOUSE) {
                        html ='Welcome to the Gnotobiotic mouse breeder database.  Use the buttons on the bottom of the page to navigate.' +
                                '<h3>Instructions</h3>' +
                                '<div data-role="collapsible-set">'+
                                        '<div data-role="collapsible" data-collapsed="true">' +
                                        '<h3>Update</h3>' +
                                        '<p>add/change information about your mice, cages, and isolators.</p>'+
                                        '</div>' +
                                        '<div data-role="collapsible" data-collapsed="true">'+
                                        '<h3>Ready</h3>'+
                                        '<p>look for mice that match a set criterion for an experiment you want to perform</p>'+
                                        '</div>'+
                                        '<div data-role="collapsible" data-collapsed="true">'+
                                        '<h3>To Do</h3>'+
                                        '<p>lists mice need to be weaned and breeders that are due to deliver</p>'+
                                        '</div>'+
                                '</div>';
                        $pane.html(html).trigger('create');
                }


		function init_morgue($pane, MOUSE) {
			var message_pane = 'morgue_messages';
			var html='<h2>Morgue</h2><div id="' + message_pane + '"></div>';
		
			var url = MOUSE.url + "?morgue=1";
			var sex_to_short = {undetermined:'?',male:'M',female:'F'};
			
			$.getJSON(url, function(results) {
				html += '<table>';
				html += '<tr><th>Id</th><th>Sex</th><th>Birth-date</th><th>Death-date</th><th>Type</th><th>Strain</th><th>Genotype<th><th>Isolator</th><th>&nbsp;</th></tr>';
				for (var i=0; i<results.length; i++) {
					var row_id = 'morgueRow_' + results[i][0];
					html += '<tr id="' + row_id + '">';
					html += '<td>' + results[i][0] + '</td><td>' + sex_to_short[results[i][1]] + '</td><td>' + results[i][2] + '</td>';
					html += '<td align=center>' + results[i][4] + '</td><td>' + results[i][6] + '</td><td>' + results[i][7] + '</td>';
					html += '<td align="center">' + results[i][8] + '</td><td>';
					html += '<td>' + results[i][10] + '</td>';
					html += '<td><a class="revive_mouse" id="' + results[i][0]  + '" title=' + results[i][10] +  ' href="#">revive</a></td>';
					html += '</tr>';

				}
				html += '</table>';


				$pane.html(html).trigger('create');
				$('.revive_mouse').click(function() {
					var mouse_id = this.id;
					var isolator_id = this.title;
					debug('reviving mouse ' + mouse_id);
					var url_revive = MOUSE.url + "?revive_mouse=1&mouse_id=" + mouse_id;
					$.getJSON(url_revive, function(results) {
						$('#' + message_pane).html('<b>Status:</b> mouse <i>' + mouse_id + '</i> has been revived and can now be found in isolator ' + isolator_id + '<br />').trigger('create');
						$('#morgueRow_' + mouse_id).hide();
					});

					//edit_mouse($pane, MOUSE, cage_id, isolator_id, mouse_id);

				});
			});

		}
		
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
		/* MISC PANE */
		function init_misc($pane, MOUSE) {
			var html = '<h3>Miscellaneous tools</h3>';
			html += '<a data-ajax=false data-role="button" href="mouse.php?qr_codes=1">Print isolator barcodes</a>';
			var morgue_button = 'morgue_button';
			html += '<a id="' + morgue_button  + '" title="morgue_button" href="#misc/morgue" data-role="button">Morgue</a>';
			$pane.html(html).trigger('create');
			if (MOUSE.callback) {
				MOUSE.callback();
				MOUSE.callback = undefined;
			}
//			$('#' + morgue_button).click(function() {
//				debug('going to morgue');
//				init_morgue($pane, MOUSE);
//			});


		}
	}
})(jQuery);

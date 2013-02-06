/*
	TO DO:
	

	DONE:
*/

// create closure
(function($) { // alias jQuery to name $
	// shared plugin variables	

	// BEGIN PLUGIN DEFINIATION
	$.fn.gnotobiotic_todo = function(options, $selector) {
		// MAIN FUNCTION, ITERATE OVER SUBMITTED OPTIONS FOR "each" DOM ELEMENT
		return this.each(function() {
			var $pane = $(this);
			var MOUSE = {
				url : 'mouse.php',
				pane_id : this.id
			};
			init_mousetodo($pane, MOUSE);
		});

		/* PRIVATE FUNCTIONS */

		// private function for debugging
		function debug(text) {
			if (window.console && window.console.log)
				window.console.log(text);
  		};


		/* TO DO PAGE */

		// set up the basic interface and all of the controls
		function init_mousetodo($pane, MOUSE) {
			var html = '';
			var url = MOUSE.url + "?to_do=1";
			var have_wean = 0;
			var have_litter = 0;
			$.getJSON(url, function(result) {
				var days_to_wean = 28;
				var days_to_show = 7;
				var days_to_show_litter = 7;
				html += '<h2>Mice to wean</h2>';
		        	html += '<div data-role="fieldcontain">' + 
					'<label for="slider">Days after birth to wean: </label>' + 
			 		'<input type="range" name="days_to_wean" id="days_to_wean" value="' + days_to_wean + '" min="10" max="40"  />' + 
				'</div>';
		        	html += '<div data-role="fieldcontain">' + 
					'<label for="slider">Limit to the next N days: </label>' + 
			 		'<input type="range" name="days_to_observe" id="days_to_observe" value="' + days_to_show + '" min="0" max="40"  />' + 
				'</div>';

				html += '<div id="wean_table"></div>';
				html += '<h2>Breeder cages due for litter</h2>';
		        	html += '<div data-role="fieldcontain">' + 
					'<label for="slider">Limit to the next N days: </label>' + 
			 		'<input type="range" name="days_to_observe_litter" id="days_to_observe_litter" value="' + days_to_show_litter + '" min="0" max="40"  />' + 
				'</div>';
				html += '<div id="breeder_table"></div>';
				$pane.html(html).trigger('create');


				if (result.not_weaned && result.not_weaned.length) {
					have_wean=1;
					show_wean_table(days_to_wean, days_to_show, result.not_weaned, $('#wean_table'));
				}
				if (result.litter_due && result.litter_due.length) {
					have_litter=1;
					show_litter_due_table(days_to_show_litter, result.litter_due, $('#breeder_table'));
				}


                                $('#days_to_wean').change(function(e,passed) {
                                        days_to_wean = $('#days_to_wean').val();

					if (have_wean)
						show_wean_table(days_to_wean, days_to_show, result.not_weaned, $('#wean_table'));
                                });
                                $('#days_to_observe').change(function(e,passed) {
                                        days_to_show = $('#days_to_observe').val();

					if (have_wean)
						show_wean_table(days_to_wean, days_to_show, result.not_weaned, $('#wean_table'));
                                });
                                $('#days_to_observe_litter').change(function(e,passed) {
                                        days_to_show_litter = $('#days_to_observe_litter').val();

					if (have_litter)
						show_litter_due_table(days_to_show_litter, result.litter_due, $('#breeder_table'));
                                });


			});
//			$pane.html('to do page').trigger('create');
		}
		function show_litter_due_table(days_to_show_litter, litter_due, $pane) {
			var now = new Date();
			var days_from_now = now.getTime() + days_to_show_litter*24*60*60*1000;
			var now_milliseconds = now.getTime();

			var days_to_hide = now.getTime() - 30*24*60*60*1000; // don't show things more than 30 days ago
			var days_between_litters = 19*24*60*60*1000;
			var html = '<table>' + 
				'<tr><th>cage id</th><th>isolator id</th><th>expected-litter</th><th>Days until birth</th><tr>';
			for (var i=0; i<litter_due.length; i++) {
				var last_birth = litter_due[i][0]*1000;
				var next_birth = litter_due[i][0]*1000 + days_between_litters;
				var last_birth_ = new Date(last_birth);
				var birth_date = new Date(next_birth);
				var month = birth_date.getMonth()+1;
				var date_ = birth_date.getDate();
				var birth_format = birth_date.getFullYear() + '-' + month + '-' + date_;

				var target_days_from_now = (next_birth - now_milliseconds)/1000/60/60/24;
				target_days_from_now = target_days_from_now.toFixed(1);

//				if (next_birth < now.getTime())  {
				if (next_birth < days_from_now && next_birth > days_to_hide)  {
					html += '<tr><td>' + litter_due[i][1] + '</td><td>' + litter_due[i][2];

					if (next_birth < now.getTime()) 
						html += '</td><td class="highlight">'+birth_format + '</td>';
					else
						html += '</td><td>'+birth_format + '</td>';

					if (target_days_from_now > 0)
						html += '</td><td>' + target_days_from_now + '</td></tr>';
					else
						html += '</td><td class="highlight">' + target_days_from_now + '</td></tr>';
			//			html += '</td><td>'+birth_format + '|' + last_birth_.toString() + '</td></tr>';
				}
			}
			html += "</table>";
			$pane.html(html).trigger('create');

		}
		function show_wean_table(days_to_wean, days_to_show, not_weaned, $pane) {
			var html = '<table>' + 
				'<tr><th>mouse id</th><th>cage id</th><th>isolator id</th><th>birth-date</th><th>Age (wks)</th><th>wean date</th><th>days until wean</th><tr>';
		
			var now = new Date();
			var days_from_now = now.getTime() + days_to_show*24*60*60*1000;
			var now_milliseconds = now.getTime();
			var num_added = 0;

			for (var i=0; i<not_weaned.length; i++) {
				var birth = not_weaned[i][3]*1000;
				var wean = (birth) + (days_to_wean * 24 * 60 * 60 * 1000);
				
				var birth_date = new Date(birth);
				var wean_date = new Date(wean);
				var age_in_weeks = (now_milliseconds - birth) / 1000 / 60 / 60 / 24 / 7;
				age_in_weeks = age_in_weeks.toFixed(1);

				var target_days_from_now = (wean - now_milliseconds)/1000/60/60/24;
				target_days_from_now = target_days_from_now.toFixed(1);
				if (wean <= days_from_now) {
//					var wean_date = new Date(wean_version);
//					var wean_date = new Date(not_weaned[i][3]*1000); // php stores time in seconds; javascript uses milliseconds
//					debug('have date ' + original + ' and ' + wean_);
//					var month = wean_date.getMonth()+1;
//					var date_ = wean_date.getDate();
//					if (month<10)
//						month = '0'+month;
//					if (date_<10)
//						date_ = '0'+date_;
	
//					var wean_format = wean_date.getFullYear() + '-' + month + '-' + date_;
					html += '<tr><td>' + not_weaned[i][0] + '</td><td>' + not_weaned[i][1] + '</td><td>' + 
						not_weaned[i][2] + '</td><td>' + format_date_from_javascript(birth_date) + '</td><td>' + age_in_weeks;
					
					if (wean < now.getTime()) 
						html += '</td><td class="highlight">'+format_date_from_javascript(wean_date);
					else
						html += '</td><td>'+format_date_from_javascript(wean_date);

					html += '</td><td>' + target_days_from_now + '</td></tr>';

					num_added++;
				}
			}
			html += '</table>';

			if (!num_added)
				html = '<p><i>No mice need to be weaned ' + '(i.e., reach ' + days_to_wean + ' days of age) in the next ' + days_to_show + ' days.</i></p>';

			$pane.html(html).trigger('create');
		}

	}
})(jQuery);

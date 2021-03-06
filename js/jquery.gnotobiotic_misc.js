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
			else if (options && options.show == "strains")
				init_strains($pane, MOUSE);
			else if (options && options.show == "genotypes")
				init_genotypes($pane, MOUSE);
			else if (options && options.show == "stats")
				init_stats($pane, MOUSE);
			else if (options && options.show == "breeder")
				init_breeder_stats($pane, MOUSE);
			else if (options && options.show == "born")
				init_just_born($pane, MOUSE);
			else if (options && options.show == "types")
				init_assignable($pane, MOUSE);
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
		function init_just_born($pane, MOUSE) {
			var message_pane = 'born_messages';
			var url = MOUSE.url + "?just_born=1";
			$.getJSON(url, function(results) {
				var html='<h2>Just Born</h2><div id="' + message_pane + '"></div>';
				html += '<table>';

				var mice = results.mice;

				html += '<tr><td><b>Id</b></td><td><b>Age (days)</b></td><td><b>Strain</b></td><td><b>Genotype</b></td><th>Isolator</th></tr>';
				for (var i=0; i<mice.length; i++) {
					html += '<tr><td>' + mice[i][0] + '</td><td>' + mice[i][1] + '</td><td>' + mice[i][2] + '</td><td>' + mice[i][3] + '</td><td>' + mice[i][4] +  '</td></tr>';
				}

				html += '</table>';
				$pane.html(html).trigger('create');
			});
		}
		function init_breeder_stats($pane, MOUSE) {
			var url = MOUSE.url + "?get_breeder_stats=1";
			var message_pane = 'stats_messages';
			$.getJSON(url, function(results) {
				var html='<h2>Breeder Statistics</h2><div id="' + message_pane + '"></div>';
				html += '<table>';

				var b = results.breeders;
				var p = results.progeny;
				for (var i=0; i<b.length; i++) {
					var mouse_id = b[i][0];
					html += '<tr><th>Mouse ID</th><th>Isolator</th><th>Age (wks)</th><th>strain</th><th>genotype</th></tr>';
					html += '<tr><td>' + mouse_id + "</td><td>" + b[i][2] + "</td><td>" + b[i][3] + "</td><td>" + b[i][4] + "</td><td>" + b[i][5] + "</td></tr>";

					if (p[mouse_id] && p[mouse_id].length) {
						html += "<tr><td>&nbsp;</td><td><i>weeks ago</i></td><td><i>born</i></td><td><i>survived</i></td><td>&nbsp;</td></tr>";
						var res = p[mouse_id];
						for (var j=0; j<res.length; j++) {
							html += "<tr><td>&nbsp;</td><td>" + res[j][0] + "</td><td>" + res[j][1] + "</td><td>" + res[j][2] + "</td><td>&nbsp;</td></tr>";
						}
					}
//"</td></tr>"; html += '<tr><td>' + b[i][0] + "</td><td>" + b[i][2] + "</td></tr>";
				}
//				html += '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';

				html += '</table>';

				$pane.html(html).trigger('create');

			});

		}
		function init_stats($pane, MOUSE) {
			var url = MOUSE.url + "?summary_stats=1";
			var message_pane = 'stats_messages';
			$.getJSON(url, function(results) {
				var html='<h2>Summary Statistics</h2><div id="' + message_pane + '"></div>';
				html+='<h3>Census</h3>';
				html += '<table>';


				/* give the global numbers */
				html += '<tr><td><b>Strain</b></td><td><b>Genotype</b></td><th>Total mice</th><th>Breeders</th></tr>';
				html += '<tr><td colspan=4 align=center><i>Total Facility Census</i></td></tr>';
				html += '<tr><td>all</td><td>all</td><td>' + results.current_mice + '</td><td>' + results.breeders + '</td></tr>';
				html += '<tr><td colspan=4 align=center>&nbsp;</td></tr>';
				html += '<tr><td colspan=4 align=center><i>Census by Strain/Genotype</i></td></tr>';



				/* now separate things out by strain/genotype combination  */
				var strain_data = results.by_strain;
				var keys = sort_keys(strain_data);

				for (var i=0; i<keys.length; i++) {
					var res = strain_data[keys[i]];
					if (!res.current_mice)
						res.current_mice = 0;
					if (!res.breeders)
						res.breeders = 0;

					var names = keys[i].split("|");
					var name = names[0];

					if (!names[1])
						names[1] = '';

					html += '<tr><td>' + names[0] + '</td><td>' + names[1] + '</td><td>' + res.current_mice + '</td><td>' + res.breeders + '</td></tr>';
				}

				html += '</table>';

				html += '<h3>Productivity</h3>';
				html += '<div id="plot_pane" style="height:300px;"></div>';
				$pane.html(html).trigger('create');

				add_productivity('plot_pane', results.productivity);


			});
			//for (var i=0; i<results.length; i++)

			//}

		}

		function add_productivity(pane_id, date_births) {
			var date_plot = [];
                        var date_plot = [];

                        if (! date_births || date_births.length < 1) {
                                debug('skipping isolator');
                                $('#' + pane_id).hide();
                                return;
                        }
                        else  {
                                debug('plotting isolator');
                                $('#' + pane_id).show();
                        }


                        // make plot of mice produced over time
                        var chart_data = new google.visualization.DataTable();
                        chart_data.addColumn('date', 'Month');
                        chart_data.addColumn('number', "Mice born in 3 weeks");
                        chart_data.addColumn('number', "moving avg");

                        for (var i=0; i<date_births.length; i++) {
                                var D = date_from_sqlite_date(date_births[i][0]);
                                chart_data.addRow([D, date_births[i][1], date_births[i][2]]);

                        }
                        google.charts.setOnLoadCallback(archive_line_plot_draw);
                        function archive_line_plot_draw () {
                                var options = {
                                        title: 'mice born every three weeks',
                                        legend: { position: 'none' },
                                        series: {
                                                0: { lineWidth: 0, pointSize: 3 },
                                                1: { lineWidth: 2, pointSize: 0 }
                                        }
                                };
                                var chart = new google.visualization.ScatterChart(document.getElementById(pane_id));
                                chart.draw(chart_data, options);
                        }


		}

		function init_genotypes($pane, MOUSE) {
			debug('in init_genotypes');
			var url = MOUSE.url + "?get_genotypes=1";
			var message_pane = 'strain_messages';
			var html='<h2>Current Genotypes</h2><div id="' + message_pane + '"></div>';
			$.getJSON(url, function(results) {
				html += '<table>';
				for (var i=0; i<results.length; i++)
					html += "<tr><td>" + results[i] + "</td></tr>";

				html += '</table><br/>';

				html += '<hr/>';
				html +='<h2>Add new genotype</h2>';
				html += '<form id="add_genotype_form">';
                        	html += '<input type="hidden" name="add_genotype" id="add_genotype" value="1"/>';
				html += '<div data-role="fieldcontain">';
                                html += '<label for="select_name" class="select">Genotype Name:</label>';
                        	html += '<input type="text" name="genotype_name" id="genotype_name"/>';
				html += '</div>';
				html += '<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>';
				html += '</form>';
				$pane.html(html).trigger('create');


				$('#add_genotype_form').submit(function(){
					debug($(this).serialize());
                                        var urlB = MOUSE.url + '?' + $(this).serialize();
                                        debug('url is ' + urlB);
                                        $.getJSON(urlB, function(result) {
                                                if (result.success) {
                                                        MyAppRouter.navigate("");
                                                        MyAppRouter.navigate("#misc?genotypes", {trigger:true});
//                                                        MyAppRouter.navigate("#misc?strains");
                                                }
                                                else
                                                        $('#' + message_pane).html('<b>Error:</b> could not add genotype (' + result.error + ')');
					});
					return false;
                        	});
			});


		}
		function init_assignable($pane, MOUSE) {
			var url = MOUSE.url + "?get_types=1";
			var message_pane = 'type_messages';
			var html='<h2>Current Types</h2><div id="' + message_pane + '"></div>';
			$.getJSON(url, function(results) {
				html += '<table>';
				html += "<tr><td><b>Type</b></td><td><b>Description</b></td></tr>";
				html += "<tr><td>Breeder</td><td>special assignment to designate breeding mice</td></tr>";
				html += "<tr><td>NA</td><td>not assigned (not yet reserved for a downstream experiment)</td></tr>";
				for (var i=0; i<results.length; i++)
					html += "<tr><td>" + results[i][0] + "</td><td>" + results[i][1] + "</td></tr>";

				html += '</table><br/>';

				html += '<hr/>';
				html +='<h2>Add new type</h2>';

				html += '<p>Please use the following naming convention = <i>PI_initials</i> OR <i>PI_initials:Trainee_initials</i> for example <pre>JJF:SL</pre></p>';
				html += '<form id="add_type_form">';
                        	html += '<input type="hidden" name="add_type" id="add_type" value="1"/>';
				html += '<div data-role="fieldcontain">';
                                html += '<label for="select_name" class="select">Type Name:</label>';
                        	html += '<input maxlength=7 type="text" name="type_name" id="type_name"/>';
				html += '</div>';
				html += '<div data-role="fieldcontain">';
                                html += '<label for="select_name" class="select">Type Description:</label>';
                        	html += '<input type="text" name="type_description" id="type_description"/>';
				html += '</div>';
				html += '<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>';
				html += '</form>';
				$pane.html(html).trigger('create');


				$('#add_type_form').submit(function(){
					debug($(this).serialize());
                                        var urlB = MOUSE.url + '?' + $(this).serialize();
                                        debug('url is ' + urlB);
                                        $.getJSON(urlB, function(result) {
                                                if (result.success) {
                                                        MyAppRouter.navigate("");
                                                        MyAppRouter.navigate("#misc?types", {trigger:true});
//                                                        MyAppRouter.navigate("#misc?strains");
                                                }
                                                else
                                                        $('#' + message_pane).html('<b>Error:</b> could not add type (' + result.error + ')');
					});
					return false;
                        	});
			});
		}
		function init_strains($pane, MOUSE) {
			var url = MOUSE.url + "?get_strains=1";
			var message_pane = 'strain_messages';
			var html='<h2>Current Strains</h2><div id="' + message_pane + '"></div>';
			$.getJSON(url, function(results) {
				html += '<table>';
				for (var i=0; i<results.length; i++)
					html += "<tr><td>" + results[i] + "</td></tr>";

				html += '</table><br/>';

				html += '<hr/>';
				html +='<h2>Add new strain</h2>';
				html += '<form id="add_strain_form">';
                        	html += '<input type="hidden" name="add_strain" id="add_strain" value="1"/>';
				html += '<div data-role="fieldcontain">';
                                html += '<label for="select_name" class="select">Strain Name:</label>';
                        	html += '<input type="text" name="strain_name" id="strain_name"/>';
				html += '</div>';
				html += '<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>';
				html += '</form>';
				$pane.html(html).trigger('create');


				$('#add_strain_form').submit(function(){
					debug($(this).serialize());
                                        var urlB = MOUSE.url + '?' + $(this).serialize();
                                        debug('url is ' + urlB);
                                        $.getJSON(urlB, function(result) {
                                                if (result.success) {
                                                        MyAppRouter.navigate("");
                                                        MyAppRouter.navigate("#misc?strains", {trigger:true});
//                                                        MyAppRouter.navigate("#misc?strains");
                                                }
                                                else
                                                        $('#' + message_pane).html('<b>Error:</b> could not add strain (' + result.error + ')');
					});
					return false;
                        	});
			});


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
			var morgue_button = 'morgue_button';
			var strain_button = 'strain_button';
			var genotype_button = 'genotype_button';
			var stats_button = 'stats_button';
			var born_button = 'born_button';
			var breeder_button = 'breeder_button';
			var type_button = 'type_button';



			html += '<h5>Facility overviews:</h5>';
			html += '<a id="' + stats_button  + '" title="stats_button" href="#misc?stats" data-role="button">Facility Summary Statistics</a>';
			html += '<a id="' + born_button  + '" title="born_button" href="#misc?born" data-role="button">Just Born</a>';
			html += '<a id="' + breeder_button  + '" title="breeder_button" href="#misc?breeder" data-role="button">Breeder Statistics</a>';

			html += '<h5>Accident recovery:</h5>';
			html += '<a id="' + morgue_button  + '" title="morgue_button" href="#misc?morgue" data-role="button">Morgue (recover accidentally removed mice)</a>';

			html += '<h5>Database additions:</h5>';
			html += '<a id="' + strain_button  + '" title="strain_button" href="#misc?strains" data-role="button">Add Strains</a>';
			html += '<a id="' + genotype_button  + '" title="genotype_button" href="#misc?genotypes" data-role="button">Add Genotypes</a>';
			html += '<a id="' + type_button  + '" title="type_button" href="#misc?types" data-role="button">Add Mouse Types (assignables)</a>';

			html += '<h5>Isolator labels:</h5>';
			html += '<a data-ajax=false data-role="button" href="mouse.php?qr_codes=1">Print isolator barcodes</a>';
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

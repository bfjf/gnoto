/*
	TO DO:
		1) add quick move table selector (and each mouse will have a "mv:#" next to it to move it to that location); only allow for WITHIN an isolator
			need to name table with cage and name rows with mouse id
			need to update the database and if response is "success" then =>
			need to detach row http://api.jquery.com/detach/
			need to append to another table http://www.dotnetcurry.com/showarticle.aspx?ID=956
		4) add mouse Tag column for tracking ears, toes, etc...

	DONE:

*/
//

// create closure
(function($) { // alias jQuery to name $
	// shared plugin variables	

	// BEGIN PLUGIN DEFINIATION
	$.fn.gnotobiotic_update = function(options, $selector) {
		// MAIN FUNCTION, ITERATE OVER SUBMITTED OPTIONS FOR "each" DOM ELEMENT
		return this.each(function() {
			var $pane = $(this);
			var MOUSE = {
				url : 'mouse.php',
				pane_id : this.id
			};


                        if (options && options.show == "isolator") {
				debug('showing isolator');

				if (options.isolator_id)
	                                init_show_isolator($pane, MOUSE, options.isolator_id);
				else
					debug('Error: must provide isolator id to switch isolators');
			}
			else {
				init_mouse_update($pane, MOUSE);
			}
			//init_show_isolator($pane, MOUSE, m[1]);

		});
			

		/* PRIVATE FUNCTIONS */

		// private function for debugging
		function debug(text) {
			if (window.console && window.console.log)
				window.console.log(text);
  		};

		// set up the basic interface and all of the controls
		function init_mouse_update($pane, MOUSE) {
			var add_isolator_pane = MOUSE.pane_id + 'add_isolator';
			var external_cages = MOUSE.pane_id + 'external_cages';
			var html = '';
			var url = MOUSE.url + "?get_isolators=1";
			$.getJSON(url, function(result) {
//				MOUSE.genotypes = result.genotypes;
//				MOUSE.cages = result.cages;
//				MOUSE.isolators = result.isolators;
				if (result.isolators && result.isolators.length) {
					var isolators = result.isolators;
					html += '<div data-role="fieldcontain">'+
					'<label for="select-choice-1" class="select">Choose an isolator:</label>' +
					'<select name="isolator_id" id="isolator_id">';
					html += '<option value="0"></option>';
		
					for (var i=0; i<isolators.length; i++) {
						var isolator_id = isolators[i][0];
						var isolator_size = isolators[i][1];
						var isolator_start_date = isolators[i][1];

						html += '<option value="' + i + '">Isolator ' + isolator_id + '</option>';
					}
					html += '</select>'+
					'</div>';
				}
				html += '<a id="' + add_isolator_pane  + '" title="add_isolator" href="#" data-role="button">Add an isolator</a>';
			
				html += '<a id="' + external_cages  + '" title="external_cages" href="#isolator?0" data-role="button">External Cages</a>';

				$pane.html(html).trigger('create');
				$('#isolator_id').change(function(e,passed) {
					var isolator_selected = $('#isolator_id').val();	
					debug('selected ' + isolator_selected);
					MyAppRouter.navigate("#isolator?" + isolators[isolator_selected][0], {trigger:true});
//					MyAppRouter.navigate("#isolator/" + isolators[isolator_selected][0], {trigger:true});
//					MyAppRouter.navigate("#misc/10", {trigger:true});
				});
				$('#' + add_isolator_pane).click(function() {
					add_isolator($pane, MOUSE);
					return false;
				});
//				$('#' + external_cages).click(function() {
//					MyAppRouter.navigate("#isolator?" + 0, {trigger:true});
//				});

			});
		}
		function init_show_isolator($pane, MOUSE, isolator_id) {
			debug('showing ' + isolator_id);
			var html='';
			var cage_pane = 'cage_add_button';

			var url = MOUSE.url + "?get_cages=1&isolator_id=" + isolator_id;
			$.getJSON(url, function(result) {
//				$('#header_tools_span').text('_.');

				var isolator_notes_pane = 'isolator_notes';
				var isolator_info = result.isolator_info;
				if (isolator_id == 0) {
					html += '<h2>External cages</h2>';
				}
				else {
							//html += '<div data-role="collapsible" data-mini="true"><h3>Cage ' + cage_num + ' Notes</h3>' +
							///	   '<div id="' + cage_note + cages[i][0] + '"><p><a class="note_add" id="' + cage_id + '" title="cage" href="">Add Note</a><p>There are currently no notes for this cage.</div></div>' + 
					html += '<h2>Isolator ' + isolator_info[0] + '</h2>';
					html += '<p><b>Isolator description:</b> ' + isolator_info[1] +  '</p>';
					html += '<p><b>Isolator administrator:</b> ' + isolator_info[2] +  '</p>';
//					html +=	'<div style="height:300px; width:740px; display:none;" id="isolator_productivity"></div>' + 
					html +=	'<div style="height:300px;  display:none;" id="isolator_productivity"></div>' + 
						'<p><a href="javascript:void(0);"  id="isolator_note_add">Add Note</a><a href="javascript:void(0)" id="submit_note" style="display:none">Submit Note</a> <span id="isolator_note_error"></span></p>' +
						'<p><form name="isolator_note_form" id="isolator_note_form"><textarea name="isolator_note_input" id="isolator_note_input" style="display:none;"></textarea></form></p>';
					html += '<div id="isolator_note_content" data-role="collapsible" data-mini="true"><h3>Isolator Notes</h3>' +
						   '<div id="' + isolator_notes_pane + '">'+
							'<table id="isolator_note_table">';

					if (result.isolator_notes) 
						for (var i=0; i<result.isolator_notes.length; i++)
							html += '<tr><td>' + format_date_from_php(result.isolator_notes[i][0]) + '</td><td>' + result.isolator_notes[i][1] + '</td></tr>';


					html += '</table></div></div>';

//					html += '<p><b>Start date:</b> ' + format_date_from_php(isolator_info[2]) + '</p>';
				}
//				html += '<div>' + 
				html += '<br /><h3>Cage and Mouse Information</h3>';
//				'</div>';
				html +=	'<div>';

				MOUSE.strains = result.strains;
				MOUSE.genotypes = result.genotypes;
				MOUSE.types = result.types;
				MOUSE.cages = result.cages;
				MOUSE.isolators = result.isolators;
				MOUSE.quick_move_table = 0;
				MOUSE.quick_move_cage = 0;
				var cage_note = 'cage_note';
				if (result.cage) {
					var cages = result.cage;
					debug('in cages precage');
//					blah
//
//					/* set up to all quick move */
					var options = []; var values = []; var option_to_value = [];

					for (var i=0; i<cages.length; i++) {
						var cage_num = i + 1; var cage_id = cages[i][0];
						options[i] = cage_id;
						values[i] = 'cage ' + cage_num;
						option_to_value[cage_id] = cage_num;
					}
//
//
					html += write_select('Quick move cage destination', 'quick_table_move', 'quick_table_move', options, 0, 0, values);
					MOUSE.quick_move_table = options[0];
//					MOUSE.quick_move_cage = values[0];
					MOUSE.quick_move_cage = option_to_value[options[0]];
					//debug('length is ' + cages.length);
	
					var sex_to_short = {undetermined:'?',male:'M',female:'F'};
					for (var i=0; i<cages.length; i++) {
						var cage_num = i + 1;
						var cage_id = MOUSE.pane_id + 'cage' + cages[i][0];

						html += '<br /><table id="cage' + cages[i][0] + '">';
						html += '<tr><th colspan=8>Cage ' + cage_num + '</th></tr>';
						html += '<tr><th>Id</th><th>Sex</th><th>Birth-date</th><th>Age (wks)</th><th>Wean-date</th><th>Type</th><th>Strain</th><th>Genotype<th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>';

						if (result.mice && result.mice[cages[i][0]] && result.mice[cages[i][0]].length){
							var table_id = cages[i][0];
//							debug('table id is ' + table_id);
							//html += '<tr><td colspan=8>';
//							html += '<div data-role="collapsible" data-mini="true"><h3>Cage ' + cage_num + ' Notes</h3>' +
//								   '<div id="' + cage_note + cages[i][0] + '"><p><a class="note_add" id="' + cage_id + '" title="cage" href="">Add Note</a><p>There are currently no notes for this cage.</div></div>' + 
//								   '</td><td>&nbsp;</td></tr>';

							var now = new Date();
							var now_milliseconds = now.getTime();
							var mice_in_cage = result.mice[cages[i][0]];

							for (var j=0; j<mice_in_cage.length; j++) {
								var birth = mice_in_cage[j][10]*1000;
//var birth_date = new Date(birth);
								var age_in_weeks = (now_milliseconds - birth) / 1000 / 60 / 60 / 24 / 7;
								age_in_weeks = age_in_weeks.toFixed(1);
	// HERE NEED TO MAKE ROW_ID SO WE CAN CULL THE MICE AND NOT HAVE THE INTERFACE UPDATE
								var row_id = "mouseRow" + mice_in_cage[j][0];
								html += '<tr id="' + row_id + '" title="' + table_id + '">';
								if (!mice_in_cage[j][3])
									mice_in_cage[j][3] = '-';

								html += '<td>' + mice_in_cage[j][0] + '</td><td><span id="'+row_id + 'sex">' + sex_to_short[mice_in_cage[j][1]] + '</span></td><td>' + mice_in_cage[j][2] + '</td>';

								if (age_in_weeks > 30 && mice_in_cage[j][6] == "breeder" && mice_in_cage[j][1] == "female")
									html += '<td class="highlight" align="center">' + age_in_weeks + '</td>';
								else if (age_in_weeks > 60 && mice_in_cage[j][6] == "breeder" && mice_in_cage[j][1] == "male")
									html += '<td class="highlight" align="center">' + age_in_weeks + '</td>';
								else 
									html += '<td align="center">' + age_in_weeks + '</td>';
								html += '<td align=center><span id="'+row_id +'wean">' + mice_in_cage[j][3] + '</span></td><td>' + mice_in_cage[j][6] + '</td><td>' + mice_in_cage[j][7] + '</td>';
								html += '<td align="center">' + mice_in_cage[j][8] + '</td>';
								// cage id is title; mouse id is id
//								html += '<a id="' + mice_in_cage[j][0]  + '" title=' + cages[i][0] +  ' href="#">edit mouse ' + mice_in_cage[j][0] + '</a>';
								html += '<td><a class="edit_mouse" id="' + mice_in_cage[j][0]  + '" title=' + cages[i][0] +  ' data-mini="true" href="#" data-role="button">Edit</a></td>';

								/* begin quick buttons */
								html += '<td>'
								var quick_buttons='';
								
								/* only make it easy to cull females that are NOT breeders; all males should be hard to cull */
//								if (mice_in_cage[j][1] != "male" && mice_in_cage[j][6] != "breeder")
								/* only make it easy to cull animals that are NOT breeders */
								if (mice_in_cage[j][6] != "breeder")
									quick_buttons += '<a class="cull_mouse" id="' + mice_in_cage[j][0]  + '" title="mouseCull' + mice_in_cage[j][0] + '" data-mini="true" data-icon="delete" href="#" data-inline="true" data-role="button">Cull</a>';
//								else
//									html += '<td>&nbsp;</td>';

								/* add quick button to set sec */
								if (mice_in_cage[j][1] != "male" && mice_in_cage[j][1] != "female") {
									quick_buttons += '<a class="quick_mouse_edit" id="' + mice_in_cage[j][0]  + '" title="mouseSex:female:' + mice_in_cage[j][0] + '" data-mini="true" href="#" data-inline="true" data-role="button">&#9792;</a>';
									quick_buttons += '<a class="quick_mouse_edit" id="' + mice_in_cage[j][0]  + '" title="mouseSex:male:' + mice_in_cage[j][0] + '" data-mini="true" href="#" data-inline="true" data-role="button">&#9794;</a>';
								}

								if (!mice_in_cage[j][3] || mice_in_cage[j][3] == "-")
									quick_buttons += '<a class="quick_mouse_edit" id="' + mice_in_cage[j][0]  + '" title="wean_date:now:' + mice_in_cage[j][0] + '" data-mini="true" href="#" data-inline="true" data-role="button">Wean</a>';

								/* set up the quick move */

								quick_buttons += '<a class="quick_move" id="' + mice_in_cage[j][0]  + '" title="' +table_id + '" data-mini="true" href="#" data-inline="true" data-icon="forward" data-role="button"><span class="move_to">' + MOUSE.quick_move_cage + '</span></a>';
//								else debug(mice_in_cage[j][0] + ' weaned ' + mice_in_cage[j][3]);

								if (quick_buttons.length)
									html += '&nbsp;&nbsp;&nbsp;' + quick_buttons + '</td>';
								else
									html += '&nbsp;</td>';
								
								html += '<td>&nbsp;</td>';
//								html += '<td><a class="wean_mouse" id="' + mice_in_cage[j][0]  + '" title=' + cages[i][0] +  ' data-mini="true" href="#" data-role="button">Wean &#9794;</a></td>';
								html += '</tr>';
							}

							if (isolator_id != 0) {
								
								html += '<tfoot><tr><td colspan=4><a data-mini="true" class="add_mouse_button" id="' + cage_id  + '" title=' + cages[i][0] +  ' href="#" data-role="button">Add mice to cage ' + cage_num + '</a></td><td>&nbsp;</td></tr></tfoot>';
							}
							html += '</table>';
							
						}
						else { 
							if (isolator_id != 0)
								html += '<tfoot><tr><td colspan=4><a data-mini="true" class="add_mouse_button" id="' + cage_id  + '" title=' + cages[i][0] +  ' href="#" data-role="button">Add mice to cage ' + cage_num + '</a></td><td>&nbsp;</td></tr></tfoot>';
								html += '</table>';
								//html += '<tr id="add_mouse' + table_id><td colspan=8><a class="add_mouse_button" id="' + cage_id  + '" title=' + cages[i][0] +  ' href="#" data-role="button">Add mice to empty cage ' + cage_num + '</a></td></tr>'; 
//								html += '<p><a class="add_mouse_button" id="' + cage_id  + '" title=' + cages[i][0] +  ' href="#" data-role="button">Add mice to empty cage ' + cages[i][0] + '</a></p>'; 
						}
					}
	
	
					html +=	'</div>';
					html +=	'</br>';
					html += '<a id="' + cage_pane  + '" title="add_cage" href="#" data-role="button">Add a cage</a>';

					var iso_edit = 'iso_edit';
					html += '</br><a id="' + iso_edit  + '" title="edit_isolator" href="#" data-role="button">Edit isolator description</a>';



					$pane.html(html).trigger('create');

					if (isolator_id != 0)
						add_isolator_productivity('isolator_productivity', result.isolator_productivity);

					$('#' + iso_edit).click(function(){
//					html += '<h2>Isolator ' + isolator_info[0] + '</h2>';
//					html += '<p><b>Isolator description:</b> ' + isolator_info[1] +  '</p>';
//					html += '<p><b>Isolator administrator:</b> ' + isolator_info[2] +  '</p>';
						add_isolator($pane, MOUSE, {'isolator_id':isolator_info[0],isolator_description:isolator_info[1],isolator_administrator:isolator_info[2]});
						debug('editing isolator');
						return false;
					});
					$('.edit_mouse').click(function() {
						var cage_id = this.title;
						var mouse_id = this.id;
						debug("editing mouse " + mouse_id);
//						edit_mouse($pane, MOUSE, cage_id, isolator_info[0], isolator_info, mouse_id);
					//	edit_mouse($pane, MOUSE, cage_id, isolator_id, isolator_info, mouse_id);
						edit_mouse($pane, MOUSE, cage_id, isolator_id, mouse_id);
						return false;
					});
					$('.quick_mouse_edit').click(function() {
						var mouse_id = this.id;
						var mouse_key_value = this.title;
//						debug('editing ' + mouse_id + '; key:value => ' + mouse_key_value);
						var key_val = mouse_key_value.split(':');
					
						debug('editing ' + mouse_id + '; key:value => ' + key_val[0] + '|' + key_val[1]);
						if (key_val[0] == "wean_date") {
							var d = new Date();
							var month = d.getMonth()+1;
							var date_str = d.getFullYear() + '-' + month + '-' + d.getDate();
//							key_val[0] = "wean_date";
							key_val[1] = date_str;
						}

					
//						var url_quick_mouse_edit = MOUSE.url + "?quick_edit_mouse=1&key_val=" + mouse_key_value + "&mouse_id=" + mouse_id;
						var url_quick_mouse_edit = MOUSE.url + "?edit_mouse=1&mouseId=" + mouse_id + "&" +  key_val[0] + "=" + key_val[1];
//						debug('url is ' + url_quick_mouse_edit);
						$.getJSON(url_quick_mouse_edit, function(results) {
							if (key_val[0] == "mouseSex") {
								$('#mouseRow' + mouse_id + 'sex').text(sex_to_short[key_val[1]]);
//								debug('here with ' + mouse_id + 'mouseSex; val=' + key_val[1]);
								/* don't allow easy sex change anymore */
								$('.quick_mouse_edit[title="mouseSex:male:' + mouse_id + '"]').hide();
								$('.quick_mouse_edit[title="mouseSex:female:' + mouse_id + '"]').hide();
					//			if (key_val[1] == "male") { // don't let males accidentally be culled
					//				$('.cull_mouse[title="mouseCull' + mouse_id + '"]').hide();
					//			}
							}
							else if (key_val[0] == "wean_date") {
//								$('.quick_mouse_edit[title="mouseWean:now:' + mouse_id + '"]').hide();
								debug('weaned on ' + date_str);
								$('#mouseRow' + mouse_id + 'wean').text(key_val[1]);
								debug('wean_date:now:' + mouse_id);
								$('.quick_mouse_edit[title="wean_date:now:' + mouse_id + '"]').hide();
//								debug('updating on ' + date_str + ' row is mouseRows' + mouse_id + 'se);
//								var date_str = 

							}

//					quick_buttons += '<a class="quick_mouse_edit" id="' + mice_in_cage[j][0]  + '" title="mouseWean:now:' + mice_in_cage[j][0] + '" data-mini="true" href="#" data-inline="true" data-role="button">Wean</a>';
						});
						return false;
					});
					$('.cull_mouse').click(function() {
//						var mouse_sex = this.title;
						var mouse_id = this.id;
//						debug("culling  mouseId " + mouse_id);
						var url_cull = MOUSE.url + "?cull_mouse=1" + "&mouse_id=" + mouse_id;
						$.getJSON(url_cull, function(results) {
//							$('#' + message_pane).html('<b>Status:</b> mouse <i>' + mouse_id + '</i> has been revived and can now be found in isolator ' + isolator_id + '<br />').trigger('create');
							$("#mouseRow" + mouse_id).hide();
						});
						return false;
					});
					$('.quick_move').click(function() {
						var mouse_id = this.id;
						var table_id = this.title;
						var row_id = "mouseRow" + mouse_id;
						var destination_table = 'cage' + MOUSE.quick_move_table;
//						MOUSE.quick_move_table = table_selected;
//						MOUSE.quick_move_cage = cage_selected;
						// FIRST CHECK IF IN SAME TABLE
						if (table_id == MOUSE.quick_move_table)
							return false; // don't move into same table
						
						var url_cull = MOUSE.url + "?move_mouse=1" + "&mouseId=" + mouse_id + "&cage_select=" + MOUSE.quick_move_table;
						$.getJSON(url_cull, function(res2) {
							if (res2.success) {
								// detach the row from the DOM
								$('#' + row_id).attr('title',MOUSE.quick_move_table);
								var row = $('#' + row_id).detach();
								$('#' + destination_table + ' > tbody > tr:last').after(row);
							}
						});
						return false;
//								html += '<tr id="' + row_id + '" title="' + table_id + '">';
					});
					$('.add_mouse_button').click(function() {
						var cage_id = this.title;
						debug('add mice to cage ' + cage_id);
///							var mice_in_cage = result.mice[cages[i][0]];
//							var mice_in_cage = result.mice[cages[i][0]];
//								html += '<tr><td colspan=4><a data-mini="true" class="add_mouse_button" id="' + cage_id  + '" title=' + cages[i][0] +  ' href="#" data-role="button">Add mice to cage ' + cage_num + '</a></td><td>&nbsp;</td></tr>';
						add_mice($pane, MOUSE, cage_id, isolator_id, isolator_info, result.mice[cage_id]);
						return false;
	
					});
					$('#quick_table_move').change(function(e,passed) {
						var table_selected = $('#quick_table_move').val();
						var cage_selected = option_to_value[table_selected];
						MOUSE.quick_move_table = table_selected;
						MOUSE.quick_move_cage = cage_selected;
						//var cage_text = 'cage ' + cage_selected;
						var cage_text =  cage_selected;
//						debug('selected ' + table_selected + 'cage: ' + cage_selected);
						$('.move_to').text(cage_text);
					});
				}
				else {
					html +=	'This isolator has no cages.';
					html +=	'</div>';
					html += '<a id="' + cage_pane  + '" title="add_cage" href="#" data-role="button">Add a cage</a>';
					$pane.html(html).trigger('create');
				}

				$('#' + cage_pane).click(function() {
					add_cage($pane, MOUSE, isolator_id);
					return false;
				});
				$('#submit_note').click(function () {
					var text = $('textarea#isolator_note_input').val();

					if (text.length) {
						var url = MOUSE.url + "?add_note=1&note=" + encodeURIComponent(text) + "&id_type=isolator&id=" + isolator_id;
						debug('trying ' + url);
						$.getJSON(url, function(result) {

						if (result.success) {
							$('#isolator_note_error').hide();
							$('#isolator_note_add').show();
							$('#submit_note').hide();
							$('#isolator_note_input').hide();
							var date = format_date_from_php(result.success);
							$('#isolator_note_table').prepend("<tr><td>" + date + "</td><td>" + text + "</td></tr>");
						}
						else
							$('#isolator_note_error').html('<b>Error:</b> could not add note (' + result.error + ')');
						});

					}

					return false;
				});
				$('#isolator_note_add').click(function () {
					debug('here');
					$('#isolator_note_content').trigger('expand');
					$('#isolator_note_input').show();
					$('#submit_note').show();
					$('#isolator_note_add').hide();


					return false;
				});
			});

		}
		function add_isolator_productivity(pane_id, date_births) {
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


			for (var i=0; i<date_births.length; i++) {
				date_plot[i] = [date_births[i][0]*1000, date_births[i][1]];
			}
                                      $.jqplot(pane_id, [date_plot], {
                                            title:'Isolator Productivity (each point = 3 weeks)', 
                                       //     gridPadding:{right:35},
					   axesDefaults: {
					        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
					      },
                                            axes:{
                                              yaxis:{
							label:'mice'
						},
                                              xaxis:{
                                               renderer:$.jqplot.DateAxisRenderer, 
                                                tickOptions:{formatString:'%x'}
                                              }
                                            },
                                            series:[{showLine:false}]
                                        });

			

		}
		function edit_mouse($pane, MOUSE, cage_id, isolator_id, mouse_id, everything_editable) {
			var url = MOUSE.url + "?get_mouse=1&mouse_id=" + mouse_id;
			$.getJSON(url, function(result) {
				var html='<h2>Edit Mouse ' + mouse_id + '</h2>';

				if (!everything_editable)
					html += '<p><small>(<a id="edit_everything" href="#">edit everything</a>)</small></p>';

				html += '<form id="edit_mouse_form">';
       	  			html += '<input type="hidden" name="mouseId" id="mouseId" value=' + mouse_id + ' />';

		//function write_select(label, name, id, options, selected, show_blank) {
				if (everything_editable) 
					html +=  write_select('Strain', 'mouseStrain', 'mouseStrain', MOUSE.strains, index_in_array(MOUSE.strains,result[7]), 1);
				else 
					html += '<div>Strain: ' + result[7] + '</div>';

/*				if (everything_editable) {
					if (result[6] == 'breeder')
						html += write_radio('mouseType', 'Mouse Type',
							[['breederType','breeder','Breeder','checked'],['experimentalType','unassigned','Unassigned'],['experimentType','reserve','Reserve']]);
					else if (result[6] == 'experimental')
						html += write_radio('mouseType', 'Mouse Type',
							[['breederType','breeder','Breeder'],['experimentalType','unassigned','Unassigned','checked'],['experimentType','reserve','Reserve']]);
					else
						html += write_radio('mouseType', 'Mouse Type',
							[['breederType','breeder','Breeder'],['experimentalType','unassigned','Unassigned'],['experimentType','experiment','reserve','Reserve']]);
//					html += '<div data-role="fieldcontain" data-inline="true">';
//					html += '<label for="assign_name" class="select">Assign To (max 3 letters):</label>';
//					html += '<input type="text" name="assign_to" maxlength=3 size=3 data-mini="true" id="assign_to"/>';
//					html += '</div>';
				}
				else {
					html += '<p>Type: ' + result[6] + '</p>';
				}
				*/
				//blah
//				html += '<div data-role="fieldcontain" data-inline="true">';
//				html += '<label for="assign_name" class="select">Assign To:</label>';
//				html += '<input type="text" name="assign_to" data-inline="true" id="assign_to"/>';
//				 data-inline="true"
//				html += '</div>';
	
				/* mouse sex */
				if (result[1] == 'undetermined') {
					html += write_radio('mouseSex', 'Sex',
						[['sexMale','male','Male'],['sexFemale','female','Female'],['sexUndetermined','undetermined','Undetermined','checked']]);
				}
				else {
					if (everything_editable) {
						if (result[1] == 'male') {
							html += write_radio('mouseSex', 'Sex',
								[['sexMale','male','Male','checked'],['sexFemale','female','Female'],['sexUndetermined','undetermined','Undetermined']]);
						}
						else if (result[1] == 'female') {
							html += write_radio('mouseSex', 'Sex',
								[['sexMale','male','Male'],['sexFemale','female','Female','checked'],['sexUndetermined','undetermined','Undetermined']]);
						}
					}
					else {
						html += '<p>Sex: ' + result[1] + '</p>';
					}
				}

				if (everything_editable)
		               		html += write_date_dialog('date1', 'Birth Date', 'birth_date', format_date_from_php(result[2])); 
				else
					html += '<p>Birth Date: ' + format_date_from_php(result[2]) + '</p>';

				// if have wean date display read-only
				if (everything_editable || !result[3]) {
					if (result[3])
		                		html += write_date_dialog('date2', 'Wean Date', 'wean_date', format_date_from_php(result[3])); 
					else
		                		html += write_date_dialog('date2', 'Wean Date', 'wean_date'); 
				}
				else  {
					html += '<div>Wean Date: ' + format_date_from_php(result[3]) + '</div>';
				}

				if (everything_editable || !result[4]) 
					if (result[4])
		                		html += write_date_dialog('date3', 'Death Date', 'death_date', format_date_from_php(result[4])); 
					else
		                		html += write_date_dialog('date3', 'Death Date', 'death_date'); 
				else 
					html += '<div>Death Date: ' + format_date_from_php(result[4]) + '</div>';


				if (result[5] && !everything_editable)
					html += '<div>Death Type: ' + result[5] + '</div>';
				else 
	                		html += write_select('Death Type', 'death_type', 'death_type',['sacrifice','parental neglect','unknown'],-1,1);

				if (result[8] == 'unknown' || everything_editable) 
					html +=  write_select('Genotype', 'mouseGenotype', 'mouseGenotype', MOUSE.genotypes, index_in_array(MOUSE.genotypes, result[8]), 1);
//					html +=  write_select('Strain', 'strain', 'strain', MOUSE.strains, index_in_array(MOUSE.strains,result[7]), 1);
				else
					html += '<p>Genotype: ' + result[8] + '</p>';

				html += write_mouse_type_dialog(result[6], MOUSE.types);
				html += write_cage_dialog(result[9],MOUSE.cages);
				html += '<div id="error_pane"></div>';
				html += '<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>';
				html += '</form>';
				


				$pane.html(html).trigger('create');
				$('#date1').scroller('destroy').scroller({ dateFormat:'yy-mm-dd',preset: 'date'});
				$('#date2').scroller('destroy').scroller({ dateFormat:'yy-mm-dd',preset: 'date'});
				$('#date3').scroller('destroy').scroller({ dateFormat:'yy-mm-dd',preset: 'date'});
				$('#edit_everything').click(function() {
//					edit_mouse($pane, MOUSE, cage_id, isolator_id, isolator_info, mouse_id, 1);
					edit_mouse($pane, MOUSE, cage_id, isolator_id, mouse_id, 1);
					return false;
				});

				$('#edit_mouse_form').submit(function(){
					debug('here');
					var url = MOUSE.url + '?edit_mouse=1&' + $(this).serialize();
					debug('url is ' + url);
					$.getJSON(url, function(result) {
						if (result.success) {
							MyAppRouter.navigate("");
							MyAppRouter.navigate("#isolator?" + isolator_id, {trigger:true});
						}
						else
							$('#error_pane').html('<b>Error:</b> could not edit mouse (' + result.error + ')');
					});
				
					return false;
				});
			});

		}
		// slow way to do this, but used only for short vectors
		function index_in_array(vector, query) {
			console.log('index checking for ' + query);
			for (var i=0; i<vector.length; i++)
				if (vector[i] == query)
					return i;

			return;
		}
		function write_date_dialog(id, label, name, default_date) {
			var html = '<div data-role="fieldcontain">'+
				'<label for="start_date">' + label + ': </label>';
			
			if (default_date)
				html += '<input type="text" name="' + name + '" id="'+ id + '" class="mobiscroll" value="' + default_date + 
					'" readonly="readonly" />';
			else
				html += '<input type="text" name="' + name + '" id="'+ id + '" class="mobiscroll" value="" readonly="readonly" />';

			html += '</div>';

			return html;
		}
		function write_mouse_type_dialog(selected_type, types) {
			var html = '<div data-role="fieldcontain">'+
				'<label for="select-choice-1" class="select">Select a mouse type:</label>' +
				'<select name="mouseType" id="mouseType">';
///			mouseType

			var current_isolator = -1;

			var prev_isolator = -1;
			var cage_num_offset = 0;

			debug('have type ' + selected_type);
			if (types && types.length) {
				for (var i=0; i<types.length; i++) {
	
					var type_id = types[i];

					if (type_id == selected_type)
						html += '<option value="' + type_id + '" selected>' + type_id + '</option>';
					else
						html += '<option value="' + type_id + '">' + type_id + '</option>';
//						html += '<option value="' + cage_id + '">Cage ' + cage_id + '</option>';
				}
			}

			html += '</select></div>';
			return html;
		}
		function write_cage_dialog(selected_cage,cages) {
			var html = '<div data-role="fieldcontain">'+
				'<label for="select-choice-1" class="select">Select a cage:</label>' +
				'<select name="cage_select" id="cage_select">';

			var current_isolator = -1;

			var prev_isolator = -1;
			var cage_num_offset = 0;
			if (cages && cages.length) {
				for (var i=0; i<cages.length; i++) {
					var option = cages[i];
	
					var isolator_id = option[1];
					var cage_id = option[0];

					if (prev_isolator != isolator_id) 
						cage_num_offset = i, prev_isolator = isolator_id;

					
					if (isolator_id != current_isolator) {
						html += '<optgroup label="Isolator'+isolator_id  + '">';
						current_isolator = isolator_id;
					}
				
	
					var cage_num = i+1 - cage_num_offset;
					if (cage_id == selected_cage)
						html += '<option value="' + cage_id + '" selected>Cage ' + cage_num + '</option>';
//						html += '<option value="' + cage_id + '" selected>Cage ' + cage_id + '</option>';
					else
						html += '<option value="' + cage_id + '">Cage ' + cage_num + '</option>';
//						html += '<option value="' + cage_id + '">Cage ' + cage_id + '</option>';
				}
			}
			html += '</select></div>';

			return html;
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

		function write_radio(name, legend, id_value_pairs) {
			var html = '';
			html += 
					'<div data-role="fieldcontain">' +
				    '<fieldset data-role="controlgroup" data-type="horizontal">'+
			    	'<legend>' + legend + ':</legend>';

			for (var i=0; i<id_value_pairs.length; i++) {
				var pair = id_value_pairs[i];
				if (pair.length == 4) {
					html += '<input type="radio" name="' + name + '" id="' + pair[0] + '" value="'+ pair[1] +'" checked />';
					html += '<label for="'+ pair[0] + '">' + pair[2] + '</label>' ;
				}
				else {
					html += '<input type="radio" name="' + name + '" id="' + pair[0] + '" value="'+ pair[1] +'" />';
					html += '<label for="'+ pair[0] + '">' + pair[2] + '</label>' ;
				}
			//	else if (id_value_pairs[i].length == 2) {
			//		html += '<input type="radio" name="' + name + '" id="' + pair[0] + '" value="'+ pair[1] +'" checked />';
			//		html += '<label for="'+ pair[0] + '">' + pair[1] + '</label>' ;
			//	}
			}
    			html += '</fieldset></div>';

			return html;
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
		function get_default_strain(mice_in_cage, list) {
			for (var i=0; i<mice_in_cage.length; i++) {
				if (mice_in_cage[i][6] == "breeder") {
					var strain = mice_in_cage[i][7];
					for (var j=0; j<list.length; j++) {
						if (list[j] == strain)
							return j;
					}
				}
			}

			return 0; // no default strain
		}
		function get_default_genotype(mice_in_cage, list) {
			var breeder_genotypes = [];
			for (var i=0; i<mice_in_cage.length; i++) {
				if (mice_in_cage[i][6] == "breeder") {
					var genotype = mice_in_cage[i][8];
					breeder_genotypes[genotype]=1;
				}
			}

			// count keys to see if there is only one genotype
			var last_genotype;
			var num_genotypes = 0;
		        for(var k in breeder_genotypes) {
				num_genotypes++;
				last_genotype = k;
//				debug('have genotype ' + k);

//				keys.push(k);
			}
//			debug('have ' + num_genotypes + ' genotypes');

			var genotype;
			if (num_genotypes == 1)
				genotype = last_genotype;
			else 
				genotype = 'unknown'; // default is we don't know the genotype
				
			
			for (var j=0; j<list.length; j++) {
				if (list[j] == genotype)
					return j;
			}
				

			return 0;
		}

		function add_mice($pane, MOUSE, cage_id, isolator_id, isolator_info, mice_in_cage) {
//						add_mice($pane, MOUSE, cage_id, isolator_id, isolator_info, result.mice[cages[cage_id-1][0]]);
								//if (age_in_weeks > 30 && mice_in_cage[j][6] == "breeder" && mice_in_cage[j][1] == "female")
								//html += '<td align="center">' + mice_in_cage[j][8] + '</td>';
			var html='';
			html += '<form id="add_mouse_form">';
			html += write_radio('mouseSex', 'Sex',
				[['sexMale','male','Male'],['sexFemale','female','Female'],['sexUndetermined','undetermined','Undetermined','checked']]);

//			html += write_radio('mouseType', 'Mouse Type',
//				[['breederType','breeder','Breeder'],['experimentalType','unassigned','Unassigned','checked']]);

			html += write_mouse_type_dialog('NA', MOUSE.types);


			var default_strain = 1;
			var default_genotype = 1;
			debug('before default select mice');
			if (mice_in_cage.length) {
				default_strain = get_default_strain(mice_in_cage, MOUSE.strains);
				default_genotype = get_default_genotype(mice_in_cage, MOUSE.genotypes);
//				debug('adding mice with default strain ' + default_strain + ' ' + MOUSE.strains[default_strain] + ' and default genotype ' + default_genotype + ' ' + MOUSE.genotypes[default_genotype]);
			}

			html +=  write_select('Strain', 'mouseStrain', 'mouseStrain', MOUSE.strains, default_strain, 1);

			html +=  write_select('Genotype', 'mouseGenotype', 'mouseGenotype', MOUSE.genotypes, default_genotype, 1);

               		html += write_date_dialog('date1', 'Birth Date', 'birth_date'); 
		        html += '<div data-role="fieldcontain">' + 
				'<label for="slider">Number of mice:</label>' + 
			 	'<input type="range" name="num_mice" id="num_mice" value="2" min="1" max="20"  />' + 
				'</div>';
			html += '<div id="error_pane"></div>';
			html += '<input type="submit" data-theme="b" name="submit" value="Submit"></form>';

			$pane.html(html).trigger('create');
			$('#date1').scroller('destroy').scroller({ dateFormat:'yy-mm-dd',preset: 'date'});
			$('#add_mouse_form').submit(function(){
				debug($(this).serialize());
				var start_date = $('#date1').attr('value');
				debug('start date is ' + start_date);
				if (start_date) {
					var url = MOUSE.url + '?add_mice=1&' + $(this).serialize() + '&isolator_id=' + isolator_id + '&cage_id=' + cage_id;
					debug('url is ' + url);
					$.getJSON(url, function(result) {
						if (result.success) {
							MyAppRouter.navigate("");
							MyAppRouter.navigate("#isolator?" + isolator_id, {trigger:true});
						}
						else
							$('#error_pane').html('<b>Error:</b> could not add cage (' + result.error + ')');
						
					});
					
				}
				else {
					$('#error_pane').html('<b>Error:</b> must enter birth date.');
				}
				
				return false;
			});
		}

		function add_cage($pane, MOUSE, isolator_id) {
			var html='';
			html += '<form id="add_cage_form">';
//			html += write_radio('cageSize', 'Cage size',
//				[['cageLarge','large','Large'],['cageMedium','medium','Medium'],['cageSmall','small','Small','checked']]);

//			html += write_radio('cageType', 'Cage type',
//				[['cageBreeder','breeder','Breeder'],['cageExperimental','experimental','Experimental','checked']]);

			html += write_date_dialog('date1', 'Start Date', 'start_date'); 

		html += '<div id="error_pane"></div>';
					html += '<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button></form>';


			$pane.html(html).trigger('create');
			$('#date1').scroller('destroy').scroller({ dateFormat:'yy-mm-dd',preset: 'date'});
			$('#add_cage_form').submit(function(){
				debug($(this).serialize());
				var start_date = $('#date1').attr('value');
				debug('start date is ' + start_date);
				if (start_date) {
					var url = MOUSE.url + '?add_cage=1&' + $(this).serialize() + '&isolator_id=' + isolator_id;
					debug('url is ' + url);
					$.getJSON(url, function(result) {
						if (result.success) {
							MyAppRouter.navigate("");
							MyAppRouter.navigate("#isolator?" + isolator_id, {trigger:true});
						}
						else
							$('#error_pane').html('<b>Error:</b> could not add cage (' + result.error + ')');
						
					});
					
				}
				else {
					$('#error_pane').html('<b>Error:</b> must enter start date');
				}
				
				return false;
			});
		}

		function add_isolator($pane, MOUSE, exists) {
			var html='';
			html += '<form id="add_isolator_form">';
//			html += write_radio('isolatorSize', 'Isolator Size',
 //                               [['isolatorLarge','large','Large'],['isolatorMedium','medium','Medium'],['isolatorSmall','small','Small','checked']]);
			html += '<div data-role="fieldcontain">' + 
				'<label for="admin"><b>Isolator Description<b>&nbsp;</label>';
//				add_isolator($pane, MOUSE, {'isolator_id':isolator_info[0],isolator_description:isolator_info[1],isolator_administrator:isolator_info[2]}});
			if (exists && exists.isolator_description)
				html += "<textarea name='isolatorDesc'>" + exists.isolator_description +  "</textarea></div>";
			else 
				html += "<textarea name='isolatorDesc'></textarea></div>";

			html += '<div data-role="fieldcontain">' + 
				'<label for="admin"><b>Isolator Administrator<b>&nbsp;</label>';
			if (exists && exists.isolator_administrator)
				html += "<input type='text' name='admin' value='" + exists.isolator_administrator + "'></div>";
			else
				html += "<input type='text' name='admin'></div>";

			html += '<div id="error_pane"></div>';


			if (exists && exists.isolator_id)
				html += "<input type='hidden' name='isolator_id' value='" + exists.isolator_id + "'>";

			html += '<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button></form>';
//				debug('updating isolator');

			$pane.html(html).trigger('create');


//			$('#date1').scroller('destroy').scroller({ dateFormat:'yy-mm-dd',preset: 'date'});
			$('#add_isolator_form').submit(function(){
				debug($(this).serialize());
//				var start_date = $('#date1').attr('value');
//				debug('start date is ' + start_date);
//				if (start_date) {
					var url = MOUSE.url + '?add_isolator=1&' + $(this).serialize();
					debug('url is ' + url);
					$.getJSON(url, function(result) {
						if (result.success) {
							MyAppRouter.navigate("");
							MyAppRouter.navigate("#update", {trigger:true});
						}
						else
							$('#error_pane').html('<b>Error:</b> could not add isolator (' + result.error + ')');
						
					});
					
//				}
//				else {
//					$('#error_pane').html('<b>Error:</b> must enter start date');
//				}
				
				return false;
			});
		}
	}
})(jQuery);

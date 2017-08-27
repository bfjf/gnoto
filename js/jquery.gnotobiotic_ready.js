/*
	TO DO:

	DONE:
*/

// create closure
(function($) { // alias jQuery to name $
	// shared plugin variables	

	// BEGIN PLUGIN DEFINIATION
	$.fn.gnotobiotic_ready = function(options, $selector) {
		// MAIN FUNCTION, ITERATE OVER SUBMITTED OPTIONS FOR "each" DOM ELEMENT
		return this.each(function() {
			var $pane = $(this);
			var MOUSE = {
				url : 'mouse.php',
				pane_id : this.id
			};

			init_mouse_ready($pane, MOUSE);
		});
			

		/* PRIVATE FUNCTIONS */

		// private function for debugging
		function debug(text) {
			if (window.console && window.console.log)
				window.console.log(text);
  		};

		/* READY PAGE */


		// set up the basic interface and all of the controls
		function init_mouse_ready($pane, MOUSE) {
			var html = '';
			var url = MOUSE.url + "?get_available_mice=1";
			var have_wean = 0;
			var have_litter = 0;
			$.getJSON(url, function(result) {
				var mice = result.mice;
				var strains = result.strains;
				var genotypes = result.genotypes;
				var default_age = 5; // five weeks is target age
				var weeks_to_show = 4;
				var sexes_allowed = {male:0,female:0,undetermined:0};
				var strains_allowed = {};
				var genotypes_allowed = {};
				var cage_id_to_cage_num = result.cage_id_to_cage_num;
				MOUSE.types = result.types;
				html += '<h2>Mice ready for experimentation</h2>';
		        	html += '<div data-role="fieldcontain">' + 
					'<label for="slider">Target age in weeks: </label>' + 
			 		'<input type="range" name="age_in_weeks" id="age_in_weeks" value="' + default_age + '" min="0" max="100"  />' + 
				'</div>';

		        	html += '<div data-role="fieldcontain">' + 
					'<label for="slider">Limit to the next N weeks: </label>' + 
			 		'<input type="range" name="weeks_to_show" id="weeks_to_show" value="' + weeks_to_show + '" min="0" max="40"  />' + 
				'</div>';
				html += '<div  data-role="fieldcontain">' + 
						'<fieldset data-role="controlgroup" data-type="horizontal">' + 
						'<legend>Sex:</legend>' + 
						'<input type="checkbox" name="sex_male" id="sex_male" class="custom" />' +
						'<label for="sex_male">Male</label>' + 
						'<input type="checkbox" name="sex_female" id="sex_female" class="custom" />' +
						'<label for="sex_female">Female</label>' + 
						'<input type="checkbox" name="sex_undetermined" id="sex_undetermined" class="custom" />'+
						'<label for="sex_undetermined">Undetermined</label>' + 
			    		'</fieldset>' +
					'</div>';

                                  html += '<div data-role="fieldcontain">'+
                                        '<label for="select-choice-1" class="select">Choose strain(s):</label>' +
                                        '<select name="strains" id="strains" multiple="multiple" data-native-menu="false">';
                                  for (var i=0; i<strains.length; i++) {
                                         html += '<option value="' + strains[i] + '">' + strains[i] + '</option>';
//					debug('have strain ' + strains[i]);
                                  }
                                  html += '</select></div>';


                                  html += '<div data-role="fieldcontain">'+
                                        '<label for="select-choice-1" class="select">Choose genotype(s):</label>' +
                                        '<select name="genotypes" id="genotypes" multiple="multiple" data-native-menu="false">';
                                  for (var i=0; i<genotypes.length; i++) {
                                         html += '<option value="' + genotypes[i] + '">' + genotypes[i] + '</option>';
                                  }
                                  html += '</select></div>';

                                  var type_options = [];
                                  for (var i=0; i<MOUSE.types.length; i++) {
                                      type_options.push(MOUSE.types[i])
                                  }
       //                           html += write_select('Quick assign', 'quick_type_assign', 'quick_type_assign', type_options, 0, 0, type_options);
                                  MOUSE.quick_type_assign = type_options[0];
                                 html += write_select('Quick assign', 'quick_type_assign', 'quick_type_assign', type_options, 0, 0, type_options);

				html += '<div id="mice_available"></div>';
				html += '<div id="assigned_mice"></div>';

				$pane.html(html).trigger('create');

				create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);

				$('#strains').change(function() {
					var s = $('#strains').val();	
					for (var i=0; i<s.length; i++) {
//						debug('have strain ' + i + ' ' + s[i]);
						strains_allowed[s[i]]=1;
					}
					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
				});
				$('#genotypes').change(function() {
					var g = $('#genotypes').val();	
					if (g) {
						for (var i=0; i<g.length; i++) {
							debug('have genotype ' + i + ' ' + g[i]);
							genotypes_allowed[g[i]]=1;
						}
					}
					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
				});
				$('#sex_male').change(function() {
					if ( $('#sex_male:checked').val())
						sexes_allowed.male=1;
					else
						sexes_allowed.male=0;

					//debug('male now ' + sexes_allowed.male);
					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
				});
				$('#sex_female').change(function() {
					if ( $('#sex_female:checked').val())
						sexes_allowed.female=1;
					else
						sexes_allowed.female=0;

					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
				});
				$('#sex_undetermined').change(function() {
					if ( $('#sex_undetermined:checked').val())
						sexes_allowed.undetermined=1;
					else
						sexes_allowed.undetermined=0;

					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
				});

                                $('#age_in_weeks').change(function(e,passed) {
                                        default_age = $('#age_in_weeks').val();

					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
                                });
                                $('#weeks_to_show').change(function(e,passed) {
                                        weeks_to_show = $('#weeks_to_show').val();

					create_mice_available_table(MOUSE, mice, $('#mice_available'), weeks_to_show, default_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num);
                                });
				$('#quick_type_assign').change(function(e,passed) {
					var assign_type = $('#quick_type_assign').val();
					MOUSE.quick_type_assign = assign_type;   
					$('.assign_type').text(assign_type); 
				});




				if (MOUSE.callback) {
					MOUSE.callback();
					MOUSE.callback = undefined;
				}
			});
//			$pane.html('to do page').trigger('create');
		}
		function create_mice_available_table_old(MOUSE, mice, $pane, weeks_to_show, target_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num) {
			var weeks = target_age;
			var target_weeks_in_milliseconds = weeks * 7 * 24 * 60* 60 *1000;
                        var now = new Date();
			var now_milliseconds = now.getTime();

			var sex_to_abbrev = {male:'M',female:'F',undetermined:'U'};
			var unique_sets = {};
			var key_sort = {};
			var unique_row_count = 0;
			var mice_fitting_criteria = 0;

			for (var i=0; i<mice.length; i++) {
				var birth = mice[i][2]*1000;
                                var birth_date = new Date(birth);
                                var monthb = birth_date.getMonth()+1;
                                var dateb_ = birth_date.getDate();
                                var birth_format = birth_date.getFullYear() + '-' + monthb + '-' + dateb_;

				var age_in_weeks = (now_milliseconds - birth_date) / 1000 / 60 / 60 / 24 / 7;
				age_in_weeks = age_in_weeks.toFixed(1);

				var wean = mice[i][3]*1000;
				var wean_format = '-';
				if (wean) {
	                                var wean_date = new Date(wean);
                                	var monthw = birth_date.getMonth()+1;
                                	var datew_ = birth_date.getDate();
                                	wean_format = wean_date.getFullYear() + '-' + monthw + '-' + datew_;
				}

				var target = birth + target_weeks_in_milliseconds;
                                var target_date = new Date(target);
				var targetm = target_date.getMonth()+1;
                               	var target_format = target_date.getFullYear() + '-' + targetm + '-' + target_date.getDate();
				var target_wks_from_now = (target - now_milliseconds)/1000/60/60/24/7;
				target_wks_from_now = target_wks_from_now.toFixed(1);
				var target_days_from_now = (target - now_milliseconds)/1000/60/60/24;
				target_days_from_now = target_days_from_now.toFixed(1);
				var max_time_ago = -4; // don't show mice > 4 weeks ago

				if (target_days_from_now/7 < weeks_to_show && sexes_allowed[mice[i][1]] && strains_allowed[mice[i][4]] && genotypes_allowed[mice[i][5]] && target_wks_from_now > max_time_ago) {
//				html += '<tr>';

					var text = '</td><td>' + sex_to_abbrev[mice[i][1]] + '</td><td>' + age_in_weeks + '</td><td>' + target_format + '</td>';


                                        if (target_days_from_now < 0)
						text += '<td class="highlight">'+target_wks_from_now;
					else
						text += '<td>'+target_wks_from_now;

//					text +=  '</td><td>' //+ birth_format + 
					text +=	'</td><td>' + mice[i][4] + '</td><td>' + mice[i][5] + '</td><td>' + cage_id_to_cage_num[mice[i][6]] + '</td><td>' + mice[i][7] + '</td>';
//						'</td><td>' + mice[i][4] + '</td><td>' + mice[i][5] + '</td><td>' + 'hello how are you' + '</td><td>' + mice[i][7] + '</td>';
//						'</td><td align="center">' + wean_format + '</td><td>' + mice[i][4] + '</td><td>' + mice[i][5] + '</td><td>' + mice[i][6] + '</td><td>' + mice[i][7] + '</td>';
	
					if (!unique_sets[text]) {
						unique_sets[text] = [];
						key_sort[text] = unique_row_count++;
					}
					unique_sets[text].push(mice[i][0]);
					
					mice_fitting_criteria++;
				}
//				html += '</tr>';
				 //         m.mouse_id, sex, birth_date, wean_date, strain, genotype, m.cage_id, c.isolator_id 

//				html += '</tr>';
			}
			var sorted_sets = sort_keys(key_sort,1);
			
			if (sorted_sets.length) {
				var html = '<h2>' + mice_fitting_criteria + ' mice passing current criteria</h2>';
				html += '<table>';
//				html += '<tr><th>NumMice</th><th>MouseIds</th><th>Sex</th><th>Age (wks)</th><th>TargetDate</th><th>DaysToTarget</th><th>BirthDate</th><th>WeanDate</th><th>Strain</th><th>Genotype</th><th>CageId</th><th>IsolatorId</th></tr>';
				html += '<tr><th>NumMice</th><th>MouseIds</th><th>Sex</th><th>Age (wks)</th><th>TargetDate</th><th>WeeksToTarget</th><th>Strain</th><th>Genotype</th><th>CageId</th><th>IsolatorId</th></tr>';
				for (var i=0; i<sorted_sets.length; i++) {
					var set = sorted_sets[i];
					var mouse_ids = unique_sets[set].join(',');
					var num_mice = unique_sets[set].length;
					html += '<tr><td>' + num_mice + '</td><td>' + mouse_ids + set;
				}
				html += '</table>';
				
			}
			else {
				var html = '<h2>No mice passing current criteria</h2>';
				html += '<p>make sure to include at least one sex, strain, and genotype</p>';
			}

			$pane.html(html).trigger('create');
		}
		function create_mice_available_table(MOUSE, mice, $pane, weeks_to_show, target_age, sexes_allowed, strains_allowed, genotypes_allowed, cage_id_to_cage_num) {
			var weeks = target_age;
			var target_weeks_in_milliseconds = weeks * 7 * 24 * 60* 60 *1000;
                        var now = new Date();
			var now_milliseconds = now.getTime();

			var sex_to_abbrev = {male:'M',female:'F',undetermined:'U'};
			var unique_sets = {};
			var key_sort = {};
			var unique_row_count = 0;
			var mice_fitting_criteria = 0;

			debug('hello');
			var text = "";
			for (var i=0; i<mice.length; i++) {
				var birth = mice[i][2]*1000;
                                var birth_date = new Date(birth);
                                var monthb = birth_date.getMonth()+1;
                                var dateb_ = birth_date.getDate();
                                var birth_format = birth_date.getFullYear() + '-' + monthb + '-' + dateb_;

				var age_in_weeks = (now_milliseconds - birth_date) / 1000 / 60 / 60 / 24 / 7;
				age_in_weeks = age_in_weeks.toFixed(1);

				var wean = mice[i][3]*1000;
				var wean_format = '-';
				if (wean) {
	                                var wean_date = new Date(wean);
                                	var monthw = birth_date.getMonth()+1;
                                	var datew_ = birth_date.getDate();
                                	wean_format = wean_date.getFullYear() + '-' + monthw + '-' + datew_;
				}

				var target = birth + target_weeks_in_milliseconds;
                                var target_date = new Date(target);
				var targetm = target_date.getMonth()+1;
                               	var target_format = target_date.getFullYear() + '-' + targetm + '-' + target_date.getDate();
				var target_wks_from_now = (target - now_milliseconds)/1000/60/60/24/7;
				target_wks_from_now = target_wks_from_now.toFixed(1);
				var target_days_from_now = (target - now_milliseconds)/1000/60/60/24;
				target_days_from_now = target_days_from_now.toFixed(1);
				var max_time_ago = -4; // don't show mice > 4 weeks ago

				if (target_days_from_now/7 < weeks_to_show && sexes_allowed[mice[i][1]] && strains_allowed[mice[i][4]] && genotypes_allowed[mice[i][5]] && target_wks_from_now > max_time_ago) {
//				html += '<tr>';

					text += '<tr><td>' + mice[i][0] + '</td>';
					text += '</td><td>' + sex_to_abbrev[mice[i][1]] + '</td><td>' + age_in_weeks + '</td><td>' + target_format + '</td>';


                                        if (target_days_from_now < 0)
						text += '<td class="highlight">'+target_wks_from_now;
					else
						text += '<td>'+target_wks_from_now;

//					text +=  '</td><td>' //+ birth_format + 
					text +=  '</td><td><span id="'+ mice[i][0]+ 'assign_type">'  + mice[i][8] + '</span></td>';
					text +=	'<td>' + mice[i][4] + '</td><td>' + mice[i][5] + '</td><td>' + mice[i][7] +  '</td><td>' + cage_id_to_cage_num[mice[i][6]] + '</td>';
//						'</td><td>' + mice[i][4] + '</td><td>' + mice[i][5] + '</td><td>' + 'hello how are you' + '</td><td>' + mice[i][7] + '</td>';
//						'</td><td align="center">' + wean_format + '</td><td>' + mice[i][4] + '</td><td>' + mice[i][5] + '</td><td>' + mice[i][6] + '</td><td>' + mice[i][7] + '</td>';
					text +=  '<td>';
					text +=  '<a class="quick_type_assign" id="' + mice[i][0]  + '" data-mini="true" href="#" data-inline="true" data-icon="action" data-role="button"><span class="assign_type">' + MOUSE.quick_type_assign + '</span></a>';
					text +=  '</td>';
					text += "</tr>";
					mice_fitting_criteria++;
				}
	
			}

			if (mice_fitting_criteria) {
				html += '<table>';
				html += '<tr><th>Id</th><th>Sex</th><th>Age (wks)</th><th>TargetDate</th><th>WeeksToTarget</th><th>Type</th><th>Strain</th><th>Genotype</th><th>Isolator</th><th>Cage</th><th>&nbsp;</th></tr>';
				html += text;
				html += '</table>';
				
				$pane.html(html).trigger('create');
				$('.quick_type_assign').click(function() {
					var mouse_id = this.id;
					var assign_type = MOUSE.quick_type_assign;
					debug('assigning ' + mouse_id + ' to ' + assign_type);
					var url_type_assign = MOUSE.url + "?assign_type_mouse=1" + "&mouseId=" + mouse_id + "&assign_type=" + assign_type;
					$('#' + mouse_id + 'assign_type').text(assign_type);
					$.getJSON(url_type_assign, function(res2) { // update the database then update the interface
						if (res2.success) {
							$('#mouseRow' + mouse_id + 'assign_type').text(assign_type);
						}
						else {
							debug('error: unable to load with url ' + url_type_assign);
						}
					});


					return false;
				});
			}
			else {
				var html = '<h2>No mice passing current criteria</h2>';
				html += '<p>make sure to include at least one sex, strain, and genotype</p>';
				$pane.html(html).trigger('create');
			}

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
	}
})(jQuery);

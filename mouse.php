<?php
error_reporting(E_ERROR | E_PARSE);

$SITE_ROOT = "http://gnoto.mssm.edu/";

# connect to the database
$db_name = "mouse.db";
#	$db = SQLite3::open($db_name);
class MyDB extends SQLite3
{
    function __construct()
    {
#        $this->open('mouse.db');
        $this->open('mouse.db',SQLITE3_OPEN_READWRITE);
    }
}

$db = new MyDB();

# handle request
if ($_GET['add_isolator']) {
	$JSON = add_isolator($db);
	echo json_encode($JSON);
}
elseif ($_GET['add_cage']) {
	$JSON = add_cage($db);
	echo json_encode($JSON);
}
elseif ($_GET['add_note']) {
	$JSON = add_note($db);
	echo json_encode($JSON);
}
elseif ($_GET['add_mice']) {
	$JSON = add_mice($db);
	echo json_encode($JSON);
}
elseif ($_GET['edit_mouse']) {
	$JSON = edit_mouse($db);
	echo json_encode($JSON);
}
elseif ($_GET['get_isolators']) {
	$JSON = get_isolators($db);
	echo json_encode($JSON);
}
elseif ($_GET['get_cages']) {
	$JSON = get_cages($db);
	echo json_encode($JSON);
}
elseif ($_GET['get_mouse']) {
	$JSON = get_mouse($db);
	echo json_encode($JSON);
}
elseif ($_GET['show_tables']) {
	show_tables($db);
}
elseif ($_GET['to_do']) {
	$JSON = to_do($db);
	echo json_encode($JSON);
}
elseif ($_GET['get_available_mice']) {
	$JSON = get_available_mice($db);
	echo json_encode($JSON);
}
elseif ($_GET['qr_codes']) {
	write_qr_codes($db);
}
elseif ($_GET['morgue']) {
	$JSON = get_deceased_mice($db);
	echo json_encode($JSON);
}
elseif ($_GET['revive_mouse']) {
	revive_mouse($db);
}
elseif ($_GET['cull_mouse']) {
	cull_mouse($db);
}
//elseif ($_GET['quick_mouse_edit']) {
//	quick_mouse_edit($db);
//}


function edit_mouse($db) {
	$results = array();
	$mouse_id = 0;

	if ($_GET['mouseId']) {
		$mouse_id=$_GET['mouseId'];
	}
	else {
		$results['error'] = "a mouse id must be provided";

		return $results;
	}

	if ($mouseSex = $_GET['mouseSex']) {
		$update = "UPDATE mouse set sex='" . $mouseSex . "' where mouse_id=$mouse_id";
#		$results['debug'] = "query is "  . $update;
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($mouseType = $_GET['mouseType']) {
		$update = "UPDATE mouse set mouse_type='" . $mouseType . "' where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse type: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($mouseGenotype = $_GET['mouseGenotype']) {
		$update = "UPDATE mouse set genotype='" . $mouseGenotype . "' where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($mouseStrain = $_GET['mouseStrain']) {
		$update = "UPDATE mouse set strain='" . $mouseStrain . "' where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($deathType = $_GET['death_type']) {
		$update = "UPDATE mouse set death_type='" . $deathType . "' where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($_GET['birth_date']) {
		$birthDate = strtotime($_GET['birth_date']);
		$update = "UPDATE mouse set birth_date=$birthDate where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($_GET['wean_date']) {
		$weanDate = strtotime($_GET['wean_date']);
		$update = "UPDATE mouse set wean_date=$weanDate where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($_GET['death_date']) {
		$deathDate = strtotime($_GET['death_date']);
		$update = "UPDATE mouse set death_date=$deathDate where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	if ($cageId = $_GET['cage_select']) {
		$update = "UPDATE mouse set cage_id=$cageId where mouse_id=$mouse_id";
		$ok = $db->exec($update);
		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
	}
	#if ($mouseStrain = $_GET['mouseGenotype']) {
#		$update = "UPDATE mouse set genotype='" . $mouseStrain . "' where mouse_id=$mouse_id";
	#	$ok = $db->exec($update);
#		if (!$ok) { $results['error'] =  "Error inserting mouse sex: " . $db->lastErrorMsg() . "<BR>query: $update<BR>"; return $results;}
#	}#

#

	$results['success']=1;

	return $results;
}

function add_mice($db) {
	$results = array();
	$mouseSex = $_GET['mouseSex'];
	$mouseType = $_GET['mouseType'];
	$birthDate = strtotime($_GET['birth_date']);
	$strain = $_GET['strain'];
	$genotype = $_GET['genotype'];
	$cageId = $_GET['cage_id'];
	$num_mice = $_GET['num_mice'];
	$wean_date = 0;
	$death_date = 0;
	$death_type = '';

	$parents = get_parents($db, $cageId);

	if (!$birthDate) { $results['error'] =  "Error: a birth date must be provided."; return $results; }


	$insert = "INSERT INTO mouse VALUES(null, '$mouseSex', $birthDate, $wean_date, $death_date, '$death_type', '$mouseType', '$strain', '$genotype', $cageId)";
#	$insertParents = "INSERT INTO mouse_to_parents VALUE(";
	
#	$num_parent = count($parents);
#	echo "parents are " . count($parents);	

	for ($i=0; $i<$num_mice; $i++) {
		$ok = $db->exec($insert);
		if (!$ok) { $results['error'] =  "Error inserting mouse: " . $db->lastErrorMsg() . "<BR>query: $insert<BR>"; return $results; }
		else { $results['success']=1; }
		$new_mouse_id = $db->lastInsertRowID();

		for ($j=0; $j<count($parents); $j++) {
			$parent_id = $parents[$j];
			$insert_stmt = "INSERT INTO mouse_to_parent VALUES($new_mouse_id,$parent_id)";
			$ok = $db->exec($insert_stmt);
#			echo "$insert_stmt";
			if (!$ok) { $results['error'] =  "Error inserting parents: " . $db->lastErrorMsg() . "<BR>query: $insert<BR>"; return $result;}
			else { $results['success']=1; }
		}
#		echo "id is $id";
	}
#(mouse_id integer PRIMARY KEY,
# mouse_sex text, /*('male', 'female','?'), */
# birth_date integer NOT NULL,
# wean_date integer,
# death_date integer,
# death_type text, /*ENUM('sacrifice', 'parental neglect','unknown'), */
# mouse_type text, /*('breeder', 'experimental'), */
# genotype text, /*varchar(255), */
# strain_name integer);
# cage_id


# mouse_to_parent
#(mouse_id integer,
# parent_id integer,


	return $results;
}

function revive_mouse($db) {
	$mouse_id = $_GET['mouse_id'];
	$result = $db->query("UPDATE mouse set death_date = 0 where mouse_id=$mouse_id");
}

function cull_mouse($db) {
	$mouse_id = $_GET['mouse_id'];
	$death_type = "sacrifice";
	$death_date = time();
#	echo "UPDATE mouse set death_date=$death_date, death_type=$death_type, sex=$mouse_sex where mouse_id=$mouse_id";
	if ($_GET['mouse_sex']) {
		$mouse_sex = $_GET['mouse_sex'];
		$result = $db->query("UPDATE mouse set death_date=$death_date, death_type='$death_type', sex='$mouse_sex' where mouse_id=$mouse_id");
	}
	else {
		$result = $db->query("UPDATE mouse set death_date=$death_date, death_type='$death_type' where mouse_id=$mouse_id");
	}
}


function get_deceased_mice($db) {
	$result = $db->query("SELECT mouse.*, isolator_id FROM mouse, cage WHERE death_date!=0 AND mouse.cage_id=cage.cage_id ORDER BY death_date DESC");
	$results = array();
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		if ($row[2]) { $row[2] = date('Y-n-d',$row[2]); }
		if ($row[3]) { $row[3] = date('Y-n-d',$row[3]); }
		if ($row[4]) { $row[4] = date('Y-n-d',$row[4]); }
		$results[] = $row;
	}
	return $results;

}

function get_mouse($db) {
//	$results = array();
	$mouse_id = $_GET['mouse_id'];
	$result = $db->query("SELECT * FROM mouse WHERE mouse_id=$mouse_id");
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		$results = $row;
	}
	return $results;
}

function get_parents($db, $cageId) {
	$parents = array();
	# we assume that all of the breeders in the new mouse's cage are its parents
	$result = $db->query("SELECT mouse_id FROM mouse WHERE cage_id=$cageId AND mouse_type='breeder'");
	while($row = $result->fetchArray(SQLITE3_NUM)) {
#		echo "have parent $row[0] in cage $cageId";
		$parents[] = $row[0];
	}
	
	return $parents;
}

function add_note($db) {
	$id = $_GET['id'];
	$id_type =  $_GET['id_type'];
#	$note = '"' . addslashes($_GET['note']) . '"';
	$note =  $_GET['note'];
	$note = SQLite3::escapeString($note);
	$now = time();

	$insert = "INSERT INTO note VALUES($id, '$id_type', '$note', $now);";
	$ok = $db->exec($insert);
	if (!$ok) { $results['error'] =  "Error inserting: " . $db->lastErrorMsg() . "[" . $insert . "]<BR>"; }
	else { $results['success']=$now; }

	return $results;
}

function add_cage($db) {
	$results = array();
	$start_date = strtotime($_GET['start_date']);
#	$cageType = $_GET['cageType'];
#	$cageSize = $_GET['cageSize'];
	$isolatorId = $_GET['isolator_id'];

	$insert = "INSERT INTO cage VALUES(null, $isolatorId, $start_date,0);";

	$ok = $db->exec($insert);
	if (!$ok) { $results['error'] =  "Error inserting: " . $db->lastErrorMsg() . "<BR>"; }
	else { $results['success']=1; }
#(cage_id integer primary key,
# isolator_id integer,
# cage_size text, /*ENUM('small','medium','large'), */
# cage_type text, /*ENUM('breeder','experimental'), */
# start_date integer,
# end_date integer,

	return $results;
}

function add_isolator($db) {
	$results = array();
#	$start_date = strtotime($_GET['start_date']);
	$start_date = 0;
#	$isolatorType = $_GET['isolatorType'];
	$isolatorDescription = $_GET['isolatorDesc'];
	$administrator = $_GET['admin'];
	$isolatorDescription = SQLite3::escapeString($isolatorDescription);
	$administrator = SQLite3::escapeString($administrator);
#(isolator_id integer primary key,
# isolator_size text, /* small, medium, large */
# start_date integer,
# end_date integer
	$insert = "";
	if ($_GET['isolator_id']) {
		$isolator_id=$_GET['isolator_id'];
		#BLAH
		$insert = "UPDATE isolator set isolator_description='$isolatorDescription',administrator='$administrator' where isolator_id=$isolator_id";
#		$result = $db->query("UPDATE mouse set death_date=$death_date, death_type='$death_type', sex='$mouse_sex' where mouse_id=$mouse_id");
	}
	else {
		$insert = "INSERT INTO isolator VALUES(null, '$isolatorDescription', '$administrator', $start_date, 0);";
	}
	$ok = $db->exec($insert);
	if (!$ok) { $results['error'] =  "Error inserting: " . $db->lastErrorMsg() . " [$insert]<BR>"; }
	else { $results['success']=1; }

	return $results;
}

function to_do($db) {
	$results = array();
	$query="SELECT mouse_id, mouse.cage_id, isolator_id, birth_date FROM mouse, cage WHERE wean_date=0 AND mouse.cage_id=cage.cage_id AND death_date=0 ORDER BY birth_date";
#	echo "running $query";
	$result = $db->query($query);
	while($row = $result->fetchArray(SQLITE3_NUM)) {
	#	$row[4] = date('Y-n-d',$row[3]);
		$results['not_weaned'][] = $row;
	}

	$query2 = "select DISTINCT(m.birth_date), p.cage_id, c.isolator_id from mouse m, mouse p, cage c, mouse_to_parent WHERE mouse_to_parent.parent_id=p.mouse_id AND mouse_to_parent.mouse_id=m.mouse_id AND c.cage_id=p.cage_id AND p.death_date=0";
	$result2 = $db->query($query2);
	while($row = $result2->fetchArray(SQLITE3_NUM)) {
#		$row[4] = date('Y-n-d',$row[3]);
		$results['litter_due'][] = $row;
	}


	return $results;
}

function get_cages($db) {
	$isolator_id = $_GET['isolator_id'];
	$results = array();
	$result = $db->query("SELECT * FROM cage WHERE isolator_id=$isolator_id");
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		if ($row[4]) {
			$row[4] = date('Y-n-d',$row[4]);
		}
		if ($row[5]) {
			$row[5] = date('Y-n-d',$row[5]);
		}

		$results['cage'][] = $row;

		# mouse referenced by cage id
#		echo "mouse info for cage id $row[0]";
		$results['mice'][$row[0]] = get_mouse_info($db, $row[0]);
	}

	$result2 = $db->query('SELECT strain_name FROM strain');
	while($row = $result2->fetchArray(SQLITE3_NUM)) {
		$results['strains'][] = $row;
	}

	$result3 = $db->query('SELECT genotype_name FROM genotype');
	while($row = $result3->fetchArray(SQLITE3_NUM)) {
		$results['genotypes'][] = $row;
	}

	$result4 = $db->query('SELECT cage_id, isolator_id FROM cage ORDER BY isolator_id, cage_id');
	while($row = $result4->fetchArray(SQLITE3_NUM)) {
		$results['cages'][] = $row;
	}
#	$results['cage_productivity'] = get_cage_productivity($results['cages']);

	$result5 = $db->query("SELECT * FROM isolator WHERE isolator_id=$isolator_id");
	while($row = $result5->fetchArray(SQLITE3_NUM)) {
		$results['isolator_info'] = $row;
	}

	$result6 = $db->query("SELECT note_date, note FROM note WHERE id_type='isolator' AND id=$isolator_id ORDER BY note_date DESC");
#	echo "SELECT note_date, note FROM notes WHERE id_type='isolator' AND id=$isolator_id ORDER BY note_date";
	while($row = $result6->fetchArray(SQLITE3_NUM)) {
		$results['isolator_notes'][] = $row;
	}

	$results['isolator_productivity'] = get_isolator_productivity($isolator_id, $db);
	

	return $results;
}

function get_isolator_productivity($isolator_id, $db) {

	$first = 0;
	$results = array();
	$temp_results = array();

	
	$min_survival_to_include = 1; # only keep mice that survive at least 1 week
	$query = "select (death_date-birth_date)/60/60/24/7, birth_date, death_date from mouse m, cage c where c.isolator_id=$isolator_id AND c.cage_id=m.cage_id ORDER BY birth_date";
	$result = $db->query($query);
	$now = time();
	$time_window = 21; # how many days to put in a block
	$time_alive_weeks;
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		$time_alive = $row[0];

		if ($row[2] == 0) { # mouse not dead
			$time_alive_weeks = ($now-$row[1])/60/60/24/7;
			$time_alive = ($now-$row[1])/60/60/24/$time_window;
		}

		if ($time_alive_weeks > $min_survival_to_include) {
			$round_to_week = round($row[1]/60/60/24/$time_window);
			$round_to_week *= 60*60*24*$time_window;
			$temp_result[$round_to_week]++;
		}
	}

	# don't forget to include the children that have left
	$query = "select (m.death_date-m.birth_date)/60/60/24/7, m.birth_date, m.death_date, m.mouse_id, m2.mouse_id, m.cage_id, m2.cage_id from mouse m, mouse m2, mouse_to_parent mtp, cage c2, cage c1 WHERE m.mouse_id=mtp.mouse_id AND mtp.parent_id=m2.mouse_id AND m2.cage_id=c2.cage_id AND c2.isolator_id=$isolator_id AND m.cage_id=c1.cage_id AND c1.isolator_id=0";
	$result = $db->query($query);
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		$time_alive = $row[0];

		if ($row[2] == 0) { # mouse not dead
			$time_alive = ($now-$row[1])/60/60/24/$time_window;
		}

		if ($time_alive > $min_survival_to_include) {
			$round_to_week = round($row[1]/60/60/24/$time_window);
			$round_to_week *= 60*60*24*$time_window;
			$temp_result[$round_to_week]++;
		}

		#if ($row[0] > 1) {
	#		$round_to_week = floor($row[1]/60/60/24/14);
#			$round_to_week *= 60*60*24*14;
#		#	echo "P $row[0]   $row[1] $round_to_week<BR>";
#			$temp_result[$round_to_week]++;
#		}
	}

#	$query = "select ($now-death_date)/60/60/24/7, birth_date from mouse m, cage c where death_date=0 AND c.isolator_id=$isolator_id AND c.cage_id=m.cage_id ORDER BY birth_date";
#	echo $query;
#	$result = $db->query($query);
#	while($row = $result->fetchArray(SQLITE3_NUM)) {
#		if ($row[0] > 1) {
#			$round_to_week = floor($row[1]/60/60/24/14);
#			$round_to_week *= 60*60*24*14;
#		#	echo "P $row[0]   $row[1] $round_to_week<BR>";
#			$temp_result[$round_to_week]++;
#		}
#	}
#
	ksort($temp_result);

	foreach ($temp_result as $time => $num) {
		$results[] = array($time,$num);
	}

	return $results;
}

function get_mouse_info($db, $cage_id) {
	$results = array();
	$query = "SELECT * FROM mouse WHERE cage_id=$cage_id AND death_date=0";
#	echo "query is $query";
	$result = $db->query($query);
	
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		$row[10] = $row[2];
		if ($row[2]) { $row[2] = date('Y-n-d',$row[2]); }
		if ($row[3]) { $row[3] = date('Y-n-d',$row[3]); }
		if ($row[4]) { $row[4] = date('Y-n-d',$row[4]); }
		
		
		$results[] = $row;
	}

	return $results;
}

function get_available_mice($db) {
	$results = array();

	$result = $db->query("SELECT m.mouse_id, sex, birth_date, wean_date, strain, genotype, m.cage_id, c.isolator_id FROM mouse m, cage c where m.cage_id=c.cage_id AND m.death_date=0 AND m.mouse_type='experimental'");
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		$results['mice'][] = $row;
	}

	$result2 = $db->query('SELECT strain_name FROM strain');
	while($row = $result2->fetchArray(SQLITE3_NUM)) {
		$results['strains'][] = $row;
	}
	$result3 = $db->query('SELECT genotype_name FROM genotype');
	while($row = $result3->fetchArray(SQLITE3_NUM)) {
		$results['genotypes'][] = $row;
	}

	return $results;
}


function write_qr_codes($db) {
	$result = $db->query('SELECT * FROM isolator');
	global $SITE_ROOT;


	while($row = $result->fetchArray(SQLITE3_NUM)) {
#		if ($row[2]) {
#			$row[2] = date('Y-n-d',$row[2]);
#		}
		if (!$row[3]) { # isolator not closed down
			$google_url = 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=';
			$qr_url = $SITE_ROOT . "#isolator?$row[0]";
			$google_url .= urlencode($qr_url);
#			echo "<hr /><h1>Isolator $row[0]</h1><h3>Start-date: $row[2]</h3>";
			echo "<hr style='clear:left' /><div style='float:left;'><h1>Isolator $row[0]</h1><h3>Administrator: $row[2]</h3></div><div style='float:left;'><img style='float:left;' src='$google_url' /></div><hr style='clear:left' />";
#			echo "<hr style='clear:left' /><div style='float:left;'><h1>Isolator $row[0]</h1><h3>Administrator: TBD</h3><h3>Start date: $row[2]</h3></div><div style='float:left;'><img style='float:left;' src='$google_url' /></div><hr style='clear:left' />";
	#		echo "<hr style='clear:left' /><div style='float:left;'><h1>Isolator $row[0]</h1><h3>Start-date: $row[2]</h3></div><div style='float:left;'><img style='float:left;' src='$google_url' />$qr_url</div><hr style='clear:left' />";
		}
	}

}

function get_isolators($db) {
	$results = array();
	$result = $db->query('SELECT * FROM isolator');
	while($row = $result->fetchArray(SQLITE3_NUM)) {
		if ($row[2]) {
#			$row[2] = date('Y-n-d',$row[2]);
			$row[2] = date('Y-n-d',$row[2]);
		}
		if ($row[3]) {
			$row[3] = date('Y-n-d',$row[3]);
		}

		$results['isolators'][] = $row;
	}


	return $results;
}

function show_tables($db) {
	echo "<h2>Isolator Table</h2>";
	$result = $db->query('SELECT * FROM isolator');
	while($row = $result->fetchArray()) {
		$date = date('Y-n-d', $row[2]);
		echo "$row[0] $row[1] $row[2] $date $row[3]";
		echo "<BR>";
	}
	echo "<h2>Cage Table</h2>";
	$result = $db->query('SELECT * FROM cage');
	while($row = $result->fetchArray()) {
		$date = date('Y-n-d', $row[4]);
		echo "$row[0] $row[1] $row[2] $row[3] $date $row[5]";
		echo "<BR>";
	}
}

#$insert = "INSERT INTO isolator VALUES(null,'large', 2,2);";
#echo "inserting: $insert<BR>";
#$db->exec("INSERT INTO isolator VALUES(null,'large', 1,1)");
#$db->exec("INSERT INTO isolator VALUES(null,'small', 1,1)");
#$result = $db->query('SELECT * FROM isolator');
#while($row = $result->fetchArray()) {
#	echo "$row[0] $row[1] $row[2] $row[3]";
#	echo "<BR>";
#}
#	phpinfo()#;
?>

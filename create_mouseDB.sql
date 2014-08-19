/* CREATE_MOUSEDB.SQL */

/* Description:  A schema for the database holding mouse breeding data in a gnotobiotic facility
/* Authors:      faith
/* Date:  Thu Oct 20 14:36:25 CDT 2011

/* CREATE DATABASE MOUSEDB

/*
** add administrator to database (ID)
** add administrator table
** add cylinder table (cylinder, vendor, start-date)
** add cylinder_addition table (cylinderID, date, liquid/dry)
** add notes (ID (cage, mouse, isolator), type ("cage", "mouse", "isolator"), date, note (text))
** remove cage type
** what to do with isolator size (put 2ft, 3ft, 4ft, 6ft?)
*** replace with isolator description?
* place to remove cages; where? (in isolator?); only allow removal of empty cages; warn that cages will be renumbered!!!
*/


/*--------------------------------------------------------------------------
 MOUSE TABLE           				
 --------------------------------------------------------------------------*/
drop table if exists mouse;
create table mouse
(mouse_id integer PRIMARY KEY,
 sex text, /*('male', 'female','?'), */
 birth_date integer NOT NULL,
 wean_date integer,
 death_date integer,
 death_type text, /*ENUM('sacrifice', 'parental neglect','unknown'), */
 mouse_type text, /*('breeder', 'experimental'), */
 strain text,
 genotype text, /*varchar(255), */
 cage_id integer,
 FOREIGN KEY(cage_id) REFERENCES cage(cage_id)
);
create index mouse_a ON mouse(birth_date);
create index mouse_b ON mouse(cage_id);

drop table if exists cage;
create table cage
(cage_id integer primary key,
 isolator_id integer,
 start_date integer, 
 end_date integer,						   
 FOREIGN KEY(isolator_id) REFERENCES isolator(isolator_id)
);
create index cage_a ON cage(isolator_id);

drop table if exists isolator;
create table isolator
(isolator_id integer primary key,
 isolator_description text, /* vendor and size */
 administrator text, /* vendor and size */
 start_date integer,
 end_date integer
);

drop table if exists note;
create table note
(id integer,
 id_type text,
 note text,
 note_date integer
);

drop table if exists strain;
create table strain
(strain_name text NOT NULL UNIQUE/* small, medium, large */
);
insert into strain VALUES('C57BL/6J');
insert into strain VALUES('Swiss Webster');

drop table if exists genotype;
create table genotype
(genotype_name text NOT NULL UNIQUE /* small, medium, large */
);
insert into genotype VALUES('WT');
insert into genotype VALUES('unknown');

drop table if exists assignable;
create table assignable
(assign text NOT NULL UNIQUE /* small, medium, large */
);
insert into assignable VALUES('SL');
insert into assignable VALUES('JJF');
insert into assignable VALUES('MM');

/*drop table if exists mouse_to_cage;
create table mouse_to_cage
(mouse_id integer,
 cage_id integer,
 start_date integer,
 FOREIGN KEY(mouse_id) REFERENCES mouse(mouse_id),
 FOREIGN KEY(cage_id) REFERENCES cage(cage_id)
);
create index mouse_to_cage_a ON mouse_to_cage(mouse_id);
create index mouse_to_cage_b ON mouse_to_cage(cage_id);
*/

drop table if exists mouse_to_parent;
create table mouse_to_parent
(mouse_id integer NOT NULL,
 parent_id integer NOT NULL,
 FOREIGN KEY(mouse_id) REFERENCES mouse(mouse_id),
 FOREIGN KEY(parent_id) REFERENCES mouse(mouse_id)
);
create index mouse_to_parent_a ON mouse_to_parent(mouse_id);
create index mouse_to_parent_b ON mouse_to_parent(parent_id);


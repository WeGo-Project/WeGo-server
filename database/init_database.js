var mysql = require('mysql')

var dbclient = mysql.createConnection( {
    user: 'root',
    password: 'qweasdzxc'
});

dbclient.connect();

var DATABASE_NAME = 'wego';
dbclient.query('create database ' + DATABASE_NAME, function(err) {
    if (err) {
        console.error('Error in creating database %s: ' + JSON.stringify(err), DATABASE_NAME);
    }
});
dbclient.query('use manlvtu;', function(err) {
    if (err) {
        console.error('Error in creating table %s: ' + JSON.stringify(err), DATABASE_NAME);
    }
});
dbclient.query("create table if not exists user (\
    id integer primary key auto_increment,\
    username char(50) unique not null,\
    password char(50) not null);", function(err) {
    if (err) {
        console.error('Error in creating table %s: ' + JSON.stringify(err), 'user');
    }
});
dbclient.query("create table if not exists travel (\
    id integer primary key auto_increment,\
    userId integer,\
    name char(50),\
    foreign key (userId) references user(id));", function(err) {
    if (err) {
        console.error('Error in creating table %s: ' + JSON.stringify(err), 'travel');
        console.error(err);
    }
});
dbclient.query("create table if not exists travelItem (\
    id integer primary key auto_increment,\
    travelId integer,\
    label char(50),\
    time datetime,\
    locationLat float,\
    locationLng float,\
    m_like integer,\
    description text,\
    media text,\
    foreign key (travelId) references travel(id));", function(err) {
    if (err) {
        console.error('Error in creating table %s: ' + JSON.stringify(err), 'travelItem');
    }
});
dbclient.query("create table if not exists comment (\
    id integer primary key auto_increment,\
    userId integer,\
    travelItemId integer,\
    time datetime,\
    text text,\
    foreign key (userId) references user(id),\
    foreign key (travelItemId) references travelItem(id));", function(err) {
    if (err) {
        console.error('Error in creating table %s: ' + JSON.stringify(err), 'comment');
    }
});

dbclient.end();

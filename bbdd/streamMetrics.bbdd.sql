CREATE DATABASE streammetrics;
USE streammetrics;

CREATE TABLE users (
	id int auto_increment primary key,
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    created_at datetime default current_timestamp
);

CREATE TABLE titles (
	id int auto_increment primary key,
    name varchar(255) not null,
	type enum('movie', 'series') not null,
    year int,
    duration_min int,
    created_at datetime default current_timestamp
);

CREATE TABLE events (
	id int auto_increment primary key,
    user_id int not null,
    event_type varchar(100) not null,
    page varchar(255),
    title_id int,
    meta json,
    created_at datetime default current_timestamp,
    foreign key (user_id) references users(id),
    foreign key (title_id) references titles(id)
);

INSERT INTO titles (name, type, year, duration_min) VALUES
	('Inception', 'movie', 2010, 148),
    ('Interstellar', 'movie', 2014, 169),
    ('The Dark Knight', 'movie', 2008, 152),
    ('Stranger Things', 'series', 2016, null),
    ('Breaking Bad', 'series', 2008, null);

SELECT * FROM titles;


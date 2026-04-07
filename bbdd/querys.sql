use streammetrics;

INSERT INTO users (email, password_hash)
VALUES ('test@streammetrics.com', '123456');

select * from users;

select * from events;
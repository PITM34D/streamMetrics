use streammetrics;

INSERT INTO users (email, password_hash)
VALUES ('test@streammetrics.com', '123456');

INSERT INTO users (email, password_hash)
VALUES ('test2@streammetrics.com', '12345'), ('test3@streammetrics.com', '1234');

select * from users;

select * from events;

select id, email
from users;

SELECT DATE(created_at) AS day, COUNT(*) AS total
FROM events
GROUP BY day
ORDER BY day ASC;

SELECT id, created_at FROM events;

UPDATE events
SET created_at = '2026-04-06 12:00:00'
WHERE id IN (2,3,6);

UPDATE events
SET created_at = '2026-04-07 18:30:00'
WHERE id IN (7,8,9,10);

UPDATE events
SET created_at = '2026-04-08 18:30:00'
WHERE id IN (11,12,13,14);

UPDATE events
SET created_at = '2026-04-06 10:15:00'
WHERE id IN (16,17,18);

UPDATE events
SET created_at = '2026-04-07 18:40:00'
WHERE id IN (19,20,21);

UPDATE events
SET created_at = '2026-04-08 21:30:00'
WHERE id IN (22,23);

-- prueba git
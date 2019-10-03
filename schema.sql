create table users(
    id serial PRIMARY KEY,
    displayname VARCHAR(20) unique,
    highscore serial NOT NULL,
    password VARCHAR NOT NULL
)
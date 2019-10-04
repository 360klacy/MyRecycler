create table users(
    id serial PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(20) unique,
    password VARCHAR(20) NOT NULL,
    token VARCHAR(255) NOT NULL
);

create table orderTickets(
    id serial PRIMARY KEY
);

create table subCategories(
    id serial PRIMARY KEY,
    name VARCHAR NOT NULL,
    categoryparent varchar
)


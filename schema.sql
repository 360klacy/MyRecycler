create table users(
    id serial PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(20) unique,
    password VARCHAR(20) NOT NULL
)

create table companyTickets(
    id serial PRIMARY KEY,

)
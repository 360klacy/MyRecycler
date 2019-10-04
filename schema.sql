create table users(
    id serial PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(20) unique,
    password VARCHAR(20) NOT NULL,
    token VARCHAR(255) NOT NULL
);

create table orderTickets(
    id serial PRIMARY KEY,
    userid INTEGER NOT NULL
);

create table categories(
    id serial,
    cat_name VARCHAR,
    UNIQUE (cat_name), 
    PRIMARY KEY (id)
);

create table sub_categories(
    id serial,
    category_id INTEGER NOT NULL,
    sub_name VARCHAR NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);



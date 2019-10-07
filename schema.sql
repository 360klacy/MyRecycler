create table users(
    id serial PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(20) unique,
    password VARCHAR(20) NOT NULL,
    token VARCHAR(255) NOT NULL,
    is_company BOOLEAN DEFAULT false
);



create table order_tickets(
    id serial PRIMARY KEY,
    progress INTEGER,
    user_id INTEGER NOT NULL,
    company_id INTEGER,
    details VARCHAR,
    FOREIGN KEY (company_id) REFERENCES users(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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



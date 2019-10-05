INSERT into categories (cat_name)
VALUES ('automotive'),('plastic');

INSERT into sub_categories (sub_name,category_id)
VALUES ('carbattery', 1),('plastic bag',2),('tires',1);

INSERT INTO users (name, email, password, token)
VALUES ('kevin', 'kevin@gmail.com', '123', '321')
 INSERT into categories (cat_name)
VALUES ('automotive'),('batteries'),('construction'),('electronics'), ('furniture'), ('glass'), ('holiday'),('metal'), ('paint'), ('paper'), ('plastic');

INSERT into sub_categories (sub_name,category_id)
VALUES ('auto parts', 1),('tires',1),('gas/oil mixture',1),('car batteries', 2),('lithium batteries',2), ('zinc-air batteries',2),('yard waste',3),('weeds',3),('wood',3), ('phones',4), ('computer/laptops/tablets', 4), ('television',4), ('couch/chairs',5),('bed',5), ('dresser', 5), ('glass beverage container', 6), ('mirrors',6), ('glass table',6), ('chirstmas tree',7), ('ornaments',7), ('gift boxes',7), ('aluminum food cans', 8), ('cookware',8), ('washer/dryer',8), ('latex paint',9),('oil-based paint', 9), ('wood stains',9), ('news papers', 10), ('shredded paper',10), ('wrapping paper', 10), ('plastic bags', 11), ('plastic bottles',11), ('plastic cans',11);


INSERT INTO users (name, username, email, password, token)
VALUES ('kevin', 'kevin420', 'kevin@gmail.com', '123', '321');

INSERT INTO order_tickets (progress,user_id)
VALUES (2, 1);
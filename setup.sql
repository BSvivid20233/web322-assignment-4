
CREATE TABLE articles (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    author TEXT,
    published BOOLEAN,
    category TEXT
);

INSERT INTO articles (id, title, content, author, published, category) VALUES
(1, 'G.O.A.T TEAM INDIA', 'A WORLD CLASS TEAM WITH BEAST BATTER AND BOWLER', 'BhargavKumar Senjaliya', true, 'DREAM TEAM'),
(2, 'HISTORICAL TEAM ENGLAND', 'A COUNTRY TEAM WHO INVENTED THIS ROYAL GAME', 'BhargavKumar Senjaliya', true, 'A TEAM WHO TEACH THE WORLD HOW TO PLAY THIS GAME');



CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT
);

INSERT INTO categories (id, name) VALUES
(1, 'DREAM TEAM'),
(2, 'A TEAM WHO TEACH THE WORLD HOW TO PLAY THIS GAME');
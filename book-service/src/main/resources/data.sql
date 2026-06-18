-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES (1, 'Fiction', 'Romans et histoires fictives');
INSERT INTO categories (id, name, description) VALUES (2, 'Science', 'Livres scientifiques et techniques');
INSERT INTO categories (id, name, description) VALUES (3, 'Histoire', 'Livres d''histoire');
INSERT INTO categories (id, name, description) VALUES (4, 'Technologie', 'Livres sur la technologie et l''informatique');
INSERT INTO categories (id, name, description) VALUES (5, 'Philosophie', 'Livres de philosophie');

-- Insert sample books
INSERT INTO books (id, title, author, isbn, publisher, publication_date, category, total_copies, available_copies, description, image_url, status) 
VALUES (1, 'Le Petit Prince', 'Antoine de Saint-Exupéry', '978-0-156-01219-1', 'Gallimard', '1943-04-06', 'Fiction', 5, 5, 
'Un conte philosophique et poétique', 'https://via.placeholder.com/150', 'AVAILABLE');

INSERT INTO books (id, title, author, isbn, publisher, publication_date, category, total_copies, available_copies, description, image_url, status) 
VALUES (2, 'Clean Code', 'Robert C. Martin', '978-0-132-35088-4', 'Prentice Hall', '2008-08-01', 'Technologie', 3, 3, 
'Un guide pour écrire du code propre', 'https://via.placeholder.com/150', 'AVAILABLE');

INSERT INTO books (id, title, author, isbn, publisher, publication_date, category, total_copies, available_copies, description, image_url, status) 
VALUES (3, 'Une brève histoire du temps', 'Stephen Hawking', '978-0-553-10953-5', 'Bantam Books', '1988-04-01', 'Science', 4, 4, 
'Exploration de l''univers et du temps', 'https://via.placeholder.com/150', 'AVAILABLE');

INSERT INTO books (id, title, author, isbn, publisher, publication_date, category, total_copies, available_copies, description, image_url, status) 
VALUES (4, '1984', 'George Orwell', '978-0-452-28423-4', 'Secker & Warburg', '1949-06-08', 'Fiction', 6, 6, 
'Un roman dystopique classique', 'https://via.placeholder.com/150', 'AVAILABLE');

INSERT INTO books (id, title, author, isbn, publisher, publication_date, category, total_copies, available_copies, description, image_url, status) 
VALUES (5, 'Design Patterns', 'Gang of Four', '978-0-201-63361-0', 'Addison-Wesley', '1994-10-21', 'Technologie', 2, 2, 
'Patterns de conception orientée objet', 'https://via.placeholder.com/150', 'AVAILABLE');

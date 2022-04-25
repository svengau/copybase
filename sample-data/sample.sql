CREATE TABLE IF NOT EXISTS `posts` (
  `title` varchar(255) DEFAULT NULL,
  `user` int(11) DEFAULT 0
);

INSERT INTO posts (title, user) values ('test', 1);

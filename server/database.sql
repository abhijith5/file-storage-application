CREATE DATABASE perndb;

CREATE TABLE userdetails(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  userRole VARCHAR(255)
);

CREATE TABLE pdfdetails(
  id SERIAL PRIMARY KEY,
  userid VARCHAR(255),
  padfpath VARCHAR(255)
);
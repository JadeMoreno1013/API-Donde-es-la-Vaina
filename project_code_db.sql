CREATE DATABASE IF NOT EXISTS project_code_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE project_code_db;

-- is_admin = TRUE indica que el usuario es administrador.
-- La contraseña va en texto plano porque así lo pide el enunciado.
CREATE TABLE app_user (
  id_user           INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(45)  NOT NULL,
  last_name         VARCHAR(45)  NOT NULL,
  email             VARCHAR(100) NOT NULL,
  password          VARCHAR(255) NOT NULL,
  registration_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_admin          BOOLEAN      NOT NULL DEFAULT FALSE,
  CONSTRAINT uq_user_email UNIQUE (email)
);

CREATE TABLE venue (
  id_venue       INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  address        VARCHAR(150) NOT NULL,
  city           VARCHAR(45)  NOT NULL,
  venue_capacity INT          NOT NULL,
  CONSTRAINT uq_venue_name_city UNIQUE (name, city),
  CONSTRAINT ck_venue_capacity CHECK (venue_capacity > 0)
);

CREATE TABLE event (
  id_event          INT AUTO_INCREMENT PRIMARY KEY,
  venue_id          INT           NOT NULL,
  event_type        ENUM('concert','sports','theater') NOT NULL,
  name              VARCHAR(100)  NOT NULL,
  description       TEXT          NOT NULL,
  image_url         VARCHAR(255)  NULL,
  event_date        DATETIME      NOT NULL,
  status            ENUM('scheduled','finished','cancelled') NOT NULL DEFAULT 'scheduled',
  price_min         DECIMAL(10,2) NOT NULL,
  price_max         DECIMAL(10,2) NOT NULL,
  event_capacity    INT           NOT NULL,
  available_tickets INT           NOT NULL,
  CONSTRAINT fk_event_venue FOREIGN KEY (venue_id) REFERENCES venue (id_venue)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_event_prices    CHECK (price_min >= 0 AND price_max >= price_min),
  CONSTRAINT ck_event_capacity  CHECK (event_capacity > 0),
  CONSTRAINT ck_event_available CHECK (available_tickets >= 0 AND available_tickets <= event_capacity)
);

-- Datos propios de cada tipo de evento, guardados como JSON (1 a 1 con event).
-- Claves usadas: concert -> lineup, artist, time
--                sports  -> home_team, away_team, score
--                theater -> cast, performer, character, intermissions
CREATE TABLE event_info (
  id_event_info INT AUTO_INCREMENT PRIMARY KEY,
  event_id      INT  NOT NULL,
  event_details JSON NOT NULL,
  CONSTRAINT uq_event_info_event UNIQUE (event_id),
  CONSTRAINT fk_event_info_event FOREIGN KEY (event_id) REFERENCES event (id_event)
    ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE purchase (
  id_purchase   INT AUTO_INCREMENT PRIMARY KEY,
  app_user_id   INT           NOT NULL,
  event_id      INT           NOT NULL,
  purchase_date DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_amount  DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_purchase_user  FOREIGN KEY (app_user_id) REFERENCES app_user (id_user)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_purchase_event FOREIGN KEY (event_id) REFERENCES event (id_event)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_purchase_total CHECK (total_amount >= 0)
);

CREATE TABLE ticket (
  id_ticket   INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT           NOT NULL,
  zone        VARCHAR(45)   NOT NULL,
  price_paid  DECIMAL(10,2) NOT NULL,
  ticket_code VARCHAR(45)   NOT NULL,
  CONSTRAINT uq_ticket_code UNIQUE (ticket_code),
  CONSTRAINT fk_ticket_purchase FOREIGN KEY (purchase_id) REFERENCES purchase (id_purchase)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_ticket_price CHECK (price_paid >= 0)
);

-- Una reseña por compra; el usuario y el evento salen de purchase.
-- tags es una lista JSON de textos cortos.
CREATE TABLE review (
  id_review   INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT      NOT NULL,
  rating      TINYINT  NOT NULL,
  comment     TEXT     NULL,
  seat_rating TINYINT  NULL,
  tags        JSON     NULL,
  review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_review_purchase UNIQUE (purchase_id),
  CONSTRAINT fk_review_purchase FOREIGN KEY (purchase_id) REFERENCES purchase (id_purchase)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_review_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT ck_review_seat   CHECK (seat_rating IS NULL OR seat_rating BETWEEN 1 AND 5)
);

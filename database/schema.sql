CREATE DATABASE chill_movie;

USE chill_movie;

CREATE TABLE roles (
    id          INTEGER               NOT NULL AUTO_INCREMENT,
    role_name   ENUM('admin', 'user') NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id          INTEGER      NOT NULL AUTO_INCREMENT,
    username    VARCHAR(50)  NOT NULL,
	email       VARCHAR(100) DEFAULT NULL,
    password    VARCHAR(255) NOT NULL,
    picture     VARCHAR(255) DEFAULT NULL,
    role_id     INTEGER      NOT NULL DEFAULT 2,
    is_verified BOOLEAN      DEFAULT FALSE,
    verif_token VARCHAR(255) DEFAULT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY username_unique (username),
    UNIQUE KEY email_unique (email),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE auth (
    id               INTEGER      NOT NULL AUTO_INCREMENT,
    user_id          INTEGER      NOT NULL,
    refresh_token    TEXT         DEFAULT NULL,
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at       TIMESTAMP    NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO roles (role_name) VALUES ('admin'), ('user');
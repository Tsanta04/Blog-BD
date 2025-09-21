\c postgres;
DROP DATABASE mini_blog;
CREATE DATABASE mini_blog;
\c mini_blog;

-- ====================
-- TABLE: users
-- ====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- ====================
-- TABLE: posts
-- ====================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    update_at TIMESTAMP DEFAULT now(),    
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================
-- TABLE: Tags
-- ====================
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tags VARCHAR(200) NOT NULL
);

-- ====================
-- TABLE: Type medias
-- ====================
CREATE TABLE types_medias (
    id SERIAL PRIMARY KEY,
    type_ VARCHAR(200) NOT NULL
);

-- ====================
-- TABLE: Posts_tags
-- ====================
CREATE TABLE posts_tags (
    id SERIAL PRIMARY KEY,
    tag_id INT NOT NULL,
    post_id INT NOT NULL,
    CONSTRAINT fk_posts_tags FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_tags_ FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE    
);

-- ====================
-- TABLE: Media
-- ====================
CREATE TABLE medias (
    id SERIAL PRIMARY KEY,
    path_name VARCHAR(200) NOT NULL,
    post_id INT NOT NULL,
    type_id INT NOT NULL,    
    CONSTRAINT fk_posts_medias FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_types_medias FOREIGN KEY (type_id) REFERENCES types_medias(id) ON DELETE CASCADE
);

-- ====================
-- TABLE: comments
-- ====================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================
-- TABLE: likes_posts (relation n-n)
-- ====================
CREATE TABLE likes_posts (
    user_id UUID NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ====================
-- TABLE: views (relation n-n)
-- ====================
CREATE TABLE views (
    user_id UUID NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_views_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_views_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ====================
-- TABLE: likes_users (relation n-n)
-- ====================
CREATE TABLE likes_users (
    user_id UUID NOT NULL,
    liker_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, liker_id),
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_likers FOREIGN KEY (liker_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================
-- TABLE: followers (relation n-n)
-- ====================
CREATE TABLE followers (
    user_id UUID NOT NULL,
    follower_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, follower_id),
    CONSTRAINT fk_followed_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_follower_user FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
);

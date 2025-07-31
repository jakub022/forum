package com.jakub022.forumbackend.repository;

import com.jakub022.forumbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}

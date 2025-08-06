package com.jakub022.forumbackend.repository;

import com.jakub022.forumbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(String userId);
    List<Post> findTop20ByOrderByCreatedAtDesc();
}

package com.jakub022.forumbackend.repository;

import com.jakub022.forumbackend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(String userId);
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

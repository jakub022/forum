package com.jakub022.forumbackend.repository;

import com.jakub022.forumbackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}

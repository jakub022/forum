package com.jakub022.forumbackend.controller;

import com.jakub022.forumbackend.dtos.CommentCreateDto;
import com.jakub022.forumbackend.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService){
        this.commentService = commentService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editComment(@PathVariable Long id, @RequestBody CommentCreateDto commentCreateDto, Authentication authentication){
        commentService.editComment(id, commentCreateDto, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Authentication authentication){
        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}

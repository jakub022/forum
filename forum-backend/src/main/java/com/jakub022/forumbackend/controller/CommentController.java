package com.jakub022.forumbackend.controller;

import com.jakub022.forumbackend.dtos.CommentCreateDto;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Post;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentRepository commentRepository;
    private final ProfileRepository profileRepository;

    public CommentController(CommentRepository commentRepository, ProfileRepository profileRepository){
        this.commentRepository = commentRepository;
        this.profileRepository = profileRepository;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editComment(@PathVariable Long id, @RequestBody CommentCreateDto commentCreateDto, Authentication authentication){
        String userId = authentication.getName();
        Comment comment = commentRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment doesn't exist."));

        if(!comment.getUser().getId().equals(userId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to edit this comment.");
        }

        comment.setTextContent(commentCreateDto.textContent());
        comment.setEdited(true);
        commentRepository.save(comment);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Authentication authentication){
        String userId = authentication.getName();
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Comment comment = commentRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found."));
        if(profile.getModProfile() || profile.getId().equals(comment.getUser().getId())){
            recursiveCommentDelete(comment);
        }
        return ResponseEntity.noContent().build();
    }

    public void recursiveCommentDelete(Comment comment){
        List<Comment> childComments = commentRepository.findByParent(comment);
        for(Comment childComment : childComments){
            recursiveCommentDelete(childComment);
        }
        commentRepository.delete(comment);
    }
}

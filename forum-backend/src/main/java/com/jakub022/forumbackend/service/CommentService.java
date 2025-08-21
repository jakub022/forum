package com.jakub022.forumbackend.service;

import com.jakub022.forumbackend.dtos.CommentCreateDto;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ProfileRepository profileRepository;

    public CommentService(CommentRepository commentRepository, ProfileRepository profileRepository){
        this.commentRepository = commentRepository;
        this.profileRepository = profileRepository;
    }

    public void editComment(Long id, CommentCreateDto commentCreateDto, String userId){
        Comment comment = commentRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment doesn't exist."));

        if(!comment.getUser().getId().equals(userId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to edit this comment.");
        }

        comment.setTextContent(commentCreateDto.textContent());
        comment.setEdited(true);
        commentRepository.save(comment);
    }

    public void deleteComment(Long id, String userId){
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Comment comment = commentRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found."));
        if(profile.getModProfile() || profile.getId().equals(comment.getUser().getId())){
            recursiveCommentDelete(comment);
        }
    }

    public void recursiveCommentDelete(Comment comment){
        List<Comment> childComments = commentRepository.findByParent(comment);
        for(Comment childComment : childComments){
            recursiveCommentDelete(childComment);
        }
        commentRepository.delete(comment);
    }
}

package com.jakub022.forumbackend.mapper;

import com.jakub022.forumbackend.dtos.CommentDto;
import com.jakub022.forumbackend.dtos.ParentCommentDto;
import com.jakub022.forumbackend.dtos.ProfileDto;
import com.jakub022.forumbackend.entity.Comment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CommentMapper {
    public List<CommentDto> toDtoAll(List<Comment> comments){
        return comments.stream().map(this::toDto).toList();
    }

    public CommentDto toDto(Comment comment){
        return new CommentDto(comment.getId(), comment.getTextContent(), comment.getCreatedAt(),
                new ProfileDto(comment.getUser().getDisplayName(), comment.getUser().getModProfile(), comment.getUser().getJoinDate(), comment.getUser().getId()),
                comment.getPost().getId(),
                comment.getParent() == null ? null : new ParentCommentDto(
                        comment.getParent().getId(),
                        comment.getParent().getTextContent(),
                        new ProfileDto(
                                comment.getParent().getUser().getDisplayName(),
                                comment.getParent().getUser().getModProfile(),
                                comment.getParent().getUser().getJoinDate(),
                                comment.getParent().getUser().getId()
                        )
                ),
                comment.getEdited()
        );
    }
}

package com.jakub022.forumbackend.mapper;

import com.jakub022.forumbackend.dtos.PostDto;
import com.jakub022.forumbackend.dtos.PostRequestDto;
import com.jakub022.forumbackend.dtos.ProfileDto;
import com.jakub022.forumbackend.entity.Post;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PostMapper {
    public List<PostDto> toDtoAll(List<Post> posts){
        return posts.stream().map(this::toDto).toList();
    }

    public PostDto toDto(Post post){
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getTextContent(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                new ProfileDto(
                        post.getUser().getDisplayName(),
                        post.getUser().getModProfile(),
                        post.getUser().getJoinDate(),
                        post.getUser().getId()
                ),
                post.getEdited(),
                post.getCategory()
        );
    }
}

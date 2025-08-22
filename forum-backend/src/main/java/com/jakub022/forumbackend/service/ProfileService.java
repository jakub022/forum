package com.jakub022.forumbackend.service;

import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Post;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.mapper.CommentMapper;
import com.jakub022.forumbackend.mapper.PostMapper;
import com.jakub022.forumbackend.mapper.ProfileMapper;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.PostRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    private final PostMapper postMapper;
    private final CommentMapper commentMapper;
    private final ProfileMapper profileMapper;

    public ProfileService(PostMapper postMapper, CommentMapper commentMapper, ProfileMapper profileMapper, ProfileRepository profileRepository, PostRepository postRepository, CommentRepository commentRepository){
        this.profileRepository = profileRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;

        this.postMapper = postMapper;
        this.commentMapper = commentMapper;
        this.profileMapper = profileMapper;
    }

    public ProfileDto getProfileById(String id){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        return new ProfileDto(profile.getDisplayName(), profile.getModProfile(), profile.getJoinDate(), profile.getId());
    }

    public List<PostDto> getProfilePosts(String id){
        List<Post> posts = postRepository.findByUserId(id);
        return postMapper.toDtoAll(posts);
    }

    public List<CommentDto> getProfileComments(String id){
        List<Comment> comments = commentRepository.findByUserId(id);
        return commentMapper.toDtoAll(comments);
    }

    public ProfileDto createProfile(ProfileCreateDto profileCreateDto, String id){
        Profile profile = new Profile();
        profile.setId(id);
        profile.setDisplayName(profileCreateDto.displayName());
        profile.setModProfile(false);
        profile.setJoinDate(LocalDateTime.now());

        Profile savedProfile = profileRepository.save(profile);
        return profileMapper.toDto(savedProfile);
    }
}

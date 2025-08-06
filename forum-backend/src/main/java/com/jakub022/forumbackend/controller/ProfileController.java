package com.jakub022.forumbackend.controller;
import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Post;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.PostRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/profiles")
public class ProfileController {
    
    private final ProfileRepository profileRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    
    public ProfileController(ProfileRepository profileRepository, PostRepository postRepository, CommentRepository commentRepository){
        this.profileRepository = profileRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    @GetMapping("/me")
    public ProfileDto getMyProfile(Authentication authentication){
        String id = authentication.getName();
        Profile profile = profileRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        return new ProfileDto(profile.getDisplayName(), profile.getModProfile(), profile.getJoinDate(), profile.getId());
    }
    @GetMapping("/{id}")
    public ProfileDto getProfile(@PathVariable String id){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        return new ProfileDto(profile.getDisplayName(), profile.getModProfile(), profile.getJoinDate(), profile.getId());
    }

    @GetMapping("/{id}/posts")
    public List<PostDto> getProfilePosts(@PathVariable String id){
        List<Post> posts = postRepository.findByUserId(id);
        return posts.stream().map(post -> new PostDto(post.getId(), post.getTitle(), post.getTextContent(), post.getCreatedAt(), post.getUpdatedAt(),
                new ProfileDto(post.getUser().getDisplayName(), post.getUser().getModProfile(), post.getUser().getJoinDate(), post.getUser().getId()))).toList();
    }

    @GetMapping("/{id}/comments")
    public List<CommentDto> getComments(@PathVariable String id){
        List<Comment> comments = commentRepository.findByUserId(id);
        return comments.stream().map(comment -> new CommentDto(comment.getId(), comment.getTextContent(), comment.getCreatedAt(),
                new ProfileDto(comment.getUser().getDisplayName(), comment.getUser().getModProfile(), comment.getUser().getJoinDate(), comment.getUser().getId()), comment.getPost().getId())).toList();
    }
    
    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileCreateDto profileCreateDto, Authentication authentication){
        Profile profile = new Profile();
        profile.setId(authentication.getName());
        profile.setDisplayName(profileCreateDto.displayName());
        profile.setModProfile(false);
        profile.setJoinDate(LocalDateTime.now());
        
        Profile savedProfile = profileRepository.save(profile);
        ProfileDto profileDto = new ProfileDto(savedProfile.getDisplayName(), savedProfile.getModProfile(), savedProfile.getJoinDate(), savedProfile.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(profileDto);
    }
}

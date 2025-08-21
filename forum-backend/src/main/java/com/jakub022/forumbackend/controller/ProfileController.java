package com.jakub022.forumbackend.controller;
import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;
    
    public ProfileController(ProfileService profileService){
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileDto getMyProfile(Authentication authentication){
        return profileService.getProfileById(authentication.getName());
    }

    @GetMapping("/{id}")
    public ProfileDto getProfile(@PathVariable String id){
        return profileService.getProfileById(id);
    }

    @GetMapping("/{id}/posts")
    public List<PostDto> getProfilePosts(@PathVariable String id){
        return profileService.getProfilePosts(id);
    }

    @GetMapping("/{id}/comments")
    public List<CommentDto> getProfileComments(@PathVariable String id){
        return profileService.getProfileComments(id);
    }
    
    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileCreateDto profileCreateDto, Authentication authentication){
        ProfileDto profileDto = profileService.createProfile(profileCreateDto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(profileDto);
    }
}

package com.jakub022.forumbackend.controller;
import com.jakub022.forumbackend.dtos.ProfileCreateDto;
import com.jakub022.forumbackend.dtos.ProfileDto;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.repository.ProfileRepository;
import jakarta.websocket.server.PathParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/profiles")
public class ProfileController {
    
    private final ProfileRepository profileRepository;
    
    public ProfileController(ProfileRepository profileRepository){
        this.profileRepository = profileRepository;
    }
    @GetMapping("/me")
    public ProfileDto getMyProfile(Authentication authentication){
        String id = authentication.getName();
        Profile profile = profileRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        return new ProfileDto(profile.getDisplayName(), profile.getModProfile(), profile.getJoinDate());
    }
    @GetMapping("/{id}")
    public ProfileDto getProfile(@PathVariable String id){
        Profile profile = profileRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found."));
        return new ProfileDto(profile.getDisplayName(), profile.getModProfile(), profile.getJoinDate());
    }
    
    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileCreateDto profileCreateDto){
        Profile profile = new Profile();
        profile.setId(profileCreateDto.id());
        profile.setDisplayName(profileCreateDto.displayName());
        profile.setModProfile(false);
        profile.setJoinDate(LocalDateTime.now());
        
        Profile savedProfile = profileRepository.save(profile);
        ProfileDto profileDto = new ProfileDto(savedProfile.getDisplayName(), savedProfile.getModProfile(), savedProfile.getJoinDate());
        return ResponseEntity.status(HttpStatus.CREATED).body(profileDto);
    }
}

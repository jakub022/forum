package com.jakub022.forumbackend.mapper;

import com.jakub022.forumbackend.dtos.ProfileDto;
import com.jakub022.forumbackend.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {
    public ProfileDto toDto(Profile profile){
        return new ProfileDto(profile.getDisplayName(), profile.getModProfile(), profile.getJoinDate(), profile.getId());
    }
}

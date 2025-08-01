package com.jakub022.forumbackend.dtos;

import java.time.LocalDateTime;

public record ProfileDto(String displayName, boolean modProfile, LocalDateTime joinDate, String id) {
}

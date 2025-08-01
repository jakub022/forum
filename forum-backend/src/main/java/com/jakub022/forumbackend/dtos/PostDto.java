package com.jakub022.forumbackend.dtos;

import java.time.LocalDateTime;

public record PostDto(Long id, String title, String textContent, LocalDateTime createdAt, LocalDateTime updatedAt, ProfileDto profile) {
}

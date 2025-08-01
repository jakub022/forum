package com.jakub022.forumbackend.dtos;

import java.time.LocalDateTime;

public record CommentDto(Long id, String textContent, LocalDateTime createdAt, ProfileDto profile, Long postId) {
}

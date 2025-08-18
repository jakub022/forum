package com.jakub022.forumbackend.dtos;

public record CommentCreateDto(String textContent, Long parentId) {
}

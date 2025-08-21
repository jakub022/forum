package com.jakub022.forumbackend.dtos;

import com.jakub022.forumbackend.model.Category;

public record PostCreateDto(String title, String textContent, Category category) {
}

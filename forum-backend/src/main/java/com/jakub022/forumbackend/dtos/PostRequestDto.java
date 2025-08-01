package com.jakub022.forumbackend.dtos;

import java.util.List;

public record PostRequestDto(PostDto post, List<CommentDto> comments) {
}

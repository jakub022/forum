package com.jakub022.forumbackend.controller;

import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.model.Category;
import com.jakub022.forumbackend.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    
    public PostController(PostService postService){
        this.postService = postService;
    }

    @GetMapping
    public Page<PostRequestDto> getPosts(@RequestParam(required = false) Category category, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        return postService.getPosts(category, pageable);
    }
    
    @GetMapping("/{id}")
    public PostRequestDto getPost(@PathVariable Long id){
        return postService.getPostById(id);
    }
    
    @PostMapping("/{id}")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long id, @RequestBody CommentCreateDto commentCreateDto, Authentication authentication){
        CommentDto commentDto = postService.createComment(id, commentCreateDto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editPost(@PathVariable Long id, @RequestBody PostCreateDto postCreateDto, Authentication authentication){
        postService.editPost(id, postCreateDto, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication authentication){
        postService.deletePost(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostCreateDto postCreateDto, Authentication authentication){
        PostDto postDto = postService.createPost(postCreateDto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(postDto);
    }
}

package com.jakub022.forumbackend.controller;

import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Post;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.PostRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ProfileRepository profileRepository;
    
    public PostController(PostRepository postRepository, CommentRepository commentRepository, ProfileRepository profileRepository){
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.profileRepository = profileRepository;
    }
    
    @GetMapping("/{id}")
    public PostRequestDto getPost(@PathVariable Long id){
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
        PostDto postDto = new PostDto(post.getId(), post.getTitle(), post.getTextContent(), post.getCreatedAt(), post.getUpdatedAt(),
                new ProfileDto(post.getUser().getDisplayName(), post.getUser().getModProfile(), post.getUser().getJoinDate(), post.getUser().getId()));
        List<Comment> comments = commentRepository.findByPostId(id);
        List<CommentDto> commentDtos = comments.stream().map(comment -> new CommentDto(
                comment.getId(), comment.getTextContent(), comment.getCreatedAt(),
                new ProfileDto(comment.getUser().getDisplayName(), comment.getUser().getModProfile(), comment.getUser().getJoinDate(), comment.getUser().getId()), post.getId()))
                .toList();
        return new PostRequestDto(postDto, commentDtos);
    }
    
    @PostMapping("/{id}")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long id, @RequestBody CommentCreateDto commentCreateDto, Authentication authentication){
        String userId = authentication.getName();
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post doesn't exist."));
        
        Comment comment = new Comment();
        comment.setTextContent(commentCreateDto.textContent());
        comment.setUser(profile);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        
        Comment savedComment = commentRepository.save(comment);
        CommentDto commentDto = new CommentDto(savedComment.getId(), savedComment.getTextContent(), savedComment.getCreatedAt(), 
                new ProfileDto(savedComment.getUser().getDisplayName(), savedComment.getUser().getModProfile(), savedComment.getUser().getJoinDate(), savedComment.getUser().getId()), post.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
    }
    
    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostCreateDto postCreateDto, Authentication authentication){
        String userId = authentication.getName();
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        
        Post post = new Post();
        post.setTitle(postCreateDto.title());
        post.setTextContent(postCreateDto.textContent());
        post.setUser(profile);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        Post savedPost = postRepository.save(post);
        PostDto postDto = new PostDto(savedPost.getId(), savedPost.getTitle(), savedPost.getTextContent(), savedPost.getCreatedAt(), savedPost.getUpdatedAt(),
                new ProfileDto(savedPost.getUser().getDisplayName(), savedPost.getUser().getModProfile(), savedPost.getUser().getJoinDate(), savedPost.getUser().getId()));
        return ResponseEntity.status(HttpStatus.CREATED).body(postDto);
    }
}

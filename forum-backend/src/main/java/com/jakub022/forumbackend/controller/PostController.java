package com.jakub022.forumbackend.controller;

import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Post;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.PostRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ProfileRepository profileRepository;
    
    public PostController(PostRepository postRepository, CommentRepository commentRepository, ProfileRepository profileRepository){
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.profileRepository = profileRepository;
    }

    @GetMapping
    public Page<PostRequestDto> getPosts(@PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable){
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(post ->
        {
            List<Comment> comments = commentRepository.findByPostId(post.getId());
            return new PostRequestDto(
                    new PostDto(
                            post.getId(),
                            post.getTitle(),
                            post.getTextContent(),
                            post.getCreatedAt(),
                            post.getUpdatedAt(),
                            new ProfileDto(
                                    post.getUser().getDisplayName(),
                                    post.getUser().getModProfile(),
                                    post.getUser().getJoinDate(),
                                    post.getUser().getId()
                            ),
                            post.getEdited()
                    ),
                    comments.stream().map(comment ->
                            new CommentDto(
                                    comment.getId(),
                                    comment.getTextContent(),
                                    comment.getCreatedAt(),
                                    new ProfileDto(
                                            comment.getUser().getDisplayName(),
                                            comment.getUser().getModProfile(),
                                            comment.getUser().getJoinDate(),
                                            comment.getUser().getId()
                                    ),
                                    post.getId(),
                                    comment.getParent() == null ? null : new ParentCommentDto(
                                            comment.getParent().getId(),
                                            comment.getParent().getTextContent(),
                                            new ProfileDto(
                                                    comment.getParent().getUser().getDisplayName(),
                                                    comment.getParent().getUser().getModProfile(),
                                                    comment.getParent().getUser().getJoinDate(),
                                                    comment.getParent().getUser().getId()
                                            )
                                    ),
                                    comment.getEdited()
                                    )
                    ).toList()
            );
        });
    }
    
    @GetMapping("/{id}")
    public PostRequestDto getPost(@PathVariable Long id){
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
        PostDto postDto = new PostDto(
                post.getId(),
                post.getTitle(),
                post.getTextContent(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                new ProfileDto(
                        post.getUser().getDisplayName(),
                        post.getUser().getModProfile(),
                        post.getUser().getJoinDate(),
                        post.getUser().getId()
                ),
                post.getEdited()
        );
        List<Comment> comments = commentRepository.findByPostId(id);
        List<CommentDto> commentDtos = comments.stream().map(comment -> new CommentDto(
                comment.getId(),
                        comment.getTextContent(),
                        comment.getCreatedAt(),
                new ProfileDto(
                        comment.getUser().getDisplayName(),
                        comment.getUser().getModProfile(),
                        comment.getUser().getJoinDate(),
                        comment.getUser().getId()
                ),
                        post.getId(),
                        comment.getParent() == null ? null : new ParentCommentDto(
                                comment.getParent().getId(),
                                comment.getParent().getTextContent(),
                                new ProfileDto(
                                        comment.getParent().getUser().getDisplayName(),
                                        comment.getParent().getUser().getModProfile(),
                                        comment.getParent().getUser().getJoinDate(),
                                        comment.getParent().getUser().getId()
                                )
                        ),
                        comment.getEdited()
                )
                ).toList();
        return new PostRequestDto(postDto, commentDtos);
    }
    
    @PostMapping("/{id}")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long id, @RequestBody CommentCreateDto commentCreateDto, Authentication authentication){
        String userId = authentication.getName();
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post doesn't exist."));
        ParentCommentDto parentCommentDto = new ParentCommentDto(null, null, null);
        Comment parent = null;
        if(commentCreateDto.parentId() != null){
            parent = commentRepository.findById(commentCreateDto.parentId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment doesn't exist."));
            parentCommentDto = new ParentCommentDto(parent.getId(), parent.getTextContent(), new ProfileDto(
                    parent.getUser().getDisplayName(),
                    parent.getUser().getModProfile(),
                    parent.getUser().getJoinDate(),
                    parent.getUser().getId()
            ));
        }

        Comment comment = new Comment();
        comment.setTextContent(commentCreateDto.textContent());
        comment.setUser(profile);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        comment.setEdited(false);
        comment.setParent(parent);
        
        Comment savedComment = commentRepository.save(comment);
        CommentDto commentDto = new CommentDto(
                savedComment.getId(),
                savedComment.getTextContent(),
                savedComment.getCreatedAt(),
                new ProfileDto(
                        savedComment.getUser().getDisplayName(),
                        savedComment.getUser().getModProfile(),
                        savedComment.getUser().getJoinDate(),
                        savedComment.getUser().getId()
                ),
                post.getId(),
                parentCommentDto,
                savedComment.getEdited()
        );

        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editPost(@PathVariable Long id, @RequestBody PostCreateDto postCreateDto, Authentication authentication){
        String userId = authentication.getName();
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post doesn't exist."));

        if(!post.getUser().getId().equals(userId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to edit this post.");
        }

        post.setTextContent(postCreateDto.textContent());
        post.setTitle(postCreateDto.title());
        post.setUpdatedAt(LocalDateTime.now());
        post.setEdited(true);
        postRepository.save(post);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication authentication){
        String userId = authentication.getName();
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
        if(profile.getModProfile() || profile.getId().equals(post.getUser().getId())){
            List<Comment> comments = commentRepository.findByPostId(post.getId());
            commentRepository.deleteAll(comments);
            postRepository.delete(post);
        }
        return ResponseEntity.noContent().build();
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
        post.setEdited(false);
        
        Post savedPost = postRepository.save(post);
        PostDto postDto = new PostDto(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getTextContent(),
                savedPost.getCreatedAt(),
                savedPost.getUpdatedAt(),
                new ProfileDto(
                        savedPost.getUser().getDisplayName(),
                        savedPost.getUser().getModProfile(),
                        savedPost.getUser().getJoinDate(),
                        savedPost.getUser().getId()
                ),
                savedPost.getEdited()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(postDto);
    }
}

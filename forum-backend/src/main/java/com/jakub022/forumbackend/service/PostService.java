package com.jakub022.forumbackend.service;

import com.jakub022.forumbackend.dtos.*;
import com.jakub022.forumbackend.entity.Comment;
import com.jakub022.forumbackend.entity.Post;
import com.jakub022.forumbackend.entity.Profile;
import com.jakub022.forumbackend.mapper.CommentMapper;
import com.jakub022.forumbackend.mapper.PostMapper;
import com.jakub022.forumbackend.model.Category;
import com.jakub022.forumbackend.repository.CommentRepository;
import com.jakub022.forumbackend.repository.PostRepository;
import com.jakub022.forumbackend.repository.ProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ProfileRepository profileRepository;

    private final PostMapper postMapper;
    private final CommentMapper commentMapper;

    public PostService(PostMapper postMapper, CommentMapper commentMapper, PostRepository postRepository, CommentRepository commentRepository, ProfileRepository profileRepository){
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.profileRepository = profileRepository;

        this.postMapper = postMapper;
        this.commentMapper = commentMapper;
    }

    public Page<PostRequestDto> getPosts(Category category, Pageable pageable){
        Page<Post> posts;
        if(category == null){
            posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        else{
            posts = postRepository.findByCategoryOrderByCreatedAtDesc(category, pageable);
        }
        return posts.map(post -> {
            List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId());
            return new PostRequestDto(postMapper.toDto(post), commentMapper.toDtoAll(comments));
        });
    }

    public PostRequestDto getPostById(Long id){
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
        PostDto postDto = postMapper.toDto(post);
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(id);
        List<CommentDto> commentDtos = commentMapper.toDtoAll(comments);
        return new PostRequestDto(postDto, commentDtos);
    }

    public CommentDto createComment(Long id, CommentCreateDto commentCreateDto, String userId){
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post doesn't exist."));
        Comment parent = null;
        if(commentCreateDto.parentId() != null){
            parent = commentRepository.findById(commentCreateDto.parentId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent comment doesn't exist."));
        }
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        Comment comment = new Comment();
        comment.setTextContent(commentCreateDto.textContent());
        comment.setUser(profile);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        comment.setEdited(false);
        comment.setParent(parent);
        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toDto(savedComment);
    }

    public void editPost(Long id, PostCreateDto postCreateDto, String userId){
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post doesn't exist."));

        if(!post.getUser().getId().equals(userId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to edit this post.");
        }

        post.setTextContent(postCreateDto.textContent());
        post.setTitle(postCreateDto.title());
        post.setUpdatedAt(LocalDateTime.now());
        post.setEdited(true);
        postRepository.save(post);
    }

    public void deletePost(Long id, String userId){
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));
        Post post = postRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
        if(profile.getModProfile() || profile.getId().equals(post.getUser().getId())){
            List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId());
            commentRepository.deleteAll(comments);
            postRepository.delete(post);
        }
    }

    public PostDto createPost(PostCreateDto postCreateDto, String userId){
        Profile profile = profileRepository.findById(userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User doesn't exist."));

        Post post = new Post();
        post.setTitle(postCreateDto.title());
        post.setTextContent(postCreateDto.textContent());
        post.setUser(profile);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setEdited(false);
        post.setCategory(postCreateDto.category());

        Post savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }
}

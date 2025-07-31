package com.jakub022.forumbackend.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.AccessType;

import java.time.LocalDateTime;

@Entity
@AccessType(AccessType.Type.FIELD)
public class Comment {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Profile user;
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
    private String textContent;
    private LocalDateTime createdAt;

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Profile getUser() {
        return user;
    }

    public void setUser(Profile user) {
        this.user = user;
    }

    public Long getId(){
        return id;
    }
    public String getTextContent(){
        return textContent;
    }
    public void setTextContent(String textContent){
        this.textContent = textContent;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt = createdAt;
    } 
}

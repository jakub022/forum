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
    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = true)
    private Comment parent;
    private String textContent;
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private boolean edited = false;

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

    public Comment getParent(){
        return parent;
    }

    public void setParent(Comment parent){
        this.parent = parent;
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
    public boolean getEdited(){
        return edited;
    }
    public void setEdited(boolean edited){
        this.edited = edited;
    }
}

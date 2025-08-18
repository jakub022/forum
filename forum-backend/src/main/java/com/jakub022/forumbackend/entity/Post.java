package com.jakub022.forumbackend.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.AccessType;

import java.time.LocalDateTime;

@Entity
@AccessType(AccessType.Type.FIELD)
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Profile user;
    private String title;
    private String textContent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Column(nullable = false)
    private boolean edited = false;

    public Profile getUser() {
        return user;
    }

    public void setUser(Profile user) {
        this.user = user;
    }
    
    public String getTitle(){
        return title;
    }
    public void setTitle(String title){
        this.title = title;
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
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public boolean getEdited(){
        return edited;
    }
    public void setEdited(boolean edited){
        this.edited = edited;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

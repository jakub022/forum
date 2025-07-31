package com.jakub022.forumbackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.AccessType;

import java.time.LocalDateTime;

@Entity
@AccessType(AccessType.Type.FIELD)
public class Profile {
    @Id
    private String id;
    private String displayName;
    private boolean modProfile;
    private LocalDateTime joinDate;
    
    public Profile(){ }
    
    public Profile(String id, String displayName, boolean modProfile, LocalDateTime joinDate){
        this.id = id;
        this.displayName = displayName;
        this.modProfile = modProfile;
        this.joinDate = joinDate;
    }
    
    public String getId(){
        return id;
    }
    
    public void setId(String id){
        this.id = id;
    }
    
    public String getDisplayName(){
        return displayName;
    }
    public void setDisplayName(String displayName){
        this.displayName = displayName;
    }
    
    public boolean getModProfile(){
        return modProfile;
    }
    public void setModProfile(boolean modProfile){
        this.modProfile = modProfile;
    }
    public LocalDateTime getJoinDate(){
        return joinDate;
    }
    public void setJoinDate(LocalDateTime joinDate){
        this.joinDate = joinDate;
    }
}

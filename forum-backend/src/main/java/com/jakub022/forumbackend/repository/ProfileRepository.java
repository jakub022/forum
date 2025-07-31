package com.jakub022.forumbackend.repository;

import com.jakub022.forumbackend.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, String> {
}

package com.jakub022.forumbackend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http.authorizeHttpRequests(auth->auth
                        .requestMatchers(HttpMethod.GET, "/profiles/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/profiles/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/profiles").authenticated()
                        .anyRequest().denyAll()
        )
                .oauth2ResourceServer(oauth2->oauth2.jwt(jwt->{}))
                .cors(cors->cors.configurationSource(corsConfigurationSource))
                .csrf(csrf->csrf.disable());
        return http.build();
    }
}

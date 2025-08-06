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
                        .requestMatchers("/", "/index.html", "/assets/**", "/vite.svg").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/profiles/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/profiles/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/profiles").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/posts/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/comments/**").authenticated()
                        .requestMatchers("/api/h2-console/**").permitAll()
                        .anyRequest().denyAll()
        )
                .oauth2ResourceServer(oauth2->oauth2.jwt(jwt->{}))
                .cors(cors->cors.configurationSource(corsConfigurationSource))
                .csrf(csrf->csrf.disable())
                .headers(headers-> headers.frameOptions(frame->frame.disable()))
        ;
        return http.build();
    }
}

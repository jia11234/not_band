package com.not_band.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.not_band.entity.UserEntity;
import com.not_band.provider.JwtProvider;
import com.not_band.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {    
            

            try {

                String token = parseBearerToken(request);
                if (token == null) {
                    filterChain.doFilter(request, response);
                    return;
                }

                String memId = jwtProvider.validate(token);
                if (memId == null) {
                    filterChain.doFilter(request, response);
                    return;
                }

                UserEntity userEntity = userRepository.findByMemId(memId);
                String role = userEntity.getRole();

                List<GrantedAuthority> authrities = new ArrayList<>();
                authrities.add(new SimpleGrantedAuthority(role));

                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                AbstractAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(memId, null, authrities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                securityContext.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(securityContext);

            } catch (Exception exception) {
                exception.printStackTrace();
            }

            filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request){

        String authorization = request.getHeader("Authorization");
        
        boolean hasAuthorization = StringUtils.hasText(authorization);
        if (!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer");
        if (!isBearer) return null;

        String token = authorization.substring(7);
        return token;
    }
    
}

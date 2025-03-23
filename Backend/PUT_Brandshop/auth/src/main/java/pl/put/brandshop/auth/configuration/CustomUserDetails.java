package pl.put.brandshop.auth.configuration;

import jakarta.persistence.Column;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.put.brandshop.auth.entity.Role;
import pl.put.brandshop.auth.entity.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails
{
    private String username;
    private String password;
    private boolean isLock;
    private boolean isEnabled;
    private Role role;

    public CustomUserDetails(User user)
    {
        this.username=user.getUsername();
        this.password=user.getPassword();
        this.isLock = user.isLock();
        this.isEnabled = user.isEnabled();
        this.role = user.getRole();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.name()));
        return authorities;
    }

    @Override
    public String getPassword()
    {
        return password;
    }

    @Override
    public String getUsername()
    {
        return username;
    }

    @Override
    public boolean isAccountNonExpired()
    {
        return true;
    }

    @Override
    public boolean isAccountNonLocked()
    {
        return !isLock;
    }

    @Override
    public boolean isCredentialsNonExpired()
    {
        return true;
    }

    @Override
    public boolean isEnabled()
    {
        return isEnabled;
    }
}

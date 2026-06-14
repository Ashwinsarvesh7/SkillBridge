package com.skillbridge.config;

import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.UserRole;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SkillRepository skillRepository, UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedSkills();
        seedAdmin();
    }

    private void seedSkills() {
        if (skillRepository.count() > 0) return;
        List<Skill> skills = List.of(
            skill("Java", "Programming", "Object-oriented programming language"),
            skill("Angular", "Programming", "TypeScript web framework"),
            skill("Spring Boot", "Programming", "Java backend framework"),
            skill("Python", "Programming", "Versatile programming language"),
            skill("JavaScript", "Programming", "Web scripting language"),
            skill("React", "Programming", "JavaScript UI library"),
            skill("MySQL", "Database", "Relational database management"),
            skill("UI/UX Design", "Design", "User interface and experience design"),
            skill("Public Speaking", "Soft Skills", "Effective communication"),
            skill("Photography", "Creative", "Digital photography"),
            skill("Guitar", "Music", "Acoustic and electric guitar"),
            skill("Spanish", "Language", "Spanish conversation"),
            skill("Data Analysis", "Analytics", "Data interpretation"),
            skill("DevOps", "Programming", "CI/CD and infrastructure")
        );
        skillRepository.saveAll(skills);
    }

    private Skill skill(String name, String category, String description) {
        Skill s = new Skill();
        s.setName(name);
        s.setCategory(category);
        s.setDescription(description);
        return s;
    }

    private void seedAdmin() {
        // Always ensure admin exists with a known password (fixes bad hash from manual SQL seed)
        User admin = userRepository.findByEmail("admin@skillbridge.com").orElseGet(User::new);
        admin.setEmail("admin@skillbridge.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setFirstName("System");
        admin.setLastName("Admin");
        admin.setRole(UserRole.ADMIN);
        admin.setExperienceLevel(ExperienceLevel.EXPERT);
        admin.setProfileCompletionPercent(100);
        admin.setEnabled(true);
        userRepository.save(admin);
    }
}

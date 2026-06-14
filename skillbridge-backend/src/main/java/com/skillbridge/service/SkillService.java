package com.skillbridge.service;

import com.skillbridge.dto.SkillDto;
import com.skillbridge.entity.Skill;
import com.skillbridge.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<SkillDto> getAll() {
        return skillRepository.findAll().stream().map(DtoMapper::toSkillDto).collect(Collectors.toList());
    }

    public List<SkillDto> search(String query) {
        return skillRepository.findByNameContainingIgnoreCase(query)
                .stream().map(DtoMapper::toSkillDto).toList();
    }

    public List<String> getCategories() {
        return skillRepository.findAll().stream()
                .map(Skill::getCategory).distinct().sorted().toList();
    }
}

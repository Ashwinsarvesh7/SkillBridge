package com.skillbridge.controller;

import com.skillbridge.dto.ApiResponse;
import com.skillbridge.dto.SkillDto;
import com.skillbridge.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(skillService.getAll()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<SkillDto>>> search(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.search(q)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(skillService.getCategories()));
    }
}

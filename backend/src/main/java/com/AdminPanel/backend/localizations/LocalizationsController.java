package com.AdminPanel.backend.localizations;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/localizations")
public class LocalizationsController {
    LocalizationsRepository localizationsRepository;

    LocalizationsController(LocalizationsRepository localizationsRepository) {
        this.localizationsRepository = localizationsRepository;
    }

    @GetMapping("/list")
    public ResponseEntity<List<LocalizationEntity>> httpGetLocalizations() {
        List<LocalizationEntity> localizations = localizationsRepository.findAll();

        return ResponseEntity.ok(localizations);
    }
}

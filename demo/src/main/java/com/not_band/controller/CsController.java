package com.not_band.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.not_band.entity.CsEntity;
import com.not_band.service.cs.CsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/cs")
public class CsController {

    @Autowired
    private CsService csService;

    // 공지사항 등록
    @PostMapping("/register")
    public ResponseEntity<CsEntity> registerCs(@RequestBody CsEntity csEntity) {
        CsEntity newCs = csService.registerCs(csEntity.getCsTitle(), csEntity.getCsContent(), csEntity.isCsPin());
        return ResponseEntity.ok(newCs);
    }

    // 공지사항 전체 조회
    @GetMapping("/all")
    public List<CsEntity> getAllCs() {
        return csService.getAllCs();
    }

    // 공지사항 조회 (ID로 조회)
    @GetMapping("/{csId}")
    public ResponseEntity<CsEntity> getCsById(@PathVariable("csId") int csId) {
        Optional<CsEntity> cs = csService.getCsById(csId);
        return cs.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 공지사항 삭제
    @DeleteMapping("/delete/{csId}")
    public ResponseEntity<String> deleteCs(@PathVariable("csId") int csId) {
        boolean isDeleted = csService.deleteCs(csId);
        if (isDeleted) {
            return ResponseEntity.ok("공지사항이 삭제되었습니다.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //공지사항 고정
    @PutMapping("/{csId}/togglePin")
    public ResponseEntity<String> togglePinStatus(@PathVariable("csId") int csId) {
        boolean success = csService.togglePinStatus(csId);
        if (success) {
            return ResponseEntity.ok("고정 상태가 변경되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 공지사항을 찾을 수 없습니다.");
        }
    }
}

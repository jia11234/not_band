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

import com.not_band.common.Swagger.ApiResponseNP;
import com.not_band.entity.CsEntity;
import com.not_band.service.cs.CsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/not_band/cs")
public class CsController {

    @Autowired
    private CsService csService;

    // 공지사항 등록
    @Operation(summary = "공지사항 등록", description = "공지사항 상세 내용을 작성하요 등록합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "공지사항 등록 성공"
    )
    @PostMapping("/register")
    public ResponseEntity<CsEntity> registerCs(@RequestBody CsEntity csEntity) {
        CsEntity newCs = csService.registerCs(csEntity.getCsTitle(), csEntity.getCsContent(), csEntity.isCsPin());
        return ResponseEntity.ok(newCs);
    }

    // 공지사항 전체 조회
    @Operation(summary = "공지사항 전체 조회", description = "공지사항 전체 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "공지사항 조회 성공"
    )
    @GetMapping("/all")
    public List<CsEntity> getAllCs() {
        return csService.getAllCs();
    }

    // 공지사항 조회 (ID로 조회)
    @Operation(summary = "공지사항 조회", description = "공지사항 번호로 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "공지사항 조회 성공"
    )
    @GetMapping("/{csId}")
    public ResponseEntity<CsEntity> getCsById(@PathVariable("csId") int csId) {
        Optional<CsEntity> cs = csService.getCsById(csId);
        return cs.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 공지사항 삭제
    @Operation(summary = "공지사항 삭제", description = "공지사항 번호로 해당 공지사항을 삭제합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "공지사항 삭제 완료",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "공지사항이 삭제되었습니다."
            )
        )
    )
    @ApiResponseNP
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
    @Operation(summary = "공지사항 고정 상태 변경", description = "공지사항 번호로 고정 상태 변경합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "고정 상태가 변경",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "고정 상태가 변경되었습니다."
            )
        )
    )
    @ApiResponse(
        responseCode = "404",
        description = "존재하지 않는 공지사항 번호일 때",
        content = @Content(
            mediaType = "text/plain",
            examples = @ExampleObject(
                value = "해당 공지사항을 찾을 수 없습니다."
            )
        )
    )
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

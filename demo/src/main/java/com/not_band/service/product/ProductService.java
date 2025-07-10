package com.not_band.service.product;

import com.not_band.dto.response.product.ProductOptionDto;
import com.not_band.dto.response.product.ProductResponseDto;
import com.not_band.entity.ProductEntity;
import com.not_band.repository.ProductOptionRepository;
import com.not_band.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class ProductService {
        private final ProductRepository productRepository;
        private final ProductOptionRepository productOptionRepository;

        private static final String UPLOAD_DIR = "/upload/product/";//상품 이미지 업로드 경로

        @Transactional
        public void registeProduct(ProductResponseDto dto) {
        String category = dto.getPrdCategory(); // ex: "GBG"
        String prefix = category.substring(1); // "BG"

        //마지막 상품 번호 조회
        String lastPrdNo = productRepository.findLastPrdNoByPrefix(prefix + "%");
        String nextPrdNo = generateNextPrdNo(prefix, lastPrdNo);
        dto.setPrdNo(nextPrdNo); // 자동 생성된 prdNo 세팅

        // 대표 이미지 저장
        String base64 = dto.getPrdUrl(); // 단일 이미지
        String url = null;
        if (base64 != null && !base64.isEmpty()) {
            String filename = nextPrdNo + ".png";
            try {
                url = saveBase64Image(base64, filename, "product");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        dto.setPrdUrl(url);

        // 상세 이미지 저장
        String detailBase64 = dto.getPrdDetailUrl(); // 상세 이미지
        String detailUrl = null;
        if (detailBase64 != null && !detailBase64.isEmpty()) {
            String detailFilename = nextPrdNo + ".png";
            try {
                detailUrl = saveBase64Image(detailBase64, detailFilename, "detail");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        dto.setPrdDetailUrl(detailUrl);

        ProductEntity entity = new ProductEntity(dto);
        productRepository.save(entity);
    }

    // 다음 상품 번호 생성 BG005까지 있다면 다음은 BG006으로 생성
    private String generateNextPrdNo(String prefix, String lastPrdNo) {
        int nextNum = 1;
        if (lastPrdNo != null && lastPrdNo.length() >= prefix.length() + 3) {
            String lastNumStr = lastPrdNo.substring(prefix.length()); // 예: "005"
            nextNum = Integer.parseInt(lastNumStr) + 1;
        }
        return prefix + String.format("%03d", nextNum); // 예: "BG006"
    }

    //base64를 url변환하여 저장
    public String saveBase64Image(String base64Data, String filename, String folder) throws IOException {
        String base64Image = base64Data.split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        // 경로 설정: C:/upload/product/ 또는 C:/upload/detail/
        String directory = "/upload/" + folder + "/";
        Files.createDirectories(Paths.get(directory));

        Path filePath = Paths.get(directory + filename);
        Files.write(filePath, imageBytes);

        // 프론트 접근 경로 설정: /images/product/ 또는 /images/detail/
        return "/images/" + folder + "/" + filename;
    }

    //모든 상품 조회
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //카테고리별 상품 조회
    public List<ProductResponseDto> getProductsByCategory(String category, String sortType) {
        List<ProductEntity> products = productRepository.findByPrdCategory(category);
        
        // sortType에 따라 정렬
        products = sortType.isEmpty() ? products : sortProducts(products, sortType);
        
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //상품 리스트 정렬
    private List<ProductEntity> sortProducts(List<ProductEntity> products, String sortType) {
        switch (sortType) {
            case "popular": // 인기순
                return products.stream()
                        .sorted((p1, p2) -> Integer.compare(p2.getPrdStock(), p1.getPrdStock()))
                        .collect(Collectors.toList());
            case "discount": // 할인율 높은 순
                return products.stream()
                        .sorted((p1, p2) -> Integer.compare(p2.getPrdDiscount(), p1.getPrdDiscount()))
                        .collect(Collectors.toList());
            case "lowPrice": // 낮은 가격순
                return products.stream()
                        .sorted((p1, p2) -> Integer.compare(p1.getPrdPrice(), p2.getPrdPrice()))
                        .collect(Collectors.toList());
            case "highPrice": // 높은 가격순
                return products.stream()
                        .sorted((p1, p2) -> Integer.compare(p2.getPrdPrice(), p1.getPrdPrice()))
                        .collect(Collectors.toList());
            default:
                return products;
        }
    }

    //상품 번호로 하나만 조회
    public ProductResponseDto getProductsByPrdNo(String prdNo) {
        return productRepository.findByPrdNo(prdNo)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
    }

    //옵션 포함해서 엔터티 dto변환
    private ProductResponseDto convertToDTO(ProductEntity product) {
        List<ProductOptionDto> options = productOptionRepository.findByPrdNo(product.getPrdNo()).stream()
        .map(ProductOptionDto::new)
        .collect(Collectors.toList());

        return new ProductResponseDto(
                product.getPrdNo(),
                product.getPrdName(),
                product.getPrdModel(),
                product.getPrdBrand(),
                product.getPrdOrigin(),
                product.getPrdFacturer(),
                product.getPrdStock(),
                product.getPrdDiscount(),
                product.getPrdCategory(),
                product.getPrdPrice(),
                product.getPrdRental(),
                product.getPrdUrl(),
                product.getPrdDetailUrl(),
                options
        );
    }

    //상품 삭제
    @Transactional
    public void deleteProduct(String prdNo) {
        ProductEntity product = productRepository.findByPrdNo(prdNo)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다: " + prdNo));

        // 이미지 삭제
        String imagePath = product.getPrdUrl(); // 예: "/images/product/AD001.png"
        if (imagePath != null && !imagePath.isEmpty()) {
            String filename = Paths.get(imagePath).getFileName().toString(); // "AD001.png"
            Path filePath = Paths.get(UPLOAD_DIR + filename);

            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace(); // 필요 시 로그로 교체
            }
        }

        // DB 삭제
        productRepository.delete(product);
    }

    //상품 수정
    public void updateProduct(ProductResponseDto dto) {
        String prdNo = dto.getPrdNo();
        ProductEntity product = productRepository.findByPrdNo(prdNo)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
    
        // 값 수정
        product.setPrdName(dto.getPrdName());
        product.setPrdModel(dto.getPrdModel());
        product.setPrdBrand(dto.getPrdBrand());
        product.setPrdOrigin(dto.getPrdOrigin());
        product.setPrdFacturer(dto.getPrdFacturer());
        product.setPrdStock(dto.getPrdStock());
        product.setPrdDiscount(dto.getPrdDiscount());
        product.setPrdCategory(dto.getPrdCategory());
        product.setPrdPrice(dto.getPrdPrice());
        product.setPrdRental(dto.getPrdRental());
    
        // 대표 이미지 수정 (있을 경우만 덮어쓰기)
        if (dto.getPrdUrl() != null && !dto.getPrdUrl().isEmpty()) {
            try {
                String newUrl = saveBase64Image(dto.getPrdUrl(), prdNo + ".png", "product");
                product.setPrdUrl(newUrl);
            } catch (IOException e) {
                e.printStackTrace(); // 또는 로깅
            }
        }
    
        // 상세 이미지 수정 (있을 경우만 덮어쓰기)
        if (dto.getPrdDetailUrl() != null && !dto.getPrdDetailUrl().isEmpty()) {
            try {
                String newDetailUrl = saveBase64Image(dto.getPrdDetailUrl(), prdNo + ".png", "detail");
                product.setPrdDetailUrl(newDetailUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    
        productRepository.save(product); // 변경사항 저장
    }
    

}

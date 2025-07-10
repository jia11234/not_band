package com.not_band.service.search;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.dto.search.SearchResultDto;
import com.not_band.entity.ProductEntity;
import com.not_band.entity.ResellEntity;
import com.not_band.repository.ProductRepository;
import com.not_band.repository.ResellRepository;

@Service
public class SearchService {

    @Autowired
    private ResellRepository resellRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<SearchResultDto> searchProducts(String searchKeyword) {
        // 일반 상품 검색
        List<ProductEntity> products = productRepository.searchByProductNameOrCategory(searchKeyword);
    
        // 중고 거래 상품 검색
        List<ResellEntity> resells = resellRepository.searchByProductNameOrCategoryOrTag(searchKeyword);
    
        // DTO로 통합하여 반환
        return convertToDto(products, resells);
    }
    
    private List<SearchResultDto> convertToDto(List<ProductEntity> products, List<ResellEntity> resells) {
        List<SearchResultDto> result = new ArrayList<>();
        
        // 일반 상품을 DTO로 변환
        for (ProductEntity p : products) {
            result.add(new SearchResultDto(
                p.getPrdName(), p.getPrdPrice(), "product",
                p.getPrdCategory(), null, null, p.getPrdNo(), null
            ));
        }
        
        // 중고 거래 상품을 DTO로 변환
        for (ResellEntity r : resells) {
            result.add(new SearchResultDto(
                r.getResPrd(), r.getResPrice(), "resell",
                r.getResCategory(), r.getResTag1(), r.getResImgUrl1(), null, r.getResId()
            ));
        }
        
        return result;
    }
}

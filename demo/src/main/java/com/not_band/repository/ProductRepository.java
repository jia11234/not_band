package com.not_band.repository;

import com.not_band.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, String> {
    List<ProductEntity> findByPrdCategory(String prdCategory);
    Optional<ProductEntity> findByPrdNo(String prdNo);
        @Query("SELECT p FROM ProductEntity p WHERE p.prdName LIKE %:searchKeyword%")
    List<ProductEntity> searchByProductName(@Param("searchKeyword") String searchKeyword);
    List<ProductEntity> findByPrdNameContainingOrPrdCategoryContaining(String prdName, String prdCategory);

    @Query("SELECT p FROM ProductEntity p WHERE p.prdName LIKE %:keyword% OR p.prdCategory LIKE %:keyword%")
    List<ProductEntity> searchByProductNameOrCategory(@Param("keyword") String keyword);

    @Query("SELECT MAX(p.prdNo) FROM ProductEntity p WHERE p.prdNo LIKE :prefix")
    String findLastPrdNoByPrefix(@Param("prefix") String prefix);
}
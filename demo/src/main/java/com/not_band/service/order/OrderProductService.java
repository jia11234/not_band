package com.not_band.service.order;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.dto.request.order.OrderProductRequestDto;
import com.not_band.dto.response.order.OrderProductResponseDto;
import com.not_band.entity.OrderEntity;
import com.not_band.entity.OrderProductEntity;
import com.not_band.repository.OrderProductRepository;

@Service
public class OrderProductService {

    @Autowired
    private OrderProductRepository orderProductRepository;

    //주문 상품 추가
    public void addOrderProduct(OrderProductRequestDto dto, OrderEntity orderEntity) {
        OrderProductEntity entity = new OrderProductEntity();
    
        entity.setOrder(orderEntity); // FK 설정
        entity.setPrdNo(dto.getPrdNo());
        entity.setOrdQty(dto.getOrdQty());
        entity.setIsAddProduct(dto.getIsAddProduct());
        entity.setColorOpt(dto.getColorOpt());
        entity.setParentPrdNo(dto.getParentPrdNo());
    
        orderProductRepository.save(entity);
    }

    //주문 번호로 주문 상품 목록 조회
        public List<OrderProductResponseDto> getProductsByOrderNo(int ordNo) {
        List<OrderProductEntity> products = orderProductRepository.findByOrder_OrdNo(ordNo);

        return products.stream().map(product -> new OrderProductResponseDto(
            product.getPrdNo(),
            product.getOrdQty(),
            product.getIsAddProduct(),
            product.getColorOpt(),
            product.getParentPrdNo()
        )).collect(Collectors.toList());
    }
}

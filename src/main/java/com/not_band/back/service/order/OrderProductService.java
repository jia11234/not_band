package com.not_band.back.service.order;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.back.dto.request.order.OrderProductRequestDto;
import com.not_band.back.dto.response.order.OrderProductResponseDto;
import com.not_band.back.entity.OrderEntity;
import com.not_band.back.entity.OrderProductEntity;
import com.not_band.back.repository.OrderProductRepository;

@Service
public class OrderProductService {

    @Autowired
    private OrderProductRepository orderProductRepository;

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

package com.not_band.back.service.order;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.back.dto.request.order.OrderRequestDto;
import com.not_band.back.dto.response.order.OrderProductResponseDto;
import com.not_band.back.dto.response.order.OrderResponseDto;
import com.not_band.back.entity.OrderEntity;
import com.not_band.back.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderProductService orderProductService; 

    public int addOrder(OrderRequestDto orderRequestDto ) {
        OrderEntity orderEntity = new OrderEntity();
    
        orderEntity.setOrdDate(new Timestamp(System.currentTimeMillis()));
        orderEntity.setMemId(orderRequestDto.getMemId());
        orderEntity.setOrdName(orderRequestDto.getOrdName());
        orderEntity.setOrdPhone(orderRequestDto.getOrdPhone());
        orderEntity.setOrdAddress(orderRequestDto.getOrdAddress());
        orderEntity.setOrdTotal(orderRequestDto.getOrdTotal());
        orderEntity.setOrdPaymethod(orderRequestDto.getOrdPaymethod());
        orderEntity.setOrdPaystatus(orderRequestDto.getOrdPaystatus());
        orderEntity.setOrdZipcode(orderRequestDto.getOrdZipcode());
        orderEntity.setOrdDetailAddress(orderRequestDto.getOrdDetailAddress());
        orderEntity.setOrdStatus(orderRequestDto.getOrdStatus());
        orderEntity.setOrdMemo(orderRequestDto.getOrdMemo());
        orderEntity.setOrdPoint(orderRequestDto.getOrdPoint());
        orderEntity.setOrdDelivery(orderRequestDto.getOrdDelivery());
    
        OrderEntity savedOrder = orderRepository.save(orderEntity);
    
        if (orderRequestDto.getProducts() != null && !orderRequestDto.getProducts().isEmpty()) {
            orderRequestDto.getProducts().forEach(product -> {
                orderProductService.addOrderProduct(product, savedOrder); 
            });
        }

        return savedOrder.getOrdNo();
    }

    public List<OrderResponseDto> getOrdersByMemId(String memId) {
        List<OrderEntity> orders = orderRepository.findByMemId(memId);
    
        return orders.stream().map(order -> {
            List<OrderProductResponseDto> productDtos = orderProductService.getProductsByOrderNo(order.getOrdNo());
    
            return new OrderResponseDto(
                order.getOrdNo(),
                order.getMemId(),
                order.getOrdName(),
                order.getOrdPhone(),
                order.getOrdAddress(),
                order.getOrdDetailAddress(),
                order.getOrdZipcode(),
                order.getOrdTotal(),
                order.getOrdPaymethod(),
                order.getOrdPaystatus(),
                order.getOrdStatus(),
                order.getOrdMemo(),
                order.getOrdPoint(),
                order.getOrdDelivery(),
                order.getOrdDate(),
                productDtos
            );
        }).collect(Collectors.toList());
    }

    public List<OrderResponseDto> getOrdersByOrdNo(int ordNo) {
        List<OrderEntity> orders = orderRepository.findByOrdNo(ordNo); // ordNo로 조회
        
        return orders.stream().map(order -> {
            List<OrderProductResponseDto> productDtos = orderProductService.getProductsByOrderNo(order.getOrdNo());
            
            return new OrderResponseDto(
                order.getOrdNo(),
                order.getMemId(),
                order.getOrdName(),
                order.getOrdPhone(),
                order.getOrdAddress(),
                order.getOrdDetailAddress(),
                order.getOrdZipcode(),
                order.getOrdTotal(),
                order.getOrdPaymethod(),
                order.getOrdPaystatus(),
                order.getOrdStatus(),
                order.getOrdMemo(),
                order.getOrdPoint(),
                order.getOrdDelivery(),
                order.getOrdDate(),
                productDtos
            );
        }).collect(Collectors.toList());
    }

    public List<OrderResponseDto> getAllOrders() {
        List<OrderEntity> orders = orderRepository.findAll();
    
        return orders.stream().map(order -> {
            List<OrderProductResponseDto> productDtos = orderProductService.getProductsByOrderNo(order.getOrdNo());
    
            return new OrderResponseDto(
                order.getOrdNo(),
                order.getMemId(),
                order.getOrdName(),
                order.getOrdPhone(),
                order.getOrdAddress(),
                order.getOrdDetailAddress(),
                order.getOrdZipcode(),
                order.getOrdTotal(),
                order.getOrdPaymethod(),
                order.getOrdPaystatus(),
                order.getOrdStatus(),
                order.getOrdMemo(),
                order.getOrdPoint(),
                order.getOrdDelivery(),
                order.getOrdDate(),
                productDtos
            );
        }).collect(Collectors.toList());
    }
}
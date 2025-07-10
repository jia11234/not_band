package com.not_band.service.cart;

import com.not_band.dto.request.cart.CartRequestDto;
import com.not_band.entity.CartEntity;
import com.not_band.entity.CartId;
import com.not_band.repository.CartRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // 장바구니에 상품 추가
    public void addProductToCart(CartRequestDto cartRequestDto) {
        CartEntity cartEntity = new CartEntity();
        
        // 복합키 설정
        CartId cartId = new CartId(cartRequestDto.getMemId(), cartRequestDto.getPrdNo());
        cartEntity.setCartId(cartId);  // CartId 세팅
        
        cartEntity.setAddPrd1(cartRequestDto.getAddPrd1());
        cartEntity.setAddPrd2(cartRequestDto.getAddPrd2());
        cartEntity.setCtQty(cartRequestDto.getCtQty());
        cartEntity.setAdd1Qty(cartRequestDto.getAdd1Qty());
        cartEntity.setAdd2Qty(cartRequestDto.getAdd2Qty());
        cartEntity.setColorOpt(cartRequestDto.getColorOpt());
        cartEntity.setCartChecked(cartRequestDto.getCartChecked());

        cartRepository.save(cartEntity);
    }

    // 특정 회원의 장바구니 조회
    public List<CartRequestDto> getCartByUser(String memId) {
        List<CartEntity> cartEntities = cartRepository.findByMemId(memId);
        return cartEntities.stream()
                .map(cartEntity -> new CartRequestDto(
                        cartEntity.getMemId(),
                        cartEntity.getPrdNo(),
                        cartEntity.getAddPrd1(),
                        cartEntity.getAddPrd2(),
                        cartEntity.getCtQty(),
                        cartEntity.getCtAdd(),
                        cartEntity.getAdd1Qty(),
                        cartEntity.getAdd2Qty(),
                        cartEntity.getColorOpt(),
                        cartEntity.getCartChecked()
                ))
                .collect(Collectors.toList());
    }

    public Long getCartCountByUser(String memId) {
        return cartRepository.countByMemId(memId);
    }

    // 장바구니에서 상품 제거
    public void removeProductFromCart(CartRequestDto cartRequestDto) {
        // CartId를 이용해 삭제
        CartId cartId = new CartId(cartRequestDto.getMemId(), cartRequestDto.getPrdNo());
        cartRepository.deleteById(cartId);  // 복합키를 사용한 삭제
    }

    // 수량 업데이트 (수량 변경)
    public void updateQuantity(CartRequestDto cartRequestDto) {
        Optional<CartEntity> cartEntityOpt = cartRepository.findById(new CartId(cartRequestDto.getMemId(), cartRequestDto.getPrdNo()));

        if (cartEntityOpt.isPresent()) {
            CartEntity cartEntity = cartEntityOpt.get();
            // 수량 업데이트
            cartEntity.setCtQty(cartRequestDto.getCtQty());
            cartRepository.save(cartEntity);
        }
    }

    // 장바구니 전체 삭제
    public void removeAllProductsFromCart(String memId) {
        List<CartEntity> cartEntities = cartRepository.findByMemId(memId);
        cartRepository.deleteAll(cartEntities);
    }

    //장바구니 체크 업데이트
    public void updateCartChecked(CartRequestDto cartRequestDto) {
        Optional<CartEntity> cartEntityOpt = cartRepository.findById(
            new CartId(cartRequestDto.getMemId(), cartRequestDto.getPrdNo())
        );
    
        if (cartEntityOpt.isPresent()) {
            CartEntity cartEntity = cartEntityOpt.get();
            cartEntity.setCartChecked(cartRequestDto.getCartChecked());
            cartRepository.save(cartEntity); // 업데이트 후 저장
        }
    }

    @Transactional
    public void updateCartCheckedAll(String memId, Boolean selectAll) {
        cartRepository.updateCartCheckedAll(memId, selectAll);  // 실제 메서드 호출
    }
}

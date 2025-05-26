package com.not_band.back.service.resell;
import com.not_band.back.dto.request.resell.ResellProductRequestDto;
import com.not_band.back.dto.response.resell.ResellProductResponseDto;
import com.not_band.back.entity.ChatEntity;
import com.not_band.back.entity.ResellEntity;
import com.not_band.back.entity.UserEntity;
import com.not_band.back.repository.ChatMessageRepository;
import com.not_band.back.repository.ChatRepository;
import com.not_band.back.repository.ResellRepository;
import com.not_band.back.repository.UserRepository;
import com.not_band.back.repository.WishRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResellService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ResellRepository resellRepository;
    private final WishRepository wishRepository;
    private final ChatMessageRepository chatMessageRepository;

    private static final String UPLOAD_DIR = "C:/upload/resell/";

    @Transactional
    public void registerResell(ResellProductRequestDto dto) {
        List<String> base64List = dto.getResImgUrl();
        List<String> imageUrls = new ArrayList<>();

        // base64 이미지 → 파일 저장 후 URL 반환
        for (int i = 0; i < base64List.size(); i++) {
            String filename = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + "_" + i + ".png";
            try {
                String url = saveBase64Image(base64List.get(i), filename);
                imageUrls.add(url);
            } catch (IOException e) {
                e.printStackTrace();
                imageUrls.add(null); // 실패하면 null 추가
            }
        }

        dto.setResImgUrl(imageUrls); // 이미지 URL로 덮어쓰기
        ResellEntity entity = new ResellEntity(dto);
        resellRepository.save(entity);
    }

    public String saveBase64Image(String base64Data, String filename) throws IOException {
        String base64Image = base64Data.split(",")[1]; // "data:image/png;base64," 제거
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        // 폴더가 없다면 자동 생성
        Files.createDirectories(Paths.get(UPLOAD_DIR));

        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.write(filePath, imageBytes);

        return "/images/resell/" + filename; // 프론트에서 불러올 경로
    }

    public List<ResellEntity> getAllResellProducts() {
        return resellRepository.findAll();
    }

    public List<ResellEntity> getAllResellProductsByMemId(String memId) {
        return resellRepository.findByMemId(memId);
    }

    public ResellProductResponseDto getResellByResId(Integer resId) {
        return resellRepository.findByResId(resId)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("없어요 그냥 없는 중고상품"));
    }

    @Transactional
    public void deleteResellById(Integer resId) {
        List<ChatEntity> chats = chatRepository.findByResId(resId);
    
        for (ChatEntity chat : chats) {
            chatMessageRepository.deleteByChatId(chat.getChatId());
        }
    
        chatRepository.deleteByResId(resId);
        wishRepository.deleteByResId(resId);
        resellRepository.deleteById(resId);
    }

    @Transactional
    public void updateResComment(Integer resId, int newResComment) {
        ResellEntity product = resellRepository.findByResId(resId)
            .orElseThrow(() -> new RuntimeException("중고상품이 존재하지 않습니다."));

        product.setResComment(newResComment);
    }

    private ResellProductResponseDto convertToDTO(ResellEntity resell) {
        List<String> imgUrls = new ArrayList<>();
        if (resell.getResImgUrl1() != null) imgUrls.add(resell.getResImgUrl1());
        if (resell.getResImgUrl2() != null) imgUrls.add(resell.getResImgUrl2());
        if (resell.getResImgUrl3() != null) imgUrls.add(resell.getResImgUrl3());
        if (resell.getResImgUrl4() != null) imgUrls.add(resell.getResImgUrl4());
        if (resell.getResImgUrl5() != null) imgUrls.add(resell.getResImgUrl5());

        List<String> resTags = new ArrayList<>();
        if (resell.getResTag1() != null) resTags.add(resell.getResTag1());
        if (resell.getResTag2() != null) resTags.add(resell.getResTag2());

        String nickname = userRepository.findById(resell.getMemId())
        .map(UserEntity::getNickname) 
        .orElse("알 수 없음");

        return new ResellProductResponseDto(
            resell.getResId(),
            nickname,
            resell.getMemId(),
            resell.getResPrd(),
            resell.getResPrice(),
            imgUrls,
            resell.getResView(),
            resell.getResLike(),
            resell.getResComment(),
            resell.getResTime(),
            resell.getResDelivery(),
            resell.getResAddress(),
            resell.getResDetail(),
            resTags,
            resell.getResCategory(),
            resell.getResDelPrice(),
            resell.getResCondition()
        );
    }

    public void increaseViewCount(Integer resId) {
        ResellEntity resell = resellRepository.findByResId(resId)
            .orElseThrow(() -> new RuntimeException("해당 게시글이 없습니다."));
    
        resell.setResView(resell.getResView() + 1);
        resellRepository.save(resell);
    }
}

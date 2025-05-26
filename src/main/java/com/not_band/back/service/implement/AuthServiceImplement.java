package com.not_band.back.service.implement;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.not_band.back.common.CertificationNumber;
import com.not_band.back.dto.request.auth.CheckCertificationRequestDto;
import com.not_band.back.dto.request.auth.EmailCertificationRequestDto;
import com.not_band.back.dto.request.auth.IdCheckRequestDto;
import com.not_band.back.dto.request.auth.SignInRequestDto;
import com.not_band.back.dto.request.auth.SignUpRequestDto;
import com.not_band.back.dto.response.ResponseDto;
import com.not_band.back.dto.response.auth.CheckCertificationResponseDto;
import com.not_band.back.dto.response.auth.EmailCertificationResponseDto;
import com.not_band.back.dto.response.auth.IdCheckResponseDto;
import com.not_band.back.dto.response.auth.SignInResponseDto;
import com.not_band.back.dto.response.auth.SignUpResponseDto;
import com.not_band.back.dto.response.auth.UserResponseDto;
import com.not_band.back.entity.CertificationEntity;
import com.not_band.back.entity.LoginEntity;
import com.not_band.back.entity.UserEntity;
import com.not_band.back.provider.EmailProvider;
import com.not_band.back.provider.JwtProvider;
import com.not_band.back.repository.CertificationRepository;
import com.not_band.back.repository.ChatMessageRepository;
import com.not_band.back.repository.ChatRepository;
import com.not_band.back.repository.InquiryMessageRepository;
import com.not_band.back.repository.InquiryRepository;
import com.not_band.back.repository.LoginRepository;
import com.not_band.back.repository.OrderRepository;
import com.not_band.back.repository.ResellRepository;
import com.not_band.back.repository.ReviewRepository;
import com.not_band.back.repository.UserRepository;
import com.not_band.back.repository.WishRepository;
import com.not_band.back.service.AuthService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService{

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRepository chatRepository;
    private final InquiryRepository inquiryRepository;
    private final ResellRepository resellRepository;
    private final ReviewRepository reviewRepository;
    private final WishRepository wishRepository;
    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;
    private final InquiryMessageRepository inquiryMessageRepository;
    private final OrderRepository orderRepository;
    private final LoginRepository loginRepository;

    private final JwtProvider jwtProvider;
    private final EmailProvider emailProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto) {
 
    try {
        
        String userId = dto.getId();
        boolean isExistId = userRepository.existsByMemId(userId);
        if(isExistId) return IdCheckResponseDto.duplicateId();

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseDto.databaseError();
    }

    return IdCheckResponseDto.success();

    }

    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        try {
            
            String userId = dto.getId();
            String email = dto.getEmail();

            boolean isExistId = userRepository.existsByMemId(userId);
            if(isExistId) return EmailCertificationResponseDto.duplicateId();

            String certificationNumber = CertificationNumber.getCertificationNumber();

            boolean isSuccessed = emailProvider.sendCertificationMail(email, certificationNumber);

            if(!isSuccessed) return EmailCertificationResponseDto.mailSendFail();

            CertificationEntity certificationEntity = new CertificationEntity(userId, email, certificationNumber);
            certificationRepository.save(certificationEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto) {
        try {

            String userId = dto.getId();
            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();

            CertificationEntity certificationEntity = certificationRepository.findByMemId(userId);
            if (certificationEntity == null) return CheckCertificationResponseDto.certificationFail();

            boolean isMatched = certificationEntity.getMemEmail().equals(email)&&certificationEntity.getCertification_number().equals(certificationNumber);
            if (!isMatched) return CheckCertificationResponseDto.certificationFail();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return CheckCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        try {
            
            String userId = dto.getId();
            boolean isExistId = userRepository.existsByMemId(userId);
            if(isExistId) return SignUpResponseDto.duplicateId();

            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();

            CertificationEntity certificationEntity = certificationRepository.findByMemId(userId);
            boolean isMatched = certificationEntity.getMemEmail().equals(email) && certificationEntity.getCertification_number().equals(certificationNumber);
            if(!isMatched) return SignUpResponseDto.certificationFail();

            String password = dto.getPassword();
            String encodePassword = passwordEncoder.encode(password);
            dto.setPassword(encodePassword);

            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

            certificationRepository.deleteByMemId(userId);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }
    

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
        String token = null;
        try {
    
            String userId = dto.getId();
            UserEntity userEntity = userRepository.findByMemId(userId);
            if (userEntity == null) return SignInResponseDto.signInFail();
    
            String password = dto.getPassword();
            String encodePassword = userEntity.getMemPasswd();
            boolean isMatched = passwordEncoder.matches(password, encodePassword);
            if (!isMatched) return SignInResponseDto.signInFail();
    
            token = jwtProvider.create(userId);
            
            LoginEntity loginEntity = new LoginEntity();
            loginEntity.setMemId(userId); // 로그인한 사용자 ID
            loginRepository.save(loginEntity);
    
            if ("ROLE_ADMIN".equals(userEntity.getRole())) {
                return SignInResponseDto.success(token, "관리자입니다.");
            }
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    
        // 일반 사용자일 경우
        return SignInResponseDto.success(token, "일반 사용자입니다.");
    }

    @Override
    public UserResponseDto getUserByMemId(String memId) {
        UserEntity user = userRepository.findByMemId(memId);
        return new UserResponseDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
                    .map(UserResponseDto::new)
                    .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateMemberPoint(String memId, Integer additionalPoint, String operation) {
        UserEntity user = userRepository.findByMemId(memId);
        if (user == null) {
            throw new RuntimeException("회원 없음");
        }

        if(operation=="plus") {
            int updatedPoint = user.getMemPoint() + additionalPoint;
            user.setMemPoint(updatedPoint); 
        }
        else {
            int updatedPoint = user.getMemPoint() - additionalPoint;
            user.setMemPoint(updatedPoint); 
        } 
    }

    @Transactional
    @Override
    public ResponseEntity<?> updateNickname(String memId, String newNickname) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }

 
            user.setMemNick(newNickname);
            userRepository.save(user);
            return ResponseEntity.ok("닉네임이 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> updatePhoneNumber(String memId, String newPhoneNumber) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }


            user.setMemPhone(newPhoneNumber);
            userRepository.save(user);
            return ResponseEntity.ok("전화번호가 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> updateEmail(String memId, String newEmail) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }


            user.setMemEmail(newEmail);
            userRepository.save(user);
            return ResponseEntity.ok("이메일이 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> updateAddress(String memId, String newAddress, String newDetailAddress, String newZipCode) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }

    
            user.setMemAddress(newAddress);
            user.setMemDetailAddress(newDetailAddress);
            user.setMemZipcode(newZipCode);
            userRepository.save(user);
            return ResponseEntity.ok("주소가 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> updateName(String memId, String newName) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }

            user.setMemName(newName);
            userRepository.save(user);
            return ResponseEntity.ok("이름이 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> updatePassword(String memId, String newPassword) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }

            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setMemPasswd(encodedPassword);
            userRepository.save(user);

            return ResponseEntity.ok("비밀번호가 수정되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> updateUserInfo(String memId, String field, String newValue) {
        try {
            UserEntity user = userRepository.findByMemId(memId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
            }

            switch (field) {
                case "nickname":
                    return updateNickname(memId, newValue);
                case "email":
                    return updateEmail(memId, newValue);
                case "phoneNumber":
                    return updatePhoneNumber(memId, newValue);
                case "address":
                String[] addressDetails = newValue.split(",");
    
                if (addressDetails.length == 3) {
                    String newZipCode = addressDetails[0];
                    String newAddress = addressDetails[1]; 
                    String newDetailAddress = addressDetails[2];
                    
                    return updateAddress(memId, newAddress, newDetailAddress, newZipCode);
                } else {
                    return ResponseEntity.badRequest().body("잘못된 주소 정보 형식입니다.");
                }

                case "password":
                    return updatePassword(memId, newValue); 
                case "name":
                    return updateName(memId, newValue);
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("지원하지 않는 필드입니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Transactional
@Override
public ResponseEntity<?> deleteUser(String memId) {
    try {
        UserEntity user = userRepository.findByMemId(memId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원이 존재하지 않습니다.");
        }
    
        deleteRelatedData(memId);
    
        userRepository.delete(user);
    
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
    }
}

private void deleteRelatedData(String memId) {
    wishRepository.deleteByMemId(memId);
    inquiryMessageRepository.deleteBySenderId(memId);
    chatMessageRepository.deleteBySenderId(memId);
    chatRepository.deleteByMemId1(memId);
    chatRepository.deleteByMemId2(memId);
    inquiryRepository.deleteByMemId(memId);
    reviewRepository.deleteByMemId(memId);
    orderRepository.deleteByMemId(memId);
    resellRepository.deleteByMemId(memId);
}

    @Transactional
    @Override
    public void playGame(String memId) {
        UserEntity user = userRepository.findByMemId(memId);
        if (user == null) {
            throw new RuntimeException("회원 없음");
        }
        LocalDate today = LocalDate.now();
        if (user.getLastGameDate() != null && user.getLastGameDate().isEqual(today)) {
            throw new RuntimeException("오늘은 이미 게임에 참여했습니다.");
        }

        int updatedGameCount = user.getMemGame() + 1;
        user.setMemGame(updatedGameCount);
        user.setLastGameDate(today); 

        int updatedPoint = user.getMemPoint() + 150;
        user.setMemPoint(updatedPoint);
    }

    @Override
    public boolean canPlayGame(String memId) {
        UserEntity user = userRepository.findByMemId(memId);
        if (user == null) {
            throw new RuntimeException("회원 없음");
        }

        LocalDate today = LocalDate.now();
        return user.getLastGameDate() == null || !user.getLastGameDate().isEqual(today);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Override
    public void resetDailyGameCount() {
        LocalDate today = LocalDate.now();
        
        List<UserEntity> users = userRepository.findAll();
        
        for (UserEntity user : users) {
            if (user.getLastGameDate() == null || !user.getLastGameDate().isEqual(today)) {
                user.setMemGame(0); 
                user.setLastGameDate(today); 
                userRepository.save(user); 
            }
        }
    }
}

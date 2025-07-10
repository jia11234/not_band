package com.not_band.service.cs;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.not_band.entity.CsEntity;
import com.not_band.repository.CsRepository;

@Service
public class CsService {

    @Autowired
    private CsRepository csRepository;

    // 공지사항 등록
    public CsEntity registerCs(String csTitle, String csContent, boolean csPin) {
        CsEntity newCs = new CsEntity(csTitle, csContent, csPin);
        return csRepository.save(newCs);
    }

    // 공지사항 조회 (전체 조회)
    public List<CsEntity> getAllCs() {
        return csRepository.findAll();
    }

    // 공지사항 조회 (단일 조회 - ID로 조회)
    public Optional<CsEntity> getCsById(int csId) {
        return csRepository.findById(csId);
    }
    

    // 공지사항 삭제
    public boolean deleteCs(int csId) {
        Optional<CsEntity> cs = csRepository.findById(csId);
        if (cs.isPresent()) {
            csRepository.delete(cs.get());
            return true;
        }
        return false;
    }
    //공지사항 고정 토글
    public boolean togglePinStatus(int csId) {
        Optional<CsEntity> cs = csRepository.findById(csId);
        if (cs.isPresent()) {
            CsEntity csEntity = cs.get();
            csEntity.setCsPin(!csEntity.isCsPin());  
            csRepository.save(csEntity);  
            return true;
        }
        return false;
    }
}
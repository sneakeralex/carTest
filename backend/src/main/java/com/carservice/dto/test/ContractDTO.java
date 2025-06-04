package com.carservice.dto.test;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 合同DTO
 */
@Data
public class ContractDTO {
    
    private String contractNo;
    private String contractName;
    private String customerId;
    private String customerName;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private String currency;
    private LocalDateTime signTime;
    private LocalDateTime effectiveTime;
    private LocalDateTime expiryTime;
    private Integer status;
    private String statusName;
    private String description;
    private String terms;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 隐私处理标记
    private Boolean priceHidden = false;
    private Boolean discountHidden = false;
}

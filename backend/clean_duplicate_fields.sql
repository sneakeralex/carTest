-- 删除重复的驼峰命名字段
-- approval_message 表
ALTER TABLE approval_message 
  DROP COLUMN approvalDeadline,
  DROP COLUMN approvalDetails,
  DROP COLUMN approvalId,
  DROP COLUMN approvalType,
  DROP COLUMN currentStep,
  DROP COLUMN nextApproverId,
  DROP COLUMN previousApproverId,
  DROP COLUMN totalSteps;

-- employee_info 表
ALTER TABLE employee_info 
  DROP COLUMN birthDate,
  DROP COLUMN emergencyContact,
  DROP COLUMN emergencyPhone,
  DROP COLUMN idCardNo,
  DROP COLUMN departureDate,
  DROP COLUMN employeeNo,
  DROP COLUMN entryDate,
  DROP COLUMN userId;

-- message_setting 表
ALTER TABLE message_setting 
  DROP COLUMN emailEnabled,
  DROP COLUMN inAppEnabled,
  DROP COLUMN messageType,
  DROP COLUMN muteAll,
  DROP COLUMN pushEnabled,
  DROP COLUMN smsEnabled,
  DROP COLUMN userId,
  DROP COLUMN workingHours;

-- vehicle 表
ALTER TABLE vehicle 
  DROP COLUMN engineNo,
  DROP COLUMN fuelType,
  DROP COLUMN insuranceInfo,
  DROP COLUMN manufactureYear,
  DROP COLUMN mileage,
  DROP COLUMN ownerId,
  DROP COLUMN ownerIdCard,
  DROP COLUMN ownerName,
  DROP COLUMN ownerPhone,
  DROP COLUMN purchaseDate,
  DROP COLUMN registrationDate,
  DROP COLUMN technicalSpecs,
  DROP COLUMN vehicleNo;

-- vehicle_type 表
ALTER TABLE vehicle_type 
  DROP COLUMN typeCode,
  DROP COLUMN typeId,
  DROP COLUMN typeName;

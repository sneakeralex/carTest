-- 创建临时表存储枚举值
CREATE TEMPORARY TABLE temp_vehicle_types (
    type_code VARCHAR(50),
    type_name VARCHAR(50),
    description VARCHAR(255)
);

-- 插入枚举数据
INSERT INTO temp_vehicle_types (type_code, type_name, description) VALUES
('SEDAN', '轿车', '标准轿车'),
('SUV', '运动型多用途车', '运动型多用途汽车'),
('MPV', '多用途汽车', '多功能乘用车'),
('SPORTS', '跑车', '运动型汽车'),
('PICKUP', '皮卡', '载货皮卡车'),
('VAN', '厢式货车', '厢式运输车'),
('OTHER', '其他', '其他类型车辆');

-- 迁移数据到vehicle_type表
INSERT INTO vehicle_type (type_code, type_name, description, created_time, updated_time, deleted)
SELECT 
    type_code,
    type_name,
    description,
    NOW(),
    NOW(),
    0
FROM temp_vehicle_types
WHERE NOT EXISTS (
    SELECT 1 
    FROM vehicle_type vt 
    WHERE vt.type_code = temp_vehicle_types.type_code
);

-- 更新vehicle表中的类型关联
UPDATE vehicle v 
INNER JOIN vehicle_type vt ON v.type = vt.type_code
SET v.type_id = vt.id;

-- 移除vehicle表中的type字段
ALTER TABLE vehicle DROP COLUMN type;

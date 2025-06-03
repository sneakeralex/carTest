-- 1. 修改person_attachments表，将person_id列重命名为user_id
ALTER TABLE person_attachments RENAME COLUMN person_id TO user_id;

-- 2. 将persons表中的数据迁移到users表中
INSERT INTO users (
    id,
    name,
    email,
    phone,
    person_type,
    is_published,
    created_by,
    created_time,
    updated_by,
    updated_time,
    deleted,
    version
)
SELECT
    id,
    name,
    email,
    phone_number,
    person_type,
    is_published,
    created_by,
    created_time,
    updated_by,
    updated_time,
    deleted,
    version
FROM persons
ON CONFLICT (id) DO UPDATE
SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    person_type = EXCLUDED.person_type,
    is_published = EXCLUDED.is_published;

-- 3. 在users表中添加新的字段（如果不存在）
ALTER TABLE users ADD COLUMN IF NOT EXISTS person_type VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- 4. 删除persons表（确保数据已经迁移完成后）
-- DROP TABLE persons;

-- Note: 请在确认数据迁移成功后再取消注释最后一行

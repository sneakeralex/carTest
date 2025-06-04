package com.carservice.repository;

import com.carservice.entity.PersonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 人员类型Repository接口
 */
@Repository
public interface PersonTypeRepository extends JpaRepository<PersonType, Long> {
    
    /**
     * 根据人员类型ID查找类型
     * @param personTypeId 人员类型ID
     * @return 人员类型对象
     */
    PersonType findByPersonTypeId(String personTypeId);
    
    /**
     * 根据类型名称查找类型
     * @param typeName 类型名称
     * @return 人员类型对象
     */
    PersonType findByTypeName(String typeName);
    
    /**
     * 根据类型编码查找类型
     * @param typeCode 类型编码
     * @return 人员类型对象
     */
    PersonType findByTypeCode(String typeCode);
    
    /**
     * 根据状态查找类型列表
     * @param status 类型状态
     * @return 人员类型列表
     */
    List<PersonType> findByStatus(PersonType.TypeStatus status);
    
    /**
     * 查找所有启用的人员类型，按排序顺序排列
     * @return 启用的人员类型列表
     */
    @Query("SELECT pt FROM PersonType pt WHERE pt.status = 'ACTIVE' ORDER BY pt.sortOrder ASC, pt.typeName ASC")
    List<PersonType> findAllActiveTypesOrderBySortOrder();
    
    /**
     * 根据类型名称模糊查询
     * @param typeName 类型名称关键字
     * @return 人员类型列表
     */
    List<PersonType> findByTypeNameContainingIgnoreCase(String typeName);
    
    /**
     * 查找所有类型，按排序顺序排列
     * @return 所有人员类型列表
     */
    List<PersonType> findAllByOrderBySortOrderAscTypeNameAsc();
}

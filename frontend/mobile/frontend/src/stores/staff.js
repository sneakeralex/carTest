import { defineStore } from 'pinia';
import { getStaffList, getStaffById, createStaff, updateStaff, deleteStaff, uploadStaffDocument, deleteStaffDocument, getDriverList, getDriverById, createDriver, updateDriver, deleteDriver } from '@/api/staff';

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staffList: [],
    currentStaff: null,
    initialized: false,
    supportedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }),

  actions: {
    // 获取人员列表
    async fetchStaffList(params = {}) {
      try {
        const response = await getStaffList(params);
        const staffData = response.data || [];
        this.staffList = staffData;
        this.initialized = true;
        return staffData;
      } catch (error) {
        throw new Error('获取人员列表失败');
      }
    },
    
    // 保持向后兼容性的别名
    async getStaffList(params = {}) {
      return this.fetchStaffList(params);
    },

    // 获取人员详情
    async getStaffDetail(userId) {
      try {
        const response = await getStaffById(userId);
        const staff = response.data;
        
        this.currentStaff = {...staff};  // 使用浅拷贝避免引用问题
        return {...staff};  // 返回一个新对象避免引用问题
      } catch (error) {
        throw error;
      }
    },

    // 添加人员
    async addStaff(staffData) {
      try {
        const response = await createStaff(staffData);
        const newStaff = response.data;
        
        // 添加到列表
        this.staffList.push(newStaff);
        return newStaff;
      } catch (error) {
        throw new Error('添加人员失败');
      }
    },

    // 更新人员
    async updateStaff(staffData) {
      try {
        const response = await updateStaff(staffData);
        const updatedStaff = response.data;
        
        // 更新列表中的数据
        const index = this.staffList.findIndex(staff => staff.userId === updatedStaff.userId);
        if (index !== -1) {
          this.staffList[index] = updatedStaff;
        }
        
        // 更新当前人员
        if (this.currentStaff && this.currentStaff.userId === updatedStaff.userId) {
          this.currentStaff = updatedStaff;
        }
        
        return updatedStaff;
      } catch (error) {
        throw new Error('更新人员失败');
      }
    },

    // 删除人员
    async deleteStaff(userId) {
      try {
        await deleteStaff(userId);
        
        // 从列表中移除
        const index = this.staffList.findIndex(staff => staff.userId === userId);
        if (index !== -1) {
          this.staffList.splice(index, 1);
        }
        
        // 清除当前人员
        if (this.currentStaff && this.currentStaff.userId === userId) {
          this.currentStaff = null;
        }
        
        return true;
      } catch (error) {
        throw new Error('删除人员失败');
      }
    },

    // 上传人员证件
    async uploadStaffDocument(formData) {
      try {
        const file = formData.get('file');
        const type = formData.get('type');
        const staffId = formData.get('staffId');

        // 验证文件类型
        if (!file || !this.supportedFileTypes.includes(file.type)) {
          throw new Error('不支持的文件格式');
        }

        // 验证文件大小
        if (file.size > this.maxFileSize) {
          throw new Error('文件大小超过限制');
        }

        // 验证上传类型
        const validTypes = ['driverLicense', 'idCard', 'insurance'];
        if (!validTypes.includes(type)) {
          throw new Error('无效的证件类型');
        }

        // 验证人员ID
        if (!staffId) {
          throw new Error('未提供人员ID');
        }

        const response = await uploadStaffDocument(formData);
        const result = response.data;
        
        // 更新当前人员的证件信息
        const urlKey = `${type}Url`;
        if (this.currentStaff && this.currentStaff.userId === staffId) {
          this.currentStaff[urlKey] = result.url;
        }
        
        // 同时更新staffList中的数据
        const index = this.staffList.findIndex(s => s.userId === staffId);
        if (index !== -1) {
          this.staffList[index][urlKey] = result.url;
        }
        
        return result;
      } catch (error) {
        throw error;
      }
    },

    // 删除人员证件
    async deleteStaffDocument(staffId, type) {
      try {
        if (!staffId || !type) {
          throw new Error('缺少必要参数');
        }

        // 验证上传类型
        const validTypes = ['driverLicense', 'idCard', 'insurance'];
        if (!validTypes.includes(type)) {
          throw new Error('无效的证件类型');
        }

        await deleteStaffDocument(staffId, type);
        
        // 更新当前人员的证件信息
        const urlKey = `${type}Url`;
        if (this.currentStaff && this.currentStaff.userId === staffId) {
          this.currentStaff[urlKey] = '';
        }
        
        // 更新staffList中的数据
        const index = this.staffList.findIndex(s => s.userId === staffId);
        if (index !== -1) {
          this.staffList[index][urlKey] = '';
        }
        
        return true;
      } catch (error) {
        throw error;
      }
    },

    // 获取驾驶员列表
    async fetchDriverList(params = {}) {
      try {
        const response = await getDriverList(params);
        const driverData = response.data || [];
        
        // 过滤出驾驶员数据并更新到staffList
        const drivers = driverData.map(driver => ({
          ...driver,
          type: 'DRIVER'
        }));
        
        // 替换现有驾驶员数据
        this.staffList = this.staffList.filter(staff => staff.type !== 'DRIVER').concat(drivers);
        
        return drivers;
      } catch (error) {
        throw new Error('获取驾驶员列表失败');
      }
    },

    // 获取驾驶员详情
    async getDriverDetail(driverId) {
      try {
        const response = await getDriverById(driverId);
        const driver = response.data;
        
        this.currentStaff = {...driver};  // 使用浅拷贝避免引用问题
        return {...driver};  // 返回一个新对象避免引用问题
      } catch (error) {
        throw error;
      }
    },

    // 添加驾驶员
    async addDriver(driverData) {
      try {
        const response = await createDriver(driverData);
        const newDriver = response.data;
        
        // 添加到列表
        this.staffList.push(newDriver);
        return newDriver;
      } catch (error) {
        throw new Error('添加驾驶员失败');
      }
    },

    // 更新驾驶员
    async updateDriver(driverData) {
      try {
        const response = await updateDriver(driverData);
        const updatedDriver = response.data;
        
        // 更新列表中的数据
        const index = this.staffList.findIndex(staff => staff.userId === updatedDriver.userId);
        if (index !== -1) {
          this.staffList[index] = updatedDriver;
        }
        
        // 更新当前人员
        if (this.currentStaff && this.currentStaff.userId === updatedDriver.userId) {
          this.currentStaff = updatedDriver;
        }
        
        return updatedDriver;
      } catch (error) {
        throw new Error('更新驾驶员失败');
      }
    },

    // 删除驾驶员
    async deleteDriver(driverId) {
      try {
        await deleteDriver(driverId);
        
        // 从列表中移除
        const index = this.staffList.findIndex(staff => staff.userId === driverId);
        if (index !== -1) {
          this.staffList.splice(index, 1);
        }
        
        // 清除当前人员
        if (this.currentStaff && this.currentStaff.userId === driverId) {
          this.currentStaff = null;
        }
        
        return true;
      } catch (error) {
        throw new Error('删除驾驶员失败');
      }
    }
  }
});

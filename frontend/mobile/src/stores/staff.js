import { defineStore } from 'pinia';
import { getStaffList, getStaffById, createStaff, updateStaff, deleteStaff, uploadStaffDocument, deleteStaffDocument } from '@/api/staff';

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
        console.log('Store - Fetching staff list from API...');
        const response = await getStaffList(params);
        const staffData = response.data || [];
        this.staffList = staffData;
        this.initialized = true;
        console.log('Store - Staff list fetched:', staffData.length, 'items');
        return staffData;
      } catch (error) {
        console.error('Store - Error fetching staff list:', error);
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
        console.log('Store - Getting staff detail for ID:', userId);
        const response = await getStaffById(userId);
        const staff = response.data;
        
        console.log('Store - Found staff detail:', staff);
        this.currentStaff = {...staff};  // 使用浅拷贝避免引用问题
        return {...staff};  // 返回一个新对象避免引用问题
      } catch (error) {
        console.error('Store - Error getting staff detail:', error);
        throw error;
      }
    },

    // 添加人员
    async addStaff(staffData) {
      try {
        console.log('Store - Adding new staff:', staffData);
        const response = await createStaff(staffData);
        const newStaff = response.data;
        
        // 添加到列表
        this.staffList.push(newStaff);
        console.log('Store - Staff added successfully:', newStaff);
        return newStaff;
      } catch (error) {
        console.error('Store - Error adding staff:', error);
        throw new Error('添加人员失败');
      }
    },

    // 更新人员
    async updateStaff(staffData) {
      try {
        console.log('Store - Updating staff:', staffData);
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
        
        console.log('Store - Staff updated successfully:', updatedStaff);
        return updatedStaff;
      } catch (error) {
        console.error('Store - Error updating staff:', error);
        throw new Error('更新人员失败');
      }
    },

    // 删除人员
    async deleteStaff(userId) {
      try {
        console.log('Store - Deleting staff:', userId);
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
        
        console.log('Store - Staff deleted successfully');
        return true;
      } catch (error) {
        console.error('Store - Error deleting staff:', error);
        throw new Error('删除人员失败');
      }
    },

    // 上传人员证件
    async uploadStaffDocument(formData) {
      try {
        console.log('Store - Uploading staff document');
        
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
        
        console.log('Store - Upload successful:', result);
        
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
        console.error('Store - Error uploading document:', error);
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
        console.error('Store - Error deleting document:', error);
        throw error;
      }
    }
  }
});

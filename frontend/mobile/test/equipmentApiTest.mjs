#!/usr/bin/env node
// Equipment API Test Script

import path from 'path';
import { fileURLToPath } from 'url';

// Mock environment for testing
global.process = { env: {} };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testEquipmentAPI() {
  console.log('🔧 Testing Equipment API...\n');

  try {
    // Import the equipment API
    const equipmentModule = await import('../src/api/equipment.js');
    
    console.log('✅ Equipment API module loaded successfully');
    console.log('📋 Available functions:', Object.keys(equipmentModule));
    
    // Test getEquipments function
    console.log('\n🧪 Testing getEquipments()...');
    const equipmentResult = await equipmentModule.getEquipments({ page: 1, size: 5 });
    console.log('✅ getEquipments() successful');
    console.log('📊 Result structure:', {
      hasData: !!equipmentResult.data,
      dataType: Array.isArray(equipmentResult.data?.content) ? 'array' : typeof equipmentResult.data,
      itemCount: equipmentResult.data?.content?.length || 0,
      totalItems: equipmentResult.data?.pageable?.total || 0
    });
    
    if (equipmentResult.data?.content?.length > 0) {
      console.log('📋 Sample equipment:', {
        id: equipmentResult.data.content[0].equipmentId,
        name: equipmentResult.data.content[0].equipmentName,
        type: equipmentResult.data.content[0].equipmentType,
        status: equipmentResult.data.content[0].status
      });
    }
    
    // Test getEquipmentById function
    if (equipmentResult.data?.content?.length > 0) {
      const firstEquipmentId = equipmentResult.data.content[0].equipmentId;
      console.log('\n🧪 Testing getEquipmentById()...');
      const equipmentByIdResult = await equipmentModule.getEquipmentById(firstEquipmentId);
      console.log('✅ getEquipmentById() successful');
      console.log('📋 Equipment details:', {
        id: equipmentByIdResult.data.equipmentId,
        name: equipmentByIdResult.data.equipmentName,
        hasAllFields: !!(equipmentByIdResult.data.equipmentName && equipmentByIdResult.data.equipmentType)
      });
    }
    
    // Test getEquipmentApplications function
    console.log('\n🧪 Testing getEquipmentApplications()...');
    const applicationResult = await equipmentModule.getEquipmentApplications({ page: 1, size: 3 });
    console.log('✅ getEquipmentApplications() successful');
    console.log('📊 Application result structure:', {
      hasData: !!applicationResult.data,
      dataType: Array.isArray(applicationResult.data?.content) ? 'array' : typeof applicationResult.data,
      itemCount: applicationResult.data?.content?.length || 0,
      totalItems: applicationResult.data?.pageable?.total || 0
    });
    
    console.log('\n🎉 All Equipment API tests passed!');
    console.log('🌐 The equipment page should now work properly at http://localhost:5173/equipment/apply');
    
  } catch (error) {
    console.error('❌ Equipment API test failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
}

testEquipmentAPI();

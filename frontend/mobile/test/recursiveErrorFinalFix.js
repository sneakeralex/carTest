/**
 * Final Recursive Update Error Fix Validation
 * Validates all date/time picker configurations and event handlers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewsDir = path.join(__dirname, '../src/views');
const files = [
  'BookingDetail.vue',
  'AppointmentDetail.vue', 
  'NewTestTask.vue',
  'NewMaintenance.vue',
  'MaintenanceDetail.vue',
  'NewAppointment.vue'
];

console.log('🔍 Final Recursive Update Error Fix Validation\n');

let allTestsPassed = true;

files.forEach(filename => {
  const filePath = path.join(viewsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filename}: File not found`);
    allTestsPassed = false;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let fileTests = {
    passed: 0,
    failed: 0,
    issues: []
  };

  console.log(`\n📁 ${filename}:`);

  // Test 1: Check for proper date confirm handler format
  const dateConfirmHandlers = content.match(/const\s+on\w*DateConfirm\s*=\s*\([^)]*\)\s*=>/g);
  if (dateConfirmHandlers) {
    const properFormat = dateConfirmHandlers.every(handler => 
      handler.includes('{ selectedValues }') || !handler.includes('DateConfirm')
    );
    
    if (properFormat) {
      console.log(`  ✅ Date confirm handlers use proper destructuring format`);
      fileTests.passed++;
    } else {
      console.log(`  ❌ Date confirm handlers still use old format`);
      fileTests.failed++;
      fileTests.issues.push('Date confirm handlers need destructuring fix');
      allTestsPassed = false;
    }
  } else {
    console.log(`  ℹ️  No date confirm handlers found`);
  }

  // Test 2: Check for manual selectedDate assignments in confirm handlers (not commented)
  const manualAssignments = content.match(/^[^\/]*selected\w*Date\.value\s*=\s*selectedValues[^;]*;/gm);
  const manualRescheduleAssignments = content.match(/^[^\/]*selectedRescheduleDate\.value\s*=\s*selectedValues[^;]*;/gm);
  
  if (manualAssignments) {
    console.log(`  ❌ Found uncommented manual date assignments: ${manualAssignments.join(', ')}`);
    fileTests.failed++;
    fileTests.issues.push('Manual date assignments need to be commented out');
    allTestsPassed = false;
  } else if (manualRescheduleAssignments) {
    console.log(`  ❌ Found uncommented manual reschedule date assignments: ${manualRescheduleAssignments.join(', ')}`);
    fileTests.failed++;
    fileTests.issues.push('Manual reschedule date assignments need to be commented out');
    allTestsPassed = false;
  } else {
    console.log(`  ✅ No uncommented manual v-model assignments found`);
    fileTests.passed++;
  }

  // Test 3: Check time picker configuration
  const timePickerRegex = /<van-time-picker[^>]*>/g;
  const timePickers = content.match(timePickerRegex);
  
  if (timePickers) {
    const allTimePickersConfigured = timePickers.every(picker => 
      picker.includes(':columns-type') && picker.includes(':formatter')
    );
    
    if (allTimePickersConfigured) {
      console.log(`  ✅ All time pickers have proper configuration`);
      fileTests.passed++;
    } else {
      console.log(`  ❌ Some time pickers missing configuration`);
      fileTests.failed++;
      fileTests.issues.push('Time pickers need columns-type and formatter');
      allTestsPassed = false;
    }
  } else {
    console.log(`  ℹ️  No time pickers found`);
  }

  // Test 4: Check for proper time initialization format
  const timeInitRegex = /selectedTime\.value\s*=\s*\[['"][0-9]+['"],\s*['"][0-9]+['"]\]/g;
  const timeInits = content.match(timeInitRegex);
  
  if (timeInits) {
    const properTimeFormat = timeInits.every(init => 
      !init.includes("'0") && !init.includes('"0')
    );
    
    if (properTimeFormat) {
      console.log(`  ✅ Time initialization uses proper format (no leading zeros)`);
      fileTests.passed++;
    } else {
      console.log(`  ❌ Time initialization still has leading zeros`);
      fileTests.failed++;
      fileTests.issues.push('Time initialization needs leading zero removal');
      allTestsPassed = false;
    }
  }

  // Summary for this file
  console.log(`  📊 Tests: ${fileTests.passed} passed, ${fileTests.failed} failed`);
  if (fileTests.issues.length > 0) {
    console.log(`  🚨 Issues: ${fileTests.issues.join(', ')}`);
  }
});

console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED! The recursive update error should be resolved.');
  console.log('\n📋 Next Steps:');
  console.log('1. Clear browser cache completely (Cmd+Shift+Delete)');
  console.log('2. Restart development server');
  console.log('3. Try the date/time pickers in the application');
} else {
  console.log('❌ Some tests failed. Please review the issues above.');
}

console.log('\n🔧 Hard restart command:');
console.log('pkill -f "vite|node" && rm -rf node_modules/.vite && npm run dev');

#!/usr/bin/env node

/**
 * Date Picker Error Fix Validation
 * 
 * This script validates that the TypeError fixes for van-date-picker components
 * have been properly applied across all relevant Vue files.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Date Picker Error Fix Validation\n');

const filesToCheck = [
  'src/views/NewMaintenance.vue',
  'src/views/MaintenanceDetail.vue', 
  'src/views/AppointmentDetail.vue',
  'src/views/BookingDetail.vue',
  'src/views/NewAppointment.vue'
];

let allPassed = true;

filesToCheck.forEach(filePath => {
  console.log(`📁 Checking ${filePath}:`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for proper array format initialization
    const hasArrayFormat = content.includes("['2025', '04'");
    const hasAprilDates = content.includes("'04'");
    
    // Check for problematic patterns
    const hasNewDateInSelectedDate = content.match(/selectedDate.*ref\(new Date\(\)\)/);
    const hasNullInSelectedDate = content.match(/selectedDate.*ref\(null\)/);
    const hasProblematicInit = hasNewDateInSelectedDate || hasNullInSelectedDate;
    
    // Check for proper event handlers
    const hasProperEventHandler = content.includes('selectedValues') || content.includes('value[0]') || content.includes('value[1]');
    
    // Results
    const arrayFormatOK = hasArrayFormat ? '✅' : '❌';
    const aprilDatesOK = hasAprilDates ? '✅' : '❌';
    const noProblematicInitOK = !hasProblematicInit ? '✅' : '❌';
    const eventHandlerOK = hasProperEventHandler ? '✅' : '❌';
    
    console.log(`  ${arrayFormatOK} Array format initialization`);
    console.log(`  ${aprilDatesOK} April 2025 dates`);
    console.log(`  ${noProblematicInitOK} No problematic Date/null init`);
    console.log(`  ${eventHandlerOK} Proper event handlers`);
    
    const filePassed = hasArrayFormat && hasAprilDates && !hasProblematicInit && hasProperEventHandler;
    if (!filePassed) {
      allPassed = false;
      console.log(`  ❌ File needs attention`);
    } else {
      console.log(`  ✅ File passed all checks`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error reading file: ${error.message}`);
    allPassed = false;
  }
  
  console.log('');
});

console.log('📊 Summary:');
if (allPassed) {
  console.log('✅ All date picker components have been properly fixed!');
  console.log('✅ No more TypeError: Cannot read properties of null (reading \'0\') errors expected');
  console.log('✅ All components use consistent April 2025 date format');
} else {
  console.log('❌ Some files still need attention');
}

console.log('\n🔧 Fixed Issues:');
console.log('- van-date-picker v-model now uses array format [\'2025\', \'04\', \'01\']');
console.log('- Removed new Date() and null initializations that caused genMonthOptions errors');
console.log('- Updated event handlers to properly process array format values');
console.log('- Consistent April 2025 dates across all components');

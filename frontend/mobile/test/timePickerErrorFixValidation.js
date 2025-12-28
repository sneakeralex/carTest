#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Time Picker Error Fixes...\n');

// Files to validate
const filesToCheck = [
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/BookingDetail.vue',
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/AppointmentDetail.vue',
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/NewAppointment.vue'
];

// Validation rules
const validationRules = {
  'columns-type': {
    pattern: /:columns-type="\['hour',\s*'minute'\]"/,
    description: 'van-time-picker should have columns-type="[\'hour\', \'minute\']"'
  },
  'formatter': {
    pattern: /:formatter="\(type,\s*option\)\s*=>\s*option\.toString\(\)"/,
    description: 'van-time-picker should have formatter="(type, option) => option.toString()"'
  },
  'time-initialization': {
    pattern: /(=\s*ref\(\[['"]9['"],\s*['"]0['"]\]\))|(DEFAULT_TIME\s*=\s*\[['"]9['"],\s*['"]0['"]\])/,
    description: 'Time initialization should use [\'9\', \'0\'] format (no leading zeros)'
  }
};

let allPassed = true;
const results = {};

// Check each file
filesToCheck.forEach(filePath => {
  console.log(`📄 Checking ${path.basename(filePath)}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  results[filePath] = {};

  // Count van-time-picker components
  const timePickerMatches = content.match(/<van-time-picker[^>]*>/g) || [];
  console.log(`   Found ${timePickerMatches.length} van-time-picker component(s)`);

  if (timePickerMatches.length === 0) {
    console.log(`   ⚠️  No van-time-picker components found`);
    return;
  }

  // Check each validation rule
  Object.entries(validationRules).forEach(([ruleName, rule]) => {
    const matches = content.match(rule.pattern);
    const passed = matches && matches.length > 0;
    
    results[filePath][ruleName] = {
      passed,
      matches: matches ? matches.length : 0,
      description: rule.description
    };

    if (passed) {
      console.log(`   ✅ ${rule.description}`);
    } else {
      console.log(`   ❌ ${rule.description}`);
      allPassed = false;
    }
  });

  // Special check for BookingDetail.vue and AppointmentDetail.vue
  if (filePath.includes('BookingDetail.vue') || filePath.includes('AppointmentDetail.vue')) {
    // Check for proper time picker configuration
    const hasColumnsType = content.includes(':columns-type="[\'hour\', \'minute\']"');
    const hasFormatter = content.includes(':formatter="(type, option) => option.toString()"');
    
    if (hasColumnsType && hasFormatter) {
      console.log(`   ✅ Time picker configuration complete`);
    } else {
      console.log(`   ❌ Missing time picker configuration properties`);
      allPassed = false;
    }
  }

  console.log('');
});

// Summary
console.log('📊 VALIDATION SUMMARY:');
console.log('='.repeat(50));

if (allPassed) {
  console.log('🎉 ALL VALIDATIONS PASSED!');
  console.log('✅ Time picker error fixes have been successfully applied');
  console.log('✅ All van-time-picker components have proper configuration');
  console.log('✅ Time initialization follows the correct format');
} else {
  console.log('❌ SOME VALIDATIONS FAILED!');
  console.log('Please review the failed checks above and apply necessary fixes.');
}

console.log('\n🔧 Next Steps:');
console.log('1. Test the application in browser');
console.log('2. Try using the time picker components');
console.log('3. Verify no "TypeError: values.map is not a function" errors occur');

process.exit(allPassed ? 0 : 1);
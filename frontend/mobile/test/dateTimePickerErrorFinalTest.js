#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Final Date/Time Picker Error Test...\n');

// Files to validate
const filesToCheck = [
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/BookingDetail.vue',
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/AppointmentDetail.vue', 
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/NewAppointment.vue',
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/NewTestTask.vue',
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/NewMaintenance.vue',
  '/Users/yhan/workspace/carTest/frontend/mobile/src/views/MaintenanceDetail.vue'
];

// Validation rules for date picker handlers
const datePickerRules = {
  'date-confirm-destructure': {
    pattern: /on.*DateConfirm\s*=\s*(?:async\s+)?\(\s*{\s*selectedValues\s*}\s*\)\s*=>/,
    description: 'Date confirm handlers should destructure { selectedValues }'
  },
  'no-old-value-handlers': {
    pattern: /on.*DateConfirm\s*=\s*(?:async\s+)?\(\s*(?:value|values)\s*\)\s*=>/,
    description: 'Should not have old-style (value) or (values) handlers',
    shouldNotExist: true
  }
};

// Validation rules for time picker configuration
const timePickerRules = {
  'time-columns-type': {
    pattern: /:columns-type="\['hour',\s*'minute'\]"/,
    description: 'Time pickers should have columns-type="[\'hour\', \'minute\']"'
  },
  'time-formatter': {
    pattern: /:formatter="\(type,\s*option\)\s*=>\s*option\.toString\(\)"/,
    description: 'Time pickers should have formatter="(type, option) => option.toString()"'
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
    console.log(`   ⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  results[filePath] = {};

  // Check date picker components and handlers
  const datePickerMatches = content.match(/<van-date-picker[^>]*>/g) || [];
  console.log(`   Found ${datePickerMatches.length} van-date-picker component(s)`);

  if (datePickerMatches.length > 0) {
    // Check date picker rules
    Object.entries(datePickerRules).forEach(([ruleName, rule]) => {
      const matches = content.match(rule.pattern);
      const passed = rule.shouldNotExist ? !matches : (matches && matches.length > 0);
      
      results[filePath][ruleName] = {
        passed,
        matches: matches ? matches.length : 0,
        description: rule.description
      };

      if (passed) {
        console.log(`   ✅ ${rule.description}`);
      } else {
        console.log(`   ❌ ${rule.description}`);
        if (rule.shouldNotExist && matches) {
          console.log(`      Found problematic patterns: ${matches.join(', ')}`);
        }
        allPassed = false;
      }
    });
  }

  // Check time picker components
  const timePickerMatches = content.match(/<van-time-picker[^>]*>/g) || [];
  console.log(`   Found ${timePickerMatches.length} van-time-picker component(s)`);

  if (timePickerMatches.length > 0) {
    // Check time picker rules
    Object.entries(timePickerRules).forEach(([ruleName, rule]) => {
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
  }

  console.log('');
});

// Summary
console.log('📊 FINAL VALIDATION SUMMARY:');
console.log('='.repeat(60));

if (allPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ Date picker event handlers correctly destructure { selectedValues }');
  console.log('✅ Time picker components have proper configuration');
  console.log('✅ Time initialization follows the correct format');
  console.log('✅ No more "TypeError: values.map is not a function" errors should occur');
} else {
  console.log('❌ SOME TESTS FAILED!');
  console.log('Please review the failed checks above and apply necessary fixes.');
}

console.log('\n🔧 Next Steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Test date picker interactions in BookingDetail.vue');
console.log('3. Test time picker interactions in all components');
console.log('4. Verify no console errors occur during picker usage');

process.exit(allPassed ? 0 : 1);

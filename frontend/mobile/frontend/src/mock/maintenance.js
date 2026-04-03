import Mock from 'mockjs';
import { mockResponse } from './utils.js';

// No mock maintenance records — UI will render empty state when backend has no maintenance data.
export const maintenanceList = [];

export function getMaintenances(config) {
  return { data: { records: [], total: 0 }, status: 200 };
}

export function getMaintenanceRecords(config) {
  return getMaintenances(config);
}

export function getMaintenanceById(config) {
  return { data: null, status: 200 };
}

export function createMaintenance(config) {
  throw new Error('No mock maintenance data');
}

export function updateMaintenance(config) {
  throw new Error('No mock maintenance data');
}

export function deleteMaintenance(config) {
  throw new Error('No mock maintenance data');
}

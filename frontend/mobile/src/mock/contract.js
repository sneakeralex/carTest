import Mock from 'mockjs';
import { mockResponse } from './utils.js';

// No mock contracts — UI will render empty state when backend has no contract data.
export const contractList = [];

export function getContracts(config) {
  return { data: [], total: 0, status: 200 };
}

export function getContractById(config) {
  return { data: null, status: 200 };
}

export function createContract(config) {
  throw new Error('No mock contract data');
}

export function updateContract(config) {
  throw new Error('No mock contract data');
}

export function deleteContract(config) {
  throw new Error('No mock contract data');
}

import { HealthRecord, CreateHealthRecordInput, HealthRecordType } from '../types/health.types';
import { getAuthHeader } from './auth.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface TimelineFilters {
  type?: HealthRecordType;
  fromDate?: string;
  toDate?: string;
}

export async function getHealthTimeline(
  petId: string,
  filters?: TimelineFilters
): Promise<HealthRecord[]> {
  const headers = await getAuthHeader();
  
  let url = `${API_BASE_URL}/api/pets/${petId}/health`;
  const params = new URLSearchParams();
  
  if (filters?.type) {
    params.append('type', filters.type);
  }
  if (filters?.fromDate) {
    params.append('fromDate', filters.fromDate);
  }
  if (filters?.toDate) {
    params.append('toDate', filters.toDate);
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch health timeline');
  }

  return response.json();
}

export async function getHealthRecordById(
  petId: string,
  recordId: string
): Promise<HealthRecord> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/health/${recordId}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch health record');
  }

  return response.json();
}

export async function createHealthRecord(
  petId: string,
  input: CreateHealthRecordInput
): Promise<HealthRecord> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/health`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create health record');
  }

  return response.json();
}

export async function updateHealthRecord(
  petId: string,
  recordId: string,
  input: CreateHealthRecordInput
): Promise<HealthRecord> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/health/${recordId}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update health record');
  }

  return response.json();
}

export async function deleteHealthRecord(
  petId: string,
  recordId: string
): Promise<void> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/health/${recordId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete health record');
  }
}

export async function getUpcomingVaccinations(
  petId: string,
  daysAhead: number = 7
): Promise<HealthRecord[]> {
  const headers = await getAuthHeader();

  const response = await fetch(
    `${API_BASE_URL}/api/pets/${petId}/health/vaccinations/upcoming?days=${daysAhead}`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming vaccinations');
  }

  return response.json();
}

export async function getActiveMedications(petId: string): Promise<HealthRecord[]> {
  const headers = await getAuthHeader();

  const response = await fetch(
    `${API_BASE_URL}/api/pets/${petId}/health/medications/active`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch active medications');
  }

  return response.json();
}

export default {
  getHealthTimeline,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getUpcomingVaccinations,
  getActiveMedications,
};
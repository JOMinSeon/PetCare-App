import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { HealthRecord, CreateHealthRecordInput, HealthRecordType } from '../types/health.types';
import * as healthService from '../services/health.service';

interface HealthContextType {
  records: HealthRecord[];
  selectedRecord: HealthRecord | null;
  isLoading: boolean;
  error: string | null;
  fetchTimeline: (petId: string, filters?: { type?: HealthRecordType }) => Promise<void>;
  addRecord: (petId: string, input: CreateHealthRecordInput) => Promise<HealthRecord>;
  updateRecord: (petId: string, recordId: string, input: CreateHealthRecordInput) => Promise<HealthRecord>;
  removeRecord: (petId: string, recordId: string) => Promise<void>;
  clearError: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = useCallback(async (petId: string, filters?: { type?: HealthRecordType }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await healthService.getHealthTimeline(petId, filters);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health timeline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRecord = useCallback(async (petId: string, input: CreateHealthRecordInput): Promise<HealthRecord> => {
    setError(null);
    const newRecord = await healthService.createHealthRecord(petId, input);
    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  }, []);

  const updateRecord = useCallback(async (
    petId: string,
    recordId: string,
    input: CreateHealthRecordInput
  ): Promise<HealthRecord> => {
    setError(null);
    const updatedRecord = await healthService.updateHealthRecord(petId, recordId, input);
    setRecords(prev => prev.map(r => r.id === recordId ? updatedRecord : r));
    if (selectedRecord?.id === recordId) {
      setSelectedRecord(updatedRecord);
    }
    return updatedRecord;
  }, [selectedRecord]);

  const removeRecord = useCallback(async (petId: string, recordId: string) => {
    setError(null);
    await healthService.deleteHealthRecord(petId, recordId);
    setRecords(prev => prev.filter(r => r.id !== recordId));
    if (selectedRecord?.id === recordId) {
      setSelectedRecord(null);
    }
  }, [selectedRecord]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <HealthContext.Provider
      value={{
        records,
        selectedRecord,
        isLoading,
        error,
        fetchTimeline,
        addRecord,
        updateRecord,
        removeRecord,
        clearError,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth(): HealthContextType {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within HealthProvider');
  }
  return context;
}

export default HealthContext;
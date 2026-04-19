import { create } from 'zustand';
import { medicalRecordService, MedicalRecord, MedicalRecordType, CreateMedicalRecordRequest, UpdateMedicalRecordRequest } from '../services/medicalRecord.service';

interface MedicalRecordState {
  records: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: (petId: string, type?: MedicalRecordType) => Promise<void>;
  createRecord: (petId: string, data: CreateMedicalRecordRequest) => Promise<void>;
  updateRecord: (petId: string, recordId: string, data: UpdateMedicalRecordRequest) => Promise<void>;
  deleteRecord: (petId: string, recordId: string) => Promise<void>;
  clearRecords: () => void;
}

export const useMedicalRecordStore = create<MedicalRecordState>((set) => ({
  records: [],
  isLoading: false,
  error: null,

  fetchRecords: async (petId: string, type?: MedicalRecordType) => {
    set({ isLoading: true, error: null });
    try {
      const records = await medicalRecordService.getRecords(petId, type);
      set({ records, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createRecord: async (petId: string, data: CreateMedicalRecordRequest) => {
    set({ isLoading: true, error: null });
    try {
      const record = await medicalRecordService.createRecord(petId, data);
      set((state) => ({ records: [record, ...state.records], isLoading: false }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateRecord: async (petId: string, recordId: string, data: UpdateMedicalRecordRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await medicalRecordService.updateRecord(petId, recordId, data);
      set((state) => ({
        records: state.records.map((r) => (r.id === recordId ? updated : r)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteRecord: async (petId: string, recordId: string) => {
    set({ isLoading: true, error: null });
    try {
      await medicalRecordService.deleteRecord(petId, recordId);
      set((state) => ({
        records: state.records.filter((r) => r.id !== recordId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearRecords: () => set({ records: [], error: null }),
}));
import { create } from 'zustand';
import { symptomService } from '../services/symptom.service';
import { Symptom, CreateSymptomRequest } from '../types';

interface RiskFactor {
  type: string;
  description: string;
}

interface SymptomAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendation: string;
  disclaimer: string;
  triggeredPatterns: RiskFactor[];
}

interface SymptomState {
  symptoms: Symptom[];
  currentSymptom: Symptom | null;
  lastAnalysis: SymptomAnalysis | null;
  isLoading: boolean;
  error: string | null;
  fetchSymptoms: (petId: string) => Promise<void>;
  createSymptom: (petId: string, data: CreateSymptomRequest) => Promise<SymptomAnalysis>;
  updateSymptom: (petId: string, symptomId: string, data: Partial<CreateSymptomRequest>) => Promise<void>;
  deleteSymptom: (petId: string, symptomId: string) => Promise<void>;
  clearSymptoms: () => void;
  setCurrentSymptom: (symptom: Symptom | null) => void;
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  symptoms: [],
  currentSymptom: null,
  lastAnalysis: null,
  isLoading: false,
  error: null,

  fetchSymptoms: async (petId: string) => {
    set({ isLoading: true, error: null });
    try {
      const symptoms = await symptomService.getSymptoms(petId);
      set({ symptoms, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createSymptom: async (petId: string, data: CreateSymptomRequest) => {
    set({ isLoading: true, error: null });
    try {
      const result = await symptomService.createSymptom(petId, data);
      const analysis: SymptomAnalysis = {
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        riskFactors: result.riskFactors,
        recommendation: result.recommendation,
        disclaimer: result.disclaimer,
        triggeredPatterns: result.triggeredPatterns,
      };
      set((state) => ({
        symptoms: [result as unknown as Symptom, ...state.symptoms],
        lastAnalysis: analysis,
        isLoading: false,
      }));
      return analysis;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateSymptom: async (petId: string, symptomId: string, data: Partial<CreateSymptomRequest>) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await symptomService.updateSymptom(petId, symptomId, data);
      set((state) => ({
        symptoms: state.symptoms.map((s) => (s.id === symptomId ? updated : s)),
        currentSymptom: state.currentSymptom?.id === symptomId ? updated : state.currentSymptom,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteSymptom: async (petId: string, symptomId: string) => {
    set({ isLoading: true, error: null });
    try {
      await symptomService.deleteSymptom(petId, symptomId);
      set((state) => ({
        symptoms: state.symptoms.filter((s) => s.id !== symptomId),
        currentSymptom: state.currentSymptom?.id === symptomId ? null : state.currentSymptom,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearSymptoms: () => set({ symptoms: [], currentSymptom: null, lastAnalysis: null }),

  setCurrentSymptom: (symptom) => set({ currentSymptom: symptom }),
}));
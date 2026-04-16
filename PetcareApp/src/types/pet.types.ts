export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePetInput {
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl?: string;
}

export interface UpdatePetInput {
  name?: string;
  species?: PetSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl?: string;
}

export const getSpeciesLabel = (species: PetSpecies): string => {
  const labels: Record<PetSpecies, string> = {
    [PetSpecies.DOG]: '개',
    [PetSpecies.CAT]: '고양이',
    [PetSpecies.BIRD]: '새',
    [PetSpecies.FISH]: '물고기',
    [PetSpecies.REPTILE]: '파충류',
    [PetSpecies.OTHER]: '기타',
  };
  return labels[species];
};

export const getSpeciesEmoji = (species: PetSpecies): string => {
  const emojis: Record<PetSpecies, string> = {
    [PetSpecies.DOG]: '🐕',
    [PetSpecies.CAT]: '🐱',
    [PetSpecies.BIRD]: '🐦',
    [PetSpecies.FISH]: '🐟',
    [PetSpecies.REPTILE]: '🦎',
    [PetSpecies.OTHER]: '🐾',
  };
  return emojis[species];
};
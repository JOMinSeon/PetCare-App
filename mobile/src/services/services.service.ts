import apiService from './api';
import { Service, ServicesResponse } from '../types';

interface GetServicesParams {
  lat?: number;
  lng?: number;
  radius?: number;
  types?: string[];
  is24Hour?: boolean;
  isEmergency?: boolean;
}

export const getServices = async (params: GetServicesParams): Promise<ServicesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.lat !== undefined) queryParams.append('lat', params.lat.toString());
  if (params.lng !== undefined) queryParams.append('lng', params.lng.toString());
  if (params.radius !== undefined) queryParams.append('radius', params.radius.toString());
  if (params.types && params.types.length > 0) {
    queryParams.append('types', params.types.join(','));
  }
  if (params.is24Hour !== undefined) queryParams.append('is24Hour', params.is24Hour.toString());
  if (params.isEmergency !== undefined) queryParams.append('isEmergency', params.isEmergency.toString());

  const queryString = queryParams.toString();
  const url = `/services${queryString ? `?${queryString}` : ''}`;

  return apiService.get<ServicesResponse>(url);
};

export const getServiceById = async (id: string): Promise<{ service: Service }> => {
  return apiService.get<{ service: Service }>(`/services/${id}`);
};

export default {
  getServices,
  getServiceById,
};

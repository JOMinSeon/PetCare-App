import { Request, Response } from 'express';
import {
  MOCK_SERVICES,
  ServiceWithDistance,
  getServicesWithDistance,
  filterServices,
} from '../data/mockServices.js';

interface ServicesQuery {
  lat?: string;
  lng?: string;
  radius?: string; // in meters
  types?: string; // comma-separated: vet,pet_store,groomer
  is24Hour?: string;
  isEmergency?: string;
}

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      lat,
      lng,
      radius = '5000',
      types,
      is24Hour,
      isEmergency,
    } = req.query as ServicesQuery;

    // Default to Seoul if no location provided
    const userLat = lat ? parseFloat(lat) : 37.5665;
    const userLng = lng ? parseFloat(lng) : 126.9780;
    const radiusMeters = parseInt(radius, 10);

    // Validate coordinates
    if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      res.status(400).json({ error: 'Invalid coordinates' });
      return;
    }

    // Parse types filter
    const typesFilter = types
      ? types.split(',').map((t) => t.trim())
      : undefined;

    // Parse boolean filters
    const is24HourFilter = is24Hour === 'true';
    const isEmergencyFilter = isEmergency === 'true';

    // Get all services with distance calculated
    const servicesWithDistance = getServicesWithDistance(
      userLat,
      userLng,
      MOCK_SERVICES
    );

    // Apply filters
    const filteredServices = filterServices(servicesWithDistance, {
      types: typesFilter,
      is24Hour: is24Hour ? is24HourFilter : undefined,
      isEmergency: isEmergency ? isEmergencyFilter : undefined,
      radius: radiusMeters,
    });

    res.json({
      services: filteredServices,
      cached: false,
      count: filteredServices.length,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = MOCK_SERVICES.find((s) => s.id === id);

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

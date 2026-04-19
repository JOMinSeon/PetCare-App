import { Router } from 'express';
import { medicalRecordController } from '../controllers/medicalRecord.controller';

const router = Router();

router.get('/pets/:petId/medical-records', (req, res) => medicalRecordController.list(req, res));
router.get('/pets/:petId/medical-records/upcoming', (req, res) => medicalRecordController.upcoming(req, res));
router.get('/pets/:petId/medical-records/:recordId', (req, res) => medicalRecordController.get(req, res));
router.post('/pets/:petId/medical-records', (req, res) => medicalRecordController.create(req, res));
router.put('/pets/:petId/medical-records/:recordId', (req, res) => medicalRecordController.update(req, res));
router.delete('/pets/:petId/medical-records/:recordId', (req, res) => medicalRecordController.delete(req, res));

export default router;
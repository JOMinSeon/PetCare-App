import { Router } from 'express';
import { symptomController } from '../controllers/symptom.controller';

const router = Router();

router.get('/pets/:petId/symptoms', (req, res) => symptomController.list(req, res));
router.get('/pets/:petId/symptoms/analysis', (req, res) => symptomController.analysis(req, res));
router.get('/pets/:petId/symptoms/:symptomId', (req, res) => symptomController.get(req, res));
router.post('/pets/:petId/symptoms', (req, res) => symptomController.create(req, res));
router.put('/pets/:petId/symptoms/:symptomId', (req, res) => symptomController.update(req, res));
router.delete('/pets/:petId/symptoms/:symptomId', (req, res) => symptomController.delete(req, res));

export default router;
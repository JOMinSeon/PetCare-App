import { Router } from 'express';
import { dietController } from '../controllers/diet.controller';

const router = Router();

router.get('/pets/:petId/diets', (req, res) => dietController.list(req, res));
router.post('/pets/:petId/diets', (req, res) => dietController.create(req, res));
router.put('/pets/:petId/diets/:dietId', (req, res) => dietController.update(req, res));
router.delete('/pets/:petId/diets/:dietId', (req, res) => dietController.delete(req, res));
router.get('/pets/:petId/diets/stats', (req, res) => dietController.stats(req, res));

export default router;
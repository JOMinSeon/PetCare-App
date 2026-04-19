import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';

const router = Router();

router.get('/pets/:petId/activities', (req, res) => activityController.list(req, res));
router.post('/pets/:petId/activities', (req, res) => activityController.create(req, res));
router.put('/pets/:petId/activities/:activityId', (req, res) => activityController.update(req, res));
router.delete('/pets/:petId/activities/:activityId', (req, res) => activityController.delete(req, res));
router.get('/pets/:petId/activities/stats', (req, res) => activityController.stats(req, res));

export default router;
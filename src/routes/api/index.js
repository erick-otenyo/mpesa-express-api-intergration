import express from 'express';

import mpesa from './mpesa';

const router = express.Router();

router.use('/mpesa', mpesa);

export default router;

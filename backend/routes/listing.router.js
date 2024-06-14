import express from 'express'
import { createListing, deleteListing, getListing, updateListing } from '../controllers/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.post('/create', verifyToken, createListing)
router.delete('/deleteListing/:id', verifyToken, deleteListing)
router.post('/updateListing/:id', verifyToken, updateListing)
router.get('/getlisting/:id', getListing)

export default router
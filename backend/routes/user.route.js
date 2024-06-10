import express from 'express'
const router = express.Router()
import {deleteUser, getUserListing, test, updateUser} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

router.get('/test', test)
router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listing/:id', verifyToken, getUserListing)

export default router
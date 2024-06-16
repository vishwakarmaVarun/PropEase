import express from 'express'
const router = express.Router()
import {deleteUser, getUser, getUserListing, test, updateUser} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

router.get('/test', test)
router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listing/:id', verifyToken, getUserListing)
router.get('/:id', verifyToken, getUser)

export default router
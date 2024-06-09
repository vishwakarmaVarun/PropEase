import express from 'express'
const router = express.Router()
import {deleteUser, test, updateUser} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

router.get('/test', test)
router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)

export default router
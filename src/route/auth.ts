import express from "express"
import auth from "../controller/auth"

const router = express.Router()

router.post("/register", auth.register)

export default router
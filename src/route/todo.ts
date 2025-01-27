import express from "express"
import auth from "../controller/todo"


const router = express.Router()

router.post("/addPost", auth.addTodo)
router.post("/getAllTodo", auth.getAllTodo)
router.post("/deleteTodo", auth.deleteTodo)

export default router
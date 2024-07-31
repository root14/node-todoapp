import { Request, Response } from "express";
import { prisma } from '../app';
import dotenv from "dotenv"

dotenv.config()

const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { todoId } = req.body

        prisma.todo.delete({
            where: {
                id: todoId
            }
        }).then(() => {
            res.status(200).json({ success: true })
        }).catch((err) => {
            res.status(401).json({ error: err })
        })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const getAllTodo = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        prisma.user.findUnique({
            where: {
                email: email
            }
        }).then((user) => {
            prisma.todo.findMany({
                where: {
                    userId: user?.id
                }
            }).then((result) => {
                res.status(200).json({ todoList: result })
            }).catch((err) => {
                res.status(401).json({ error: err })
            })
        })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const addTodo = async (req: Request, res: Response) => {
    try {
        const { email, todo } = req.body

        prisma.user.update({
            where: {
                email: email,
            },
            data: {
                Todo: {
                    create: { task: todo },
                },
            },
            include: { Todo: true }
        }).then(() => {
            res.status(200).json({ success: true })
        }).catch((err) => {
            res.status(401).json({ error: err })
        })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

export default {
    addTodo, getAllTodo, deleteTodo
}
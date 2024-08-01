import { Request, Response } from "express";
import { prisma } from '../app';
import dotenv from "dotenv"

dotenv.config()

const createWorkSpace = async (req: Request, res: Response) => {
    try {

        const { email, workSpaceName } = req.body

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        const existWorkSpace = await prisma.workspace.findUnique({
            where: {
                name: workSpaceName
            }
        })

        if (existWorkSpace === null) {
            await prisma.workspace.create({
                data: {
                    userId: user?.id,
                    name: workSpaceName
                }
            })
            res.json(200).json({ succes: "workspace created." })
        }

    } catch (err) {
        res.status(500).json({ err })
    }
}

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
        const { email, workSpaceName } = req.body

        const existUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        }).catch((err) => {
            res.status(500).json(err)
        })

        const _workspace = await prisma.workspace.findUnique({
            where: {
                userId: existUser?.id,
                name: workSpaceName
            }
        })

        prisma.todo.findMany({
            where: {
                workspaceId: _workspace?.id,
            }
        }).then((result) => {
            res.status(200).json({ result })
        })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const addTodo = async (req: Request, res: Response) => {
    try {
        const { email, workSpaceName, todo } = req.body

        const existUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        }).catch((err) => {
            res.status(500).json(err)
        })

        const workSpace = await prisma.workspace.findUnique({
            where: {
                userId: existUser?.id,
                name: workSpaceName
            }
        })

        await prisma.todo.create({
            data: {
                task: todo,
                workspaceId: workSpace?.id
            }
        }).then(() => {
            res.status(200).json({ success: "success" })
        })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

export default {
    addTodo, getAllTodo, deleteTodo, createWorkSpace
}
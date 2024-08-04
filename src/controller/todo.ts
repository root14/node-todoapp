import { Request, Response } from "express"
import { prisma } from '../app'
import dotenv from "dotenv"

dotenv.config()

const createWorkSpace = async (req: Request, res: Response) => {
    try {
        const { email, workSpaceName } = req.body

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const existWorkSpace = await prisma.workspace.findFirst({
            where: {
                name: workSpaceName,
                userId: user.id
            }
        })

        if (!existWorkSpace) {
            await prisma.workspace.create({
                data: {
                    userId: user.id,
                    name: workSpaceName
                }
            })

            res.status(200).json({ success: "Workspace created." })
        } else {
            res.status(400).json({ error: "Workspace already exists." })
        }

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { email, todoId, workSpaceName } = req.body

        const user = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const workspace = await prisma.workspace.findFirst({
            where: {
                name: workSpaceName,
                userId: user.id
            }
        })

        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" })
        }

        const todo = await prisma.todo.findFirst({
            where: {
                id: todoId,
                workspaceId: workspace.id
            }
        })


        if (!todo) {
            return res.status(404).json({ error: "Todo not found" })
        }

        await prisma.todo.delete({
            where: { id: todo.id }
        })

        res.status(200).json({ success: "Todo deleted successfully" })

    } catch (err) {
        console.error('Error:', err)
        res.status(500).json({ error: err })
    }
}


const getAllTodo = async (req: Request, res: Response) => {
    try {
        const { email, workSpaceName } = req.body

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const workspace = await prisma.workspace.findFirst({
            where: {
                name: workSpaceName,
                userId: user.id
            },
            include: {
                todo: true
            }
        })

        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" })
        }

        res.status(200).json({ todos: workspace.todo })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

const addTodo = async (req: Request, res: Response) => {
    try {
        const { email, workSpaceName, todo } = req.body

        const existUser = await prisma.user.findUnique({
            where: { email }
        })

        if (!existUser) {
            return res.status(404).json({ error: "User cannot be found" })
        }

        let workSpace = await prisma.workspace.findFirst({
            where: {
                name: workSpaceName,
                userId: existUser.id
            }
        })

        if (!workSpace) {
            workSpace = await prisma.workspace.create({
                data: {
                    name: workSpaceName,
                    userId: existUser.id
                }
            })
        }

        await prisma.todo.create({
            data: {
                task: todo,
                workspaceId: workSpace.id
            }
        })

        res.status(200).json({ success: "Todo created successfully" })

    } catch (err) {
        res.status(500).json({ error: err })
    }
}

export default {
    addTodo, getAllTodo, deleteTodo, createWorkSpace
}

import { Request, Response } from "express";
import { prisma } from '../app';
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const addTodo = async (req: Request, res: Response) => {
    const { email, todo, token } = req.body

    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if (error) {
            res.status(401).json({ error: error })
        } else {
            //success
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
        }
    })
}

export default {
    addTodo
}
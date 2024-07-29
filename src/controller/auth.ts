import { Request, Response } from "express";
import { prisma } from '../app';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


const register = async (req: Request, res: Response) => {
    try {
        const { email, userName, password } = req.body

        const createUser = await prisma.user.create({
            data: {
                email,
                userName,
                password
            },
        })
        
        res.status(200).json({ createUser })
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                res.status(409).json({ error: "This email is already in use." })
            }
        }
        res.status(500).json({ error: err })
    }
}

export default {
    register
}
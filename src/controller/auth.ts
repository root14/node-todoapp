import { Request, Response } from "express";
import { prisma } from "../app"


const register = async (req: Request, res: Response) => {
    try {
        console.log("burada")
        const { email, userName, password } = req.body
        console.log(email)
        console.log(userName)
        console.log(password)


        const createUser = await prisma.user.create({
            data: {
                email,
                userName,
                password
            },
        })
        res.status(200).json({ createUser })


    } catch (err) {
        res.status(500).json({ error: err })
    }
}

export default {
    register
}
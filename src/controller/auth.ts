import { Request, Response } from "express";
import { prisma } from '../app';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const register = async (req: Request, res: Response) => {
    try {
        const { email, userName, plainPassword } = req.body
        console.log(email, userName, plainPassword)

        bcrypt.hash(plainPassword, 10, async (err, hashedPassword) => {
            if (err) { res.status(403).json({ error: err.message }) }
            else {
                prisma.user.create({
                    data: {
                        email: email,
                        userName: userName,
                        hashedPassword: hashedPassword
                    },
                }).then((createUser) => {
                    res.status(200).json({ createUser })
                })
            }
        })
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                res.status(409).json({ error: "This email is already in use." })
            }
        }
        res.status(500).json({ error: err })
    }
}

const login = async (req: Request, res: Response) => {
    const { email, plainPassword } = req.body

    await prisma.user.findUnique({
        where: {
            email: email,
        },
    }).then((storedUser) => {
        if (storedUser == null) {
            res.status(404).json({ error: "user cannot found" })
        } else {
            bcrypt.compare(plainPassword, storedUser.hashedPassword, (err, isMatch) => {
                if (err) { res.status(403).json({ error: err.message }) }
                if (isMatch) {
                    const token = jwt.sign({
                        email: storedUser.email,
                        userName: storedUser.userName
                    }, process.env.JWT_SECRET_KEY as string, { expiresIn: 60 * 60 })
                    prisma.user.update({
                        where: {
                            email: email,
                        },
                        data: {
                            token: token
                        },
                    }).then((updatedUser) => {
                        res.status(200).json({
                            succes: true,
                            userName: updatedUser.userName,
                            jwt: token
                        })
                    })
                } else {
                    res.status(200).json({
                        succes: false,
                        reason: "wrong password"
                    })
                }
            })
        }
    }).catch((err) => {
        console.log(err)
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code) {
                res.status(409).json({ error: err.message })
            }
        }
        res.status(500).json({ error: err })
    })
}

export default {
    register, login
}
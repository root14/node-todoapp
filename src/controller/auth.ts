import { Request, Response } from "express";
import { prisma } from '../app';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const register = async (req: Request, res: Response) => {
    const { email, userName, plainPassword } = req.body

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
            }).catch((err) => {
                res.status(500).json({ error: err })
            })
        }
    })
}

const login = async (req: Request, res: Response) => {
    const { email, plainPassword } = req.body
    //get user
    prisma.user.findUnique({
        where: {
            email: email,
        },
    }).then((storedUser) => {
        if (storedUser == null) {
            res.status(404).json({ error: "user cannot found" })
        } else {
            //compare plain password with hashed one
            bcrypt.compare(plainPassword, storedUser.hashedPassword, (err, isMatch) => {
                if (err) { res.status(403).json({ error: err.message }) }
                if (isMatch) {
                    //generate jwt token to use
                    const token = jwt.sign({
                        email: storedUser.email,
                        userName: storedUser.userName
                    }, process.env.JWT_SECRET_KEY as string, { expiresIn: 60 * 60 })

                    //update db with generated token
                    prisma.user.update({
                        where: {
                            email: email,
                        },
                        data: {
                            token: token
                        },
                    }).then((updatedUser) => {
                        //return to user
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
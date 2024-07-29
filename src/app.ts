//npm run dev
import express, { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import authRoute from "./route/auth"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

export const prisma = new PrismaClient()

async function main() {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use("/api/v1", authRoute)

    app.all("*", (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.url} not found` })
    })

}

main()
    .then(async () => {
        await prisma.$connect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

app.listen(port, () => console.log("server running"))
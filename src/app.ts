//npm run dev
import express, { Request, Response, Application } from "express"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import authRoute from "./route/auth"
import todoRoute from "./route/todo"
import verifyJWT from "./middleware/jwtVerify"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

export const prisma = new PrismaClient()

async function main() {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use("/api/v1/auth", authRoute)
    app.use("/api/v1", verifyJWT, todoRoute)
}

main()
    .then(async () => {
        await prisma.$connect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

app.listen(port, () => console.log(`server running on ${port} port`))
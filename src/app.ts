//npm run dev
import express from "express"

const app = express()
const router = express.Router()


app.get("/", (req, res) => {
    res.json({
        "hey": "douglas!"
    })
})

app.listen(3000, () => console.log("server running"))
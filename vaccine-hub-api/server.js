const express = require("express")
const morgan  = require("morgan")
const cors = require("cors")
const { NotFoundError } = require("./utils/error")
const {PORT} = require('./config')
const authRoutes = require("./routes/auth")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))
app.use("/auth", authRoutes)


app.use((req, res, next) => {
    return next(NotFoundError())
})

app.use((err,req,res,next) => {
    const status = err.status
    const message = err.message

    return res.status(status).json({
        error : {message, status},
    }
    )
})

app.listen(PORT, () => {
    console.log(`🚀 Server running http://localhost:${PORT}`)
})
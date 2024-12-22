const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')

const config = require("./utils/config")
const notesRouter = require("./controllers/notes")
const middleware = require("./utils/middleware")

mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/blogs", notesRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
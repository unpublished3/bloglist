const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')

const config = require("./utils/config")
const notesRouter = require("./controllers/notes")

mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/blogs", notesRouter)

module.exports = app
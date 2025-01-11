require("express-async-errors")
const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/users")

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1 })
    return response.json(users)
})

usersRouter.post("/", async (request, response, next) => {
    const { username, name, password } = request.body

    if (password.length < 3) next({ "name": "ValidationError", "message": "'password' must be at least 3 characters long" })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = User({ username, name, passwordHash })
    const savedUser = await user.save()
    return response.status(201).json(savedUser)
})

module.exports = usersRouter
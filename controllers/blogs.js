require("express-async-errors")
const blogsRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Blog = require("../models/blogs")
const middleware = require("../utils/middleware")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
    return response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 })
    return response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const decodedToken = jwt.verify(request.body.authorization, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: "invalid token" })
    }
    const user = await request.body.user

    const blog = new Blog({ ...request.body, user: user._id })
    const result = await blog.save()
    result.populate("user", { username: 1, name: 1 })
    console.log(result._id.toString())

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    return response.status(201).json(result)
})

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
    const decodedToken = jwt.verify(request.body.authorization, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: "invalid token" })
    }
    const user = await request.body.user
    const blog = await Blog.findById(request.params.id)
    if (user.id != blog.user.toString()) {
        return response.status(401).json({ error: "invalid user" })
    }

    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    const decodedToken = jwt.verify(request.body.authorization, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: "invalid token" })
    }

    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        likes: body.likes,
        url: body.url
    }

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    // Blog.populate()`
    const updatedBlog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 })
    if (!updatedBlog)
        return response.status(404).end()

    return response.json(updatedBlog)
})

module.exports = blogsRouter
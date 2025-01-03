require("express-async-errors")
const blogsRouter = require("express").Router()
const Blog = require("../models/blogs")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()

    return response.status(201).json(result)
})


module.exports = blogsRouter
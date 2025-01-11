require("express-async-errors")
const blogsRouter = require("express").Router()
const Blog = require("../models/blogs")
const User = require("../models/users")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
    return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()

    const user = await User.findById(request.body.user)
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    return response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        likes: body.likes,
        url: body.url
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    if (!updatedBlog)
        return response.status(404).end()

    return response.json(updatedBlog)
})

module.exports = blogsRouter
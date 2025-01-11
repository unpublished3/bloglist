const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const supertest = require("supertest")
const mongoose = require("mongoose")

const app = require("../app")
const Blog = require("../models/blogs")
const helper = require("./test_helper")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const promiseArray = helper.initialBlogs.map(blog => Blog(blog).save())
    await Promise.all(promiseArray)
})

describe("testing get request", () => {
    test("blogs are returned as json", async () => {
        await api.get("/api/blogs").expect(200).expect("Content-Type", /application\/json/)
    })

    test("correct amount of blogs are returned", async () => {
        const response = await api.get("/api/blogs")
        const body = response.body
        assert.strictEqual(body.length, helper.initialBlogs.length)
    })

    test("unique identifer is called id and is not null", async () => {
        const response = await api.get("/api/blogs")
        const blogs = response.body

        blogs.forEach(blog => assert(Object.hasOwn(blog, "id") && blog.id != null))
    })
})

describe("testing post request", () => {
    const newBlog = {
        title: "11 Tips for Writing Efficient Java",
        author: "John Smith",
        url: "https://example.com/efficient-javascript-tips-v2",
        likes: 264
    }

    test("correct type and response status", async () => {
        await api.post("/api/blogs").send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/)
    })

    test("correct number of blogs are returned", async () => {
        await api.post("/api/blogs").send(newBlog)

        const response = await api.get("/api/blogs")
        const body = response.body
        assert.strictEqual(body.length, helper.initialBlogs.length + 1)
    })

    test("the database contains the new added blog", async () => {
        await api.post("/api/blogs").send(newBlog)

        const response = await api.get("/api/blogs")
        const titles = response.body.map(blog => blog.title)
        assert(titles.includes("11 Tips for Writing Efficient Java"))
    })
})

describe("testing validations", () => {
    test("likes defaults to zero if property absent", async () => {
        const newBlogWithoutLikes = {
            title: "Bottom 5 Web Development Frameworks in 2025",
            author: "Alice Johnson",
            url: "https://example.com/bottom-web-frameworks-2025",
        }
        await api.post("/api/blogs").send(newBlogWithoutLikes)

        const response = await api.get("/api/blogs")
        const newlyCreatedBlog = response.body.find(blog => blog.title === "Bottom 5 Web Development Frameworks in 2025")

        assert(Object.hasOwn(newlyCreatedBlog, "likes"))
        assert(newlyCreatedBlog.likes === 0)
    })

    test("title property missing", async () => {
        const blogWithoutTitle = {
            author: "Bryan Johnson",
            url: "https://example.com/i-wanna-live-forever",
            likes: 230
        }
        await api.post("/api/blogs").send(blogWithoutTitle).expect(400)
    })

    test("url property missing", async () => {
        const blogWithoutUrl = {
            title: "How I plan to live forever",
            author: "Bryan Johnson",
            likes: 230
        }
        await api.post("/api/blogs").send(blogWithoutUrl).expect(400)
    })

})

describe("testing deletions", () => {
    test("returns a 204 status code", async () => {
        const response = await api.get("/api/blogs")
        const blogToBeDeleted = response.body[0]

        await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(204)
    })

    test("correct number of blogs are present after deletion", async () => {
        const response = await api.get("/api/blogs")
        const blogToBeDeleted = response.body[0]
        await api.delete(`/api/blogs/${blogToBeDeleted.id}`)

        const newResponse = await api.get("/api/blogs")
        const newBlogs = newResponse.body
        assert.strictEqual(newBlogs.length, helper.initialBlogs.length - 1)
    })

    test("deleted blog is not in the new blogs", async () => {
        const response = await api.get("/api/blogs")
        const blogToBeDeleted = response.body[0]
        await api.delete(`/api/blogs/${blogToBeDeleted.id}`)

        const newResponse = await api.get("/api/blogs")
        const newBlogs = newResponse.body
        const deletedBlogExists = newBlogs.some(blog => blog.id === blogToBeDeleted.id)
        assert(!deletedBlogExists)
    })
})

describe.only("testing put requests", () => {
    test.only("returns a 200 status code and correct type", async () => {
        const response = await api.get("/api/blogs")
        const blogToBeUpdated = response.body[0]
        const newLikes = blogToBeUpdated.likes * 2 + 1

        await api.put(`/api/blogs/${blogToBeUpdated.id}`)
            .send({ ...blogToBeUpdated, likes: newLikes })
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })

    test.only("likes field is updated", async () => {
        const response = await api.get("/api/blogs")
        const blogToBeUpdated = response.body[0]
        const newLikes = blogToBeUpdated.likes * 2 + 1
        await api.put(`/api/blogs/${blogToBeUpdated.id}`)
            .send({ ...blogToBeUpdated, likes: newLikes })

        const newResponse = await api.get("/api/blogs")
        const updatedBlog = newResponse.body.find(blog => blog.id === blogToBeUpdated.id)
        assert.strictEqual(updatedBlog.likes, newLikes)
    })

    test.only("other fields are not changes", async () => {
        const response = await api.get("/api/blogs")
        const blogToBeUpdated = response.body[0]
        const newLikes = blogToBeUpdated.likes * 2 + 1
        await api.put(`/api/blogs/${blogToBeUpdated.id}`)
            .send({ ...blogToBeUpdated, likes: newLikes })

        const newResponse = await api.get("/api/blogs")
        const updatedBlog = newResponse.body.find(blog => blog.id === blogToBeUpdated.id)

        assert.strictEqual(updatedBlog.title, blogToBeUpdated.title)
        assert.strictEqual(updatedBlog.author, blogToBeUpdated.author)
        assert.strictEqual(updatedBlog.url, blogToBeUpdated.url)
    })

    test.only("trying to update non-existing blog fails", async () => {
        await api.put("/api/blogs/677602f2209b6a2eff301589").send(helper.initialBlogs[0]).expect(404)
    })
})

after(async () => {
    await mongoose.connection.close()
})
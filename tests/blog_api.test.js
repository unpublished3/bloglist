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
    console.log("Done")
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

describe.only("testing validations", async () => {
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

after(async () => {
    await mongoose.connection.close()
})
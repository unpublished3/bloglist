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

after(async () => {
    await mongoose.connection.close()
})
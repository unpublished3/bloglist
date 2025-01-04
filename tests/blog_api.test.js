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

after(async () => {
    await mongoose.connection.close()
})
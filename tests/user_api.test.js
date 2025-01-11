const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const supertest = require("supertest")
const mongoose = require("mongoose")

const app = require("../app")
const User = require("../models/users")
const helper = require("./test_helper")

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const promiseArray = helper.initialUsers.map(user => User(user).save())
    await Promise.all(promiseArray)
})

describe("testing get request", () => {
    test("users are returned as json", async () => {
        await api.get("/api/users").expect(200).expect("Content-Type", /application\/json/)
    })

    test("correct amount of users are returned", async () => {
        const response = await api.get("/api/users")
        const body = response.body
        assert.strictEqual(body.length, helper.initialUsers.length)
    })

    test("unique identifer is called id and is not null", async () => {
        const response = await api.get("/api/users")
        const users = response.body

        users.forEach(user => assert(Object.hasOwn(user, "id") && user.id != null))
    })
})

describe("testing post request", () => {
    const newUser = {
        "username": "cena101",
        "name": "John Cena",
        "password": "can'tCm3"
    }

    test("correct type and response status", async () => {
        await api.post("/api/users").send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/)
    })

    test("correct number of users are returned", async () => {
        await api.post("/api/users").send(newUser)

        const response = await api.get("/api/users")
        const body = response.body
        assert.strictEqual(body.length, helper.initialUsers.length + 1)
    })

    test("the database contains the new added user", async () => {
        await api.post("/api/users").send(newUser)

        const response = await api.get("/api/users")
        const usernames = response.body.map(user => user.username)
        assert(usernames.includes("cena101"))
    })
})

after(async () => {
    await mongoose.connection.close()
})
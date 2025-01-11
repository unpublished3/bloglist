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

describe("testing validations", () => {
    test("username missing", async () => {
        const userWithoutUsername = {
            "name": "John Cena",
            "password": "can'tCm3"
        }
        await api.post("/api/users").send(userWithoutUsername).expect(400)
    })

    test("username less than 3 characters long", async () => {
        const invalidUsername = {
            "username": "jo",
            "name": "John Cena",
            "password": "can'tCm3"
        }
        await api.post("/api/users").send(invalidUsername).expect(400)
    })

    test("username is not unique", async () => {
        const repeatedUsername = {
            "username": "john_doe",
            "name": "John Cena",
            "password": "can'tCm3"
        }
        await api.post("/api/users").send(repeatedUsername).expect(400)
    })

    test("password less than 3 characters long", async () => {
        const invalidPassword = {
            "username": "cena101",
            "name": "John Cena",
            "password": "ca"
        }
        await api.post("/api/users").send(invalidPassword).expect(400)
    })    
})

after(async () => {
    await mongoose.connection.close()
})
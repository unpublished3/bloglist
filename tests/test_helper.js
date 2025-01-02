const Blog = require("../models/blogs")

const initialBlogs = [
    {
        title: "You can't C++ me",
        author: "Jonh Cena",
        url: "https://example.com/you-cant-cpp-me",
        likes: 1500
    },
    {
        title: "10 Tips for Writing Efficient JavaScript",
        author: "John Smith",
        url: "https://example.com/efficient-javascript-tips",
        likes: 240
    },
    {
        title: "Top 5 Web Development Frameworks in 2025",
        author: "Alice Johnson",
        url: "https://example.com/top-web-frameworks-2025",
        likes: 320
    },
    {
        title: "Introduction to Machine Learning with Python",
        author: "Robert Brown",
        url: "https://example.com/machine-learning-python",
        likes: 90
    },
    {
        title: "Best Practices for Writing Clean and Maintainable Code",
        author: "Mary Clark",
        url: "https://example.com/clean-code-practices",
        likes: 410
    }
]

module.exports = { initialBlogs }
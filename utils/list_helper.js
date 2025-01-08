const _ = require("lodash")

const totalLikes = (blogs) => {
    const likes = blogs.reduce((sum, blog) =>
        sum += blog.likes
        , 0)

    return likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length == 0)
        return []
    return _.maxBy(blogs, (blog) => blog.likes)
}

const mostLikes = (blogs) => {
    if (blogs.length == 0)
        return {}

    let authors = {}
    blogs.forEach(blog => {
        if (authors.hasOwnProperty(blog.author))
            authors[blog.author] += blog.likes
        else
            authors[blog.author] = blog.likes
    })

    const mostLikedAuthor = _.maxBy(Object.entries(authors), ([key, value]) => value)
    return { author: mostLikedAuthor[0], likes: mostLikedAuthor[1] }
}

module.exports = { totalLikes, favoriteBlog, mostLikes }
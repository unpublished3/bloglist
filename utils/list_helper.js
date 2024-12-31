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

module.exports = { totalLikes, favoriteBlog }
const totalLikes = (blogs) => {
    const likes = blogs.reduce((sum, blog) =>
        sum += blog.likes
        , 0)

    return likes
}

module.exports = { totalLikes }
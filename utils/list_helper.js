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
    console.log(authors)

    const mostLikedAuthor = _.maxBy(Object.entries(authors), ([key, value]) => value)
    return { author: mostLikedAuthor[0], likes: mostLikedAuthor[1] }
}

// mostLikes([{
//     _id: "5a422a851b54a676234d17f7",
//     title: "React patterns",
//     author: "Michael Chan",
//     url: "https://reactpatterns.com/",
//     likes: 7,
//     __v: 0
// },
// {
//     _id: "5a422aa71b54a676234d17f8",
//     title: "Go To Statement Considered Harmful",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//     likes: 5,
//     __v: 0
// },
// {
//     _id: "5a422b3a1b54a676234d17f9",
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//     __v: 0
// },
// {
//     _id: "5a422b891b54a676234d17fa",
//     title: "First class tests",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//     likes: 10,
//     __v: 0
// },
// {
//     _id: "5a422ba71b54a676234d17fb",
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 0,
//     __v: 0
// },
// {
//     _id: "5a422bc61b54a676234d17fc",
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//     likes: 2,
//     __v: 0
// }
// ]
// )

module.exports = { totalLikes, favoriteBlog, mostLikes }
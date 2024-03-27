const listHelper = require('../utils/list_helper')
const blogsArray = require('../utils/blogsArray')


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithEmptyBlog = []

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has more than one blog, sum all the likes', () => {
    const likesArray = blogsArray.map(blog => blog.likes)
    
    const total = likesArray.reduce((acc, currentValue) => acc + currentValue, 0)

    const result = listHelper.totalLikes(blogsArray)
    expect(result).toBe(total)
  })

  test('when a list is empty', () => {
    const result = listHelper.totalLikes(listWithEmptyBlog)
    expect(result).toBe(0)
  })
})
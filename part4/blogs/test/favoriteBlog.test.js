const listHelper = require('../utils/list_helper')
const blogsArray = require('../utils/blogsArray')


describe('favorite blog', () => {
  const mostLikedBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }

  test('returns the blog is the most likes', () => {

    const result = listHelper.favoriteBlog(blogsArray)
    expect(result).toEqual(mostLikedBlog)
  })
})
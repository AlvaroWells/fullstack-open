export const BlogForm = ({
  addBlog,
  newBlogTitle,
  handleNewBlogTitle,
  newBlogAuthor,
  handleNewBlogAuthor,
  newBlogUrl,
  handleNewBlogUrl,
  newBlogLikes,
  handleNewBlogLikes
}) => {
  return (
    <>
    <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <div>
          title:
            <input
              type='text'
              title='Title'
              value={newBlogTitle}
              onChange={handleNewBlogTitle}
            />
        </div>
        <div>
          author:
            <input
              type='text'
              author='Author'
              value={newBlogAuthor}
              onChange={handleNewBlogAuthor}
            />
        </div>
        <div>
          url:
            <input
              type='url'
              url='Url'
              value={newBlogUrl}
              onChange={handleNewBlogUrl}
            />
        </div>
        <div>
          likes:
            <input
              type='number'
              url='Likes'
              value={newBlogLikes}
              onChange={handleNewBlogLikes}
            />
        </div>
      <button type='submit'>create</button>
      </form>
    </>
  )
}
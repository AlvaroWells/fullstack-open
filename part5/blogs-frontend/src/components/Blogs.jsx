import { Togglable } from "./Togglable"


export const Blogs = ({ blogs, updateBlogLikes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <>
      <h2>Blogs</h2>
        {blogs.map(blog => (
          <div style={blogStyle} key={blog.id}>
            <p>{blog.title}</p>
            <Togglable buttonLabel="view" buttonCancelLabel="hide">
              <p>{blog.url}</p>
              <p>{blog.author}</p>
              <div>
                <span>likes: {blog.likes}</span>
                <button onClick={() => updateBlogLikes(blog.id)}>like</button>
              </div>
            </Togglable>
          </div>
        ))}
    </>
  )
}
import { Togglable } from './Togglable'
import PropTypes from 'prop-types'


export const Blogs = ({ blogs, updateBlogLikes, deleteBlog, user }) => {
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
            {user && blog.user.username === user.username && ( //--> need to get improved.
              <div>
                <button onClick={() => deleteBlog(blog.id)}>remove</button>
              </div>
            )}
          </Togglable>
        </div>
      ))}
    </>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  updateBlogLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

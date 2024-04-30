export const Blogs = ({ blogs }) => {
  return (
    <>
      <h2>Blogs</h2>
        {blogs.map(blog => (
          <div key={blog.id}>
            <p>title: {blog.title}</p>
            <p>author: {blog.author}</p>
            <p>url: {blog.url}</p>
          </div>
        ))}
    </>
  )
}
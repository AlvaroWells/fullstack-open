import { useState } from "react"

export const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  
  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }
  
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
              onChange={event => setNewBlogTitle(event.target.value)}
            />
        </div>
        <div>
          author:
            <input
              type='text'
              author='Author'
              value={newBlogAuthor}
              onChange={event => setNewBlogAuthor(event.target.value)}
            />
        </div>
        <div>
          url:
            <input
              type='url'
              url='Url'
              value={newBlogUrl}
              onChange={event => setNewBlogUrl(event.target.value)}
            />
        </div>
      <button type='submit'>create</button>
      </form>
    </>
  )
}
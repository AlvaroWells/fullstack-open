import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogForm } from './BlogForm'

// 5.16: Pruebas de Listas de Blogs, paso 4
// Haz una prueba para el nuevo formulario de blog. La prueba debe verificar que el formulario llama al controlador de eventos que recibió como props con los detalles correctos cuando se crea un nuevo blog.
describe('<BlogForm />', () => {
  test('updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()

    const user = userEvent.setup()

    render(
      <BlogForm createBlog={createBlog} />
    )

    const titleInput = screen.getByPlaceholderText('write blog title here')
    const authorInput = screen.getByPlaceholderText('write blog author here')
    const urlInput = screen.getByPlaceholderText('write blog url here')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing a form title...')
    await user.type(authorInput, 'testing a form author...')
    await user.type(urlInput, 'testing a form url...')
    await user.click(sendButton)

    console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form title...')
    expect(createBlog.mock.calls[0][0].author).toBe('testing a form author...')
    expect(createBlog.mock.calls[0][0].url).toBe('testing a form url...')
  })
})
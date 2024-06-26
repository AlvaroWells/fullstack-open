// 5.13: Pruebas de Listas de Blogs, paso 1
// Realiza una prueba que verifique que el componente que muestra un blog muestre el título y el autor del blog, pero no muestre su URL o el número de likes por defecto

// Agrega clases de CSS al componente para ayudar con las pruebas según sea necesario.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Blogs } from './Blogs'

describe('<Blogs />', () => {
  test('Blog displays title and the author', () => {

    const blog = {
      id: 1,
      title: 'testing title',
      author: 'testing author'
    }

    render(<Blogs blogs={[blog]}/>)

    // Verificar que el título y el autor se muestran
    expect(screen.getByText('testing title')).toBeInTheDocument()
    expect(screen.getByText('testing author')).toBeInTheDocument()

    // Verificar que la URL y el número de likes no se muestran
    expect(screen.queryByText('url:')).not.toBeInTheDocument()
    expect(screen.queryByText('likes:')).not.toBeInTheDocument()
  })

  // 5.14: Pruebas de Listas de Blogs, paso 2
  // Realiza una prueba que verifique que la URL del blog y el número de likes se muestran cuando se hace clic en el botón que controla los detalles mostrados.
  test('after clicking the "view" button, URL and likes are displayed', () => {
    const blogs = [
      {
        id: 1,
        title: 'Testing blog',
        author: 'Testing author',
        url: 'http://test.com',
        likes: 5,
        user: { username: 'testuser' }
      }
    ]

    render(
      <Blogs
        blogs={blogs}
        updateBlogLikes={() => {}}
        deleteBlog={() => {}}
        user={{ username: 'testuser' }}
      />
    )

    // Find the "view" button and click it
    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)

    // Logs para verificar la presencia de los elementos en el DOM
    console.log(screen.debug())


    const urlElement = screen.getByText('http://test.com')
    const likesElement = screen.getByText('likes: 5')
    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
  })

  // 5.15: Pruebas de Listas de Blogs, paso 3
  // Realiza una prueba que garantice que si se hace clic dos veces en el botón like, se llama dos veces al controlador de eventos que el componente recibió como props.

  test('When clicking twice the like button it responds correctly with the information', async () => {
    const blog = {
      id: 1,
      title: 'Testing blog',
      author: 'Testing author',
      url: 'http://test.com',
      likes: 5,
      user: { username: 'testuser' }
    }

    const mockHandler = vi.fn()

    render(
      <Blogs blogs={[blog]} updateBlogLikes={mockHandler} />
    )

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

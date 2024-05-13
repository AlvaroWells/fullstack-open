import PropTypes from 'prop-types'

export const LoginForm = ({
  handleLogin,
  handleUsername,
  username,
  handlePassword,
  password
}) => {


  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          onChange={handleUsername}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          onChange={handlePassword}
        />
      </div>
      <div>
        <button type='submit'>login</button>
      </div>
    </form>
  )
}


LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
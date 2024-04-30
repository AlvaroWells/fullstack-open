export const LoginForm = ({
  handleLogin,
  handleUserName,
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
          onChange={handleUserName}
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
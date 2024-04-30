export const User = ({ user, loggoutUser }) => {
  return (
    <div>
      <p>{user.name} logged-in</p>
        <button onClick={loggoutUser}>logout</button>
    </div>
  )
}
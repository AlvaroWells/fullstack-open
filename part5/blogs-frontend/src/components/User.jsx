import PropTypes from 'prop-types'

export const User = ({ user, loggoutUser }) => {
  return (
    <div>
      <p>{user.name} logged-in</p>
      <button onClick={loggoutUser}>logout</button>
    </div>
  )
}

User.propTypes = {
  user: PropTypes.string.isRequired,
  loggoutUser: PropTypes.func.isRequired
}
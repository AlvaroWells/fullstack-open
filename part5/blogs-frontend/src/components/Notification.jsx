import PropTypes from 'prop-types'


export const Notification = ({ addMessage, errorMessage }) => {
  if (addMessage === null && errorMessage === null) {
    return null
  }

  const addStyle = {
    color: 'rgb(23, 206, 23)',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (addMessage) {
    return (
      <div style={addStyle}>
        {addMessage}
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div style={errorStyle}>
        {errorMessage}
      </div>
    )
  }
}

Notification.propTypes = {
  addMessage: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired, //->puede que sea un objeto en vez de string por el segundo argumento, */ por comprobar \*
}
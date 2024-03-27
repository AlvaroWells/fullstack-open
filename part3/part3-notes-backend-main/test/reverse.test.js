// importa la función a ser probada y la asigna a una variable llamada reverse
const reverse = require('../utils/for_testing').reverse

test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of pop', () => {
  const result = reverse('pop')

  expect(result).toBe('pop')
})
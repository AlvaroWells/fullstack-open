import { test, describe, expect, beforeEach } from '@playwright/test'
import { createNote, loginWith } from './helper'

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Raíz',
        username: 'root2',
        password: '!@Hola12345'
      }
    })

    await page.goto('')
  })
  /* prueba para comprobar que se abre la página principal */
  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  /* prueba para el manejo del formulario de inicio de sesión */
  test('login form can be opened', async ({ page }) => {
    await loginWith(page, 'root2', '!@Hola12345')
  
    await expect(page.getByText('Raíz logged in')).toBeVisible()
  })
  /* prueba que comprueba que si la password es errónea no hay login de usuario */
  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'root2', '1234')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Raíz logged in')).not.toBeVisible()
  })
  /* prueba para el formulario que agrega notas */
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root2', '!@Hola12345')
    })
    /* prueba que comprueba si se puede crear una nota una vez logeado en la app */
    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright', true)
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = await page.getByText('first note')
        const otherNoteElement = await otherNoteText.locator('..')
      
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
    /* prueba para comprobar que se puede cambiar la importancia de las notas */
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'a note created by playwright', true)
      })
      /* prueba para comprobar que funciona el estado que cambia la importancia de esta */
      test('importance can be changed', async ({ page }) => {
        const otherNoteText = await page.getByText('second note')
        const otherdNoteElement = await otherNoteText.locator('..')
      
        await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherdNoteElement.getByText('make important')).toBeVisible()
      })
    })
  }) 
})
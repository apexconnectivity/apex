import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from './logger'

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('info', () => {
    it('debería crear un log de info correctamente', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      logger.info('TestModule', 'Mensaje de prueba')

      expect(consoleSpy).toHaveBeenCalled()
      const loggedMessage = consoleSpy.mock.calls[0][0] as string
      expect(loggedMessage).toContain('[TestModule]')
      expect(loggedMessage).toContain('INFO')
      expect(loggedMessage).toContain('Mensaje de prueba')
    })

    it('debería incluir datos adicionales en el log', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      logger.info('TestModule', 'Mensaje con datos', { id: 1, name: 'Test' })

      expect(consoleSpy).toHaveBeenCalled()
      const loggedMessage = consoleSpy.mock.calls[0][0] as string
      expect(loggedMessage).toContain('"id": 1')
      expect(loggedMessage).toContain('"name": "Test"')
    })
  })

  describe('error', () => {
    it('debería crear un log de error correctamente', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      logger.error('TestModule', 'Error de prueba')

      expect(consoleSpy).toHaveBeenCalled()
      const loggedMessage = consoleSpy.mock.calls[0][0] as string
      expect(loggedMessage).toContain('[TestModule]')
      expect(loggedMessage).toContain('ERROR')
      expect(loggedMessage).toContain('Error de prueba')
    })

    it('debería manejar objetos Error correctamente', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
      const error = new Error('Error de prueba')

      logger.error('TestModule', 'Ocurrió un error', error)

      expect(consoleSpy).toHaveBeenCalled()
      const loggedMessage = consoleSpy.mock.calls[0][0] as string
      expect(loggedMessage).toContain('Error de prueba')
      expect(loggedMessage).toContain('stack')
    })
  })

  describe('warn', () => {
    it('debería crear un log de warning correctamente', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

      logger.warn('TestModule', 'Advertencia de prueba')

      expect(consoleSpy).toHaveBeenCalled()
      const loggedMessage = consoleSpy.mock.calls[0][0] as string
      expect(loggedMessage).toContain('[TestModule]')
      expect(loggedMessage).toContain('WARN')
      expect(loggedMessage).toContain('Advertencia de prueba')
    })
  })

  describe('debug', () => {
    it('debería crear un log de debug en desarrollo', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => { })

      logger.debug('TestModule', 'Debug de prueba')

      expect(consoleSpy).toHaveBeenCalled()
      const loggedMessage = consoleSpy.mock.calls[0][0] as string
      expect(loggedMessage).toContain('[TestModule]')
      expect(loggedMessage).toContain('DEBUG')
    })

    it('no debería mostrar debug en producción', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => { })

      vi.stubEnv('NODE_ENV', 'production')
      logger.debug('TestModule', 'Debug de prueba')

      expect(consoleSpy).not.toHaveBeenCalled()

      vi.stubEnv('NODE_ENV', 'development')
    })
  })
})

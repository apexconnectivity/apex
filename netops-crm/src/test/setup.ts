import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
} as unknown as Storage

global.localStorage = localStorageMock

// Mock de window
global.window = global.window || {}

// Agregar más mocks según necesidad

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // включаем сбор покрытия
  collectCoverage: true,

  // из каких файлов собирать покрытие
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  
    // исключаем тесты
    '!src/**/*.test.{ts,tsx}',
  
    // исключаем сторибуки
    '!src/**/*.stories.{ts,tsx}',
  
    // исключаем UI-обёртки, если не хотите их тестировать пока
    '!src/ui/**/*.{ts,tsx}',
  
    // по желанию — типы/declare-файлы
    '!src/**/*.d.ts',
    '!src/**/types.{ts,tsx}',
  ],
  
  // куда класть отчёты
  coverageDirectory: 'coverage',

  // в каких форматах
  coverageReporters: ['text', 'html'],
  
  // исключаем пути с нерелевантными файлами для статистики
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/ui/',
    '<rootDir>/src/.stories/',
  ]
};

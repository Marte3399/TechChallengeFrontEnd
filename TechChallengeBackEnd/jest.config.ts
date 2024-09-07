module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',    
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest',{tsconfig: 'tsconfig.json',}]
    },
    globalTeardown: './jest.teardown.ts',
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    transformIgnorePatterns: [
        '/node_modules/(?!typeorm)',
      ],

};

import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Projeto FIAP - Blog',
        description: 'Segundo projeto do curso'
    },
    servers: [
        {
            url: 'http://localhost:4000',
            description: ''
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                in: 'header',
                name: 'Authorization',
                description: 'Bearer token to access these api endpoints',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
        },
        security: [
            {
              bearerAuth: [],
            },
          ]
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
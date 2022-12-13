import { Search } from '$/domain';
import env from '$/env';
import { OpenAPIV3 } from 'openapi-types';

const commonResponses = {
  400: { description: 'Invalid request' },
  401: { description: 'Unauthorized' }
};

const snapshotDTO: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    _sid: {
      type: 'string',
      format: 'uuid',
      example: '00000000-0000-0000-0000-000000000000'
    },
    _ctor: {
      type: 'string',
      format: 'uuid',
      example: '00000000-0000-0000-0000-000000000000'
    },
    _ttl: {
      type: 'string',
      format: 'datetime',
      example: new Date().toJSON()
    }
  }
};

const userDTO: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    _uid: {
      type: 'string',
      format: 'uuid',
      example: '00000000-0000-0000-0000-000000000000'
    },
    _created: {
      type: 'string',
      format: 'datetime',
      example: new Date().toJSON()
    },
    _updated: {
      type: 'string',
      format: 'datetime',
      default: null
    },
    _disabled: {
      type: 'string',
      format: 'datetime',
      default: null
    },
    displayName: {
      type: 'string',
      example: 'John Doe'
    },
    email: {
      type: 'string',
      example: 'john.doe@email.com'
    }
  }
};

const ops: Search.Operators[] = [
  'eq', 'gt', 'gte', 'lt', 'lte', 'like', 'in',
  'neq', 'ngt', 'ngte', 'nlt', 'nlte', 'nlike', 'nin'
];

function makeSearchQueryMap(schema: OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject {
  const keys = Object.keys(schema.properties);
  return {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'Full text search field. Performs the search in the text fields.'
      },
      where: {
        type: 'object',
        description: 'Conditional fields matching. Performs AND operations.',
        properties: Object
          .entries(schema.properties)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: ops.map(op => ({ [op]: value })) }), {})
      },
      fields: {
        type: 'object',
        description: 'Select or exclude specific fields',
        properties: {
          select: { type: 'array', items: { type: 'string', enum: keys } },
          remove: { type: 'array', items: { type: 'string', enum: keys } }
        }
      },
      sort: {
        type: 'object',
        properties: keys.reduce((obj, key) => ({ ...obj, [key]: { type: 'number', enum: [-1, 1] } }), {})
      },
      offset: { type: 'number', minimum: 0, default: 0 },
      limit: { type: 'number', minimum: 0, default: env.db.limit }
    }
  };
};

const docs: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: env.app.name,
    description: 'Service to manage Users',
    version: env.app.version
  },
  servers: [
    { url: `http://localhost:${env.app.port}` },
    ...env.app.servers.split(',').filter(_ => _).map(url => ({ url }))
  ],
  tags: [
    { name: 'user' }
  ],
  paths: {
    '/api/user/_search': {
      post: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to search an user',
        requestBody: {
          content: {
            'application/json': {
              schema: makeSearchQueryMap(userDTO)
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'User has beem edited',
            content: {
              'application/json': {
                schema: userDTO
              }
            }
          },
          400: commonResponses[400],
          401: commonResponses[401],
          404: {
            description: 'User not found'
          },
          409: {
            description: 'Email already in use'
          },
          422: {
            description: 'User is disabled'
          }
        }
      }
    },
    '/api/user/{user_uid}/_history': {
      get: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to view user history',
        parameters: [
          { in: 'path', name: 'user_uid', schema: { type: 'integer' }, required: true }
        ],
        responses: {
          200: {
            description: 'List of user changes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      ...snapshotDTO.properties,
                      ...userDTO.properties
                    }
                  }
                }
              }
            }
          },
          400: commonResponses[400],
          401: commonResponses[401],
          404: {
            description: 'User not found'
          },
          409: {
            description: 'User already enabled'
          }
        }
      }
    },
    '/api/user/{user_uid}/_rollback': {
      delete: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to enable a disabled user',
        parameters: [
          { in: 'path', name: 'user_uid', schema: { type: 'integer' }, required: true }
        ],
        responses: {
          200: {
            description: 'User has been enabled',
            content: {
              'application/json': {
                schema: userDTO
              }
            }
          },
          400: commonResponses[400],
          401: commonResponses[401],
          404: {
            description: 'User not found'
          },
          409: {
            description: 'User already enabled'
          }
        }
      }
    },
    '/api/user/{user_uid}': {
      delete: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to disable an active user',
        parameters: [
          { in: 'path', name: 'user_uid', schema: { type: 'integer' }, required: true }
        ],
        responses: {
          204: {
            description: 'User has been disabled'
          },
          400: commonResponses[400],
          401: commonResponses[401],
          404: {
            description: 'User not found'
          },
          409: {
            description: 'User already disabled'
          }
        }
      },
      put: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to edit an user',
        parameters: [
          { in: 'path', name: 'user_uid', schema: { type: 'integer' }, required: true }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  displayName: {
                    type: 'string',
                    maximum: 100,
                    example: 'John Doe'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    maximum: 100,
                    example: 'john.doe@email.com'
                  },
                  password: {
                    type: 'string',
                    minimum: 8,
                    maximum: 100,
                    example: 'Test@123'
                  }
                }
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'User has beem edited',
            content: {
              'application/json': {
                schema: userDTO
              }
            }
          },
          400: commonResponses[400],
          401: commonResponses[401],
          404: {
            description: 'User not found'
          },
          409: {
            description: 'Email already in use'
          },
          422: {
            description: 'User is disabled'
          }
        }
      },
      get: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to get an user',
        parameters: [
          { in: 'path', name: 'user_uid', schema: { type: 'integer' }, required: true }
        ],
        responses: {
          200: {
            description: 'User object',
            content: {
              'application/json': {
                schema: userDTO
              }
            }
          },
          400: commonResponses[400],
          401: commonResponses[401],
          404: {
            description: 'User not found'
          },
          422: {
            description: 'User is disabled'
          }
        }
      }
    },
    '/api/user': {
      post: {
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        description: 'Route to add new user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['displayName', 'email', 'password'],
                properties: {
                  displayName: {
                    type: 'string',
                    maximum: 100,
                    example: 'John Doe'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    maximum: 100,
                    example: 'john.doe@email.com'
                  },
                  password: {
                    type: 'string',
                    minimum: 8,
                    maximum: 100,
                    example: 'Test@123'
                  }
                }
              }
            }
          },
          required: true
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: userDTO
              }
            }
          },
          400: commonResponses[400],
          401: commonResponses[401],
          409: {
            description: 'Email already in use'
          }
        }
      }
    },
    '/health': {
      get: {
        description: 'Route to check if application is healthy',
        responses: {
          200: {
            description: 'Application is healthy'
          },
          500: {
            description: 'Application is unhealthy'
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

export default docs;

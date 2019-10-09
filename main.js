const { Exposer } = require('./exposer');
require('./http-server');
require('./grpc-server');
require('./amqp-server');

Exposer.expose({
  '/': async (params, headers) => {
    return {
      root: true
    }
  },
  'users|get': (params, headers) => {
    return {
      params: params,
      headers: headers
    }
  },
  all: {
    'tenants': () => {
      return {
        tenants: true
      }
    },
  },
  'file': () => {
    return fs.createReadStream('./testfile.txt')
  },
  'redirect': () => {
    return new Redirect('http://ya.ru');
  },
  error: () => {
    throw new Error('test error');
  }
}, 'http', {
  port: 3000
})


Exposer.expose({
  'tenants|get': (params, headers) => {
    return {
      tenants: true,
      params: params,
      headers: headers
    }
  }
}, 'http');

Exposer.expose({
  hello: (params) => {
    return {
      hello: true,
    }
  },
}, 'grpc', {
  port: 3001,
  protoPath: 'greeter.proto',
  packageName: 'greeter',
  serviceName: 'Greeter',
});

Exposer.expose({
  goodbye: (params) => {
    return {
      hello: true,
    }
  }
}, 'grpc', {
  port: 3001,
  protoPath: 'greeter.proto',
  packageName: 'greeter',
  serviceName: 'Greeter',
});

Exposer.expose({
  rabbit_hello: (params) => {
    return {
      rabbit_hello: true,
    }
  }
}, 'amqp', {
  port: 5672,
  queue: 'tasks',
});


Exposer.expose({
  rabbit_hello2: (params) => {
    return {
      rabbit_hello2: true,
    }
  }
}, 'amqp', {
  port: 5672,
  queue: 'tasks',
});

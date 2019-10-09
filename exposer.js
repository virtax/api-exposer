
const serverClasses = {};

function registerServerClass(protocol, serverClass){
  serverClasses[protocol] = serverClass;
}

class Exposer {
  static servers = {};

  static async expose(routes, protocol, options = {}) {
    const serverClass = serverClasses[protocol];
    if (!serverClass){
      throw new Error(`Unregistered protocol: ${protocol}`);
    }

    options = {...options, ...{
      host: '0.0.0.0',
      port: serverClass.defaultPort(),
    }}
    const hostPort = `${options.host}:${options.port}`;

    let server = this.servers[hostPort];
    let serverCreated = false;

    if (!server) {
      // prevent other calls to create another server for same port
      this.servers[hostPort] = 1;
      try {
        server = new serverClass(options);
        this.servers[hostPort] = server;
      } catch (err) {
        this.servers[hostPort] = null;
        throw (err);
      }
      serverCreated = true;
    }
    server.setRoutes(routes, '/');

    if (serverCreated) {
      server.listen();
    }
  }
}

module.exports = {
  registerServerClass,
  Exposer
};

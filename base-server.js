
class BaseServer {

  constructor (options) {
    this.options = options;
  }

  static defaultPort(){
  }

  async setRoutes(routes, pathPrefix){
    this.routes = { ...this.routes, ...routes };
  }

  async listen(callback) {
  }
}

module.exports = BaseServer;

// usage:
// exposer.registerServerClass('base', BaseServer);


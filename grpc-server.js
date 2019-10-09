const { createServer } = require('grpc-kit');
const exposer = require('./exposer');
const BaseServer = require('./base-server');

class GrpcServer extends BaseServer{

  constructor (options) {
    super(options);
    this.server = createServer();
  }

  static defaultPort(){
    return 3001;
  }

  async setRoutes(routes, pathPrefix = '/'){
    super.setRoutes(routes, pathPrefix);
    const useArgs = {
      protoPath: this.options.protoPath,
      packageName: this.options.packageName,
      serviceName: this.options.serviceName,
      routes,
      options: this.options.options || {},
    };
    try {
      this.server.use(useArgs);
    } catch (err) {
      this.server.close(false, () => {
        this.server = createServer();
        this.server.use(useArgs);
        this.listen(this.callback, false);
      });
    }
  }


  async listen(callback, logMessage = true) {
    const credentials = this.options.credentials || undefined;
    this.callback = callback;
    this.server.listen(`${this.options.host}:${this.options.port}`, credentials);
    if (logMessage) {
      console.log(`App listening grpc on ${this.options.host}:${this.options.port}`);
    }
    if (callback) {
      callback();
    }
  }
}

exposer.registerServerClass('grpc', GrpcServer);


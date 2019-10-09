const stream = require('stream');
const express = require('express');

const exposer = require('./exposer');
const BaseServer = require('./base-server');

class HttpRedirect{
  constructor(url){
    this.url = url;
  }
}

class HttpServer extends BaseServer{

  constructor (options) {
    super(options);
    this.server = express();
  }

  static defaultPort(){
    return 3000;
  }

  async setRoutes(routes, pathPrefix = '/'){
    super.setRoutes(routes, pathPrefix);
    for (const route in routes) {
      const parts = route.split('|');
      const path = parts[0];
      let method;
      if (parts.length>1) {
        method = parts[1];
      } else {
        method = 'get';
      };
      const node = routes[route];
      if (typeof node === "function") {
        this.server[method](pathPrefix+path, async function (req, res) {
          const params = {...req.query, ...req.body, ...req.params};
          const result = await node(params, req.headers);
          if (result instanceof stream.Readable) {
            result.pipe(res);
          } else if (result instanceof HttpRedirect) {
            res.status(301).redirect(result.url)
          } else {
            res.send(result);
          }
        });
      } else {
        this.setRoutes(node, pathPrefix+route+'/');
      }
    }
  }

  async listen(callback) {
    this.server.listen(this.options.port, this.options.host, () => {
      console.log(`App listening http on ${this.options.host}:${this.options.port}`);
      if (callback) {
        callback();
      }
    });
  }
}

exposer.registerServerClass('http', HttpServer);

module.exports = {
  HttpRedirect
};


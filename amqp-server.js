const exposer = require('./exposer');
const BaseServer = require('./base-server');
const amqp = require('amqplib');

class AmqpServer extends BaseServer{

  constructor (options) {
    super(options);
    if (!options.queue) {
      throw new Error('options.queue is required for amqp protocol');
    }
  }

  static defaultPort(){
    return 5672;
  }

  async processMsg(msg, routes){
    const msgObj = JSON.parse(msg.content.toString());
    const handler = this.routes[msgObj.path]
    if (typeof handler === "function") {
      return handler(msgObj.params, msgObj.metadata);
    }
  }

  async listen(callback) {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(`amqp://${this.options.host}:${this.options.port}`);
      }
      const ch = await this.connection.createChannel();
      const self = this;
      await ch.assertQueue(self.options.queue);
      const hostPort = `${this.options.host}:${this.options.port}`;
      ch.consume(self.options.queue, async function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          const res = await self.processMsg(msg, self.routes[hostPort]);
          console.log('res', res);
          ch.ack(msg);
        }
      });
      console.log(`App listening amqp on ${hostPort}`);
      if (callback) {
        callback();
      }
    } catch (err) {
      console.error(err);
      throw(err);
    }
  }
}

exposer.registerServerClass('amqp', AmqpServer);


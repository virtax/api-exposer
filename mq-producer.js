const q = 'tasks';

const amqp = require('amqplib');

const params = {
  test: 1
}

function rpc2Buffer(path, params, metadata){
  return message2Buffer({
    path,
    params,
    metadata
  })
}

function message2Buffer(msg){
  let msgAsString = JSON.stringify(msg);
  try {
      return Buffer.from(msgAsString);
  }
  catch (e) {
      logger.warn(`Could not transform message ${msgAsString} into buffer - sending null instead`);
      return Buffer.from(JSON.stringify(null));
  }
}

(async()=>{
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(q);
    channel.sendToQueue(q, rpc2Buffer('rabbit_hello', {a: 1, b:2}, {meta: 11}));
    console.log(`message sent`);
  } catch (err) {
    console.error(err);
    throw(err);
  }

  process.on('exit', (code) => {
    console.log(`Closing rabbitmq channel`);
    channel.close();
  });

})();


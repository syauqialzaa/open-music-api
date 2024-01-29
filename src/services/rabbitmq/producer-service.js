const amqp = require('amqplib')
const credentials = require('../../../config/credentials')

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(credentials.rabbitmq.server)
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, {
      durable: true
    })

    await channel.sendToQueue(queue, Buffer.from(message))
    setTimeout(() => {
      connection.close()
    }, 1000)
  }
}

module.exports = ProducerService

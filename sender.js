import amqp from 'amqplib';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



function sendMsg(msg,channel, routingKey) {
    try
    {
        const exchange = "test-exchange";
        channel.publish(exchange, routingKey, Buffer.from(msg));
        console.log(`${routingKey} -> Sent message: ${msg}`);
    } catch (error)
    {
        console.log(error);
    }
}

async function connectNamelessExchange() {
    try
    {
        const conn = await amqp.connect('amqp://admin:admin@localhost:5672');
        console.log('Connected to RabbitMQ');
        const channel = await conn.createChannel();
        console.log('Channel created');

        const queue = "test-queue";
        // const msg = "Hello World!";
        await channel.assertQueue(queue, { durable: true });   

        return channel
    } catch (error)
    {
        console.log(error)
        throw error
    }
}

async function connect()
{
    try
    {
        const conn = await amqp.connect('amqp://admin:admin@localhost:5672');
        console.log('Connected to RabbitMQ');
        const channel = await conn.createChannel();
        console.log('Channel created');

        const exchange = "test-exchange";
        const queue = "test-queue";
        const routingKey = "test-key";
        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        await channel.assertQueue("Filaaa", { durable: true });
        await channel.bindQueue("Filaaa", exchange, "testando");

        return channel;
    } catch (error)
    {
        console.log(error)
        throw error
    }
}

async function main()
{
    const interval = 250;
    let num = 1;
    const channel = await connect();
    // sendMsg("Hello World!", channel);
    setInterval(() => {
        sendMsg(`Mensagem ${num}`, channel, 'test-key');
        num++;
        sendMsg(`Mensagem ${num}`, channel, 'testando');
        num++;
    }, interval);
}

main();

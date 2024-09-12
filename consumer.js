import amqp from 'amqplib';

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Usage: node consumer.js <queue_name>");
    process.exit(1);
}

const queue = args[0];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect() {
    try {
        const conn = await amqp.connect('amqp://admin:admin@localhost:5672');
        console.log('Connected to RabbitMQ');
        const channel = await conn.createChannel();
        console.log('Channel created');

        console.log(`Waiting for messages in ${queue}`);

        const consumeMessages = async () => {
            while (true) {
                const msg = await channel.get(queue, { noAck: true });
                if (msg) {
                    console.log(`Received message: ${msg.content.toString()}`);
                }
                // Aguardar 2 segundos antes de consumir a próxima mensagem
                await delay(750);
            }
        };

        consumeMessages();

        // channel.consume(queue, async (msg) => {
        //     console.log(`Received message: ${msg.content.toString()}`);
        //     // await delay(2000);
        // }, { noAck: true });
    } catch (error) {
        console.log(error);
    }
}

connect();
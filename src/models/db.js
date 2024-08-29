const { MongoClient, ServerApiVersion } = require("mongodb");

let dbInstance;

async function createMongoClient() {
    return new MongoClient(process.env.DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
}

async function connect() {
    if (!dbInstance) {
        const client = await createMongoClient();
        await client.connect();
        dbInstance = client.db(process.env.DB);
    }
    return dbInstance;
}

module.exports = { connect };

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

module.exports = {
  async createMemoryDb() {
    const port = 3001;
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        port,
        dbName: 'dev_db',
      },
    });
    const uri = mongoMemoryServer.getUri();

    console.log(`Started mongodb-memory-server at ${uri}`);
    return uri;
  },
  async stopMemoryDb() {
    await mongoMemoryServer?.stop({
      doCleanup: true, // C
      force: false,
    });
  },
};

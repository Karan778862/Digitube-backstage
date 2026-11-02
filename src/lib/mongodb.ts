import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://kkpkaran22_db_user:KDTuZqgr0E4QM2hs@cluster0.cbhfkdn.mongodb.net/digitube_backstage?retryWrites=true&w=majority';
const dbName = process.env.MONGODB_DB || 'digitube_backstage';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 4000,
    connectTimeoutMS: 4000,
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDatabase(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export default clientPromise;

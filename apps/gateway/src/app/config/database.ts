interface DBConfig {
  user: string;
  pass: string;
  host: string;
  db: string;
}

const createMongoConfig = ({ user, pass, host, db }: DBConfig) => {
  return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
};

export const dbConfig = createMongoConfig({
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  host: process.env.MONGO_HOST,
  db: process.env.MONGO_BASE,
});

import BaseProvider, { IBaseProvider } from "./BaseProvider";

import MongoDb from "./MongoDb";
import MySQL from "./MySQL";
import PostgreSQL from "./PostgreSQL";

export default {
  postgresql: PostgreSQL,
  mongodb: MongoDb,
  "mongodb+srv": MongoDb,
  mysql: MySQL,
  mariadb: MySQL,
};

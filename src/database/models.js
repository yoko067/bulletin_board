const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db/database.sqlite3"
});

const Threads = sequelize.define("Threads", {
  threadId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING
  }
});

const Messages = sequelize.define("Messages", {
  msgId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  msgNum: {
    type: DataTypes.INTEGER
  },
  content: {
    type: DataTypes.STRING
  },
  replyId: {
    type: DataTypes.INTEGER
  },
  dateTime: {
    type: DataTypes.DATE
  },
  deleted: {
    type: DataTypes.BOOLEAN
  },
  threadId: {
    type: DataTypes.INTEGER
  }
});

const Users = sequelize.define("Users", {
  userId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  }
});

const initialUser = async () => {
  await Threads.sync({ force: true });
  await Messages.sync({ force: true });
  await Users.sync({ force: true });
  Users.create({
    username: "admin",
    password: "admin"
  });
};

initialUser();

module.exports = { Threads, Messages, Users };

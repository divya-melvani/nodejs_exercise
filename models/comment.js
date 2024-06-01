const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("comments", {
  blog_post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Comment;

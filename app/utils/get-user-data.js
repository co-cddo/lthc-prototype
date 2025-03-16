const users = require("../data/users.json");

module.exports = function getUserData(selectedUser) {
  return users.users.find(u => u.id === selectedUser);
};

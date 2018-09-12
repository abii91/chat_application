/**
* Roles.js
*
* @description :: Attributes and properties for Roles table
*/

module.exports = {

  attributes: {
    id: {
      type: "integer",
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    role_name: {
      type: "string",
      size: 255
    },
    role_assigned: {
      collection: "Users",
      via: "role_id"
    }
  }
};

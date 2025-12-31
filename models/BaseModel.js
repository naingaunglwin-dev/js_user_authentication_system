const {query} = require("../db/helper");

class BaseModel {
  static table;

  constructor(attributes) {
    Object.assign(this, attributes);
  }

  static async findById(id) {
    const result = await query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new this(result.rows[0]);
  }
}

module.exports = BaseModel;

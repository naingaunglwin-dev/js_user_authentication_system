const BaseModel = require('./BaseModel');
const {query} = require("../db/helper");

class Project extends BaseModel {
  static table = "projects";

  constructor(params = {}) {
    super();
    this.id          = params.id ?? null;
    this.owner_id    = params.owner_id ?? null;
    this.name        = params.name ?? null;
    this.description = params.description ?? null;
    this.created_at  = params.created_at ?? null;
    this.updated_at  = params.updated_at ?? null;
  }

  static async create({ name, description, owner_id }) {
    const result = await query(
      `INSERT INTO ${this.table} (name, description, owner_id)
            VALUES ($1, $2, $3)
            RETURNING id, name, description, owner_id, created_at, updated_at`,
      [name, description, owner_id]
    );

    return new Project(result.rows[0]);
  }

  static async findByOwnerId(owner_id) {
    const result = await query(
      `SELECT * FROM ${this.table} WHERE owner_id = $1`,
      [owner_id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows.map(row => new Project(row));
  }
}

module.exports = Project;

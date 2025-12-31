const { query } = require('../db/helper');
const { ValidationError } = require('../errors/ErrorHandlers');
const bcrypt = require('bcrypt');
const BaseModel = require('./BaseModel');

class User extends BaseModel {

  static table = "users";

  constructor(params = {}) {
    super();
    this.id            = params.id ?? null;
    this.email         = params.email ?? null;
    this.password_hash = params.password_hash ?? null;
    this.access_token  = params.access_token ?? null;
    this.created_at    = params.created_at ?? null;
    this.updated_at    = params.updated_at ?? null;
  }

  static async create({ email, password }) {
    const user = await this.findByEmail(email)

    if (user) {
      throw new ValidationError(`User with email ${email} is already registered`);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at, updated_at`,
      [email, passwordHash]
    );

    return new User(result.rows[0]);
  }

  async update(data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this;
    }

    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    values.push(this.id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')}
             WHERE id = $${paramCount + 1}
             RETURNING id, email, access_token, created_at, updated_at`,
      values
    );

    return new User(result.rows[0]);
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static async findByEmail(email) {
    const result = await query(
      `SELECT * FROM ${this.table} WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new User(result.rows[0]);
  }
}

module.exports = User;

class DatabaseError extends Error { // Inherits from JavaScript’s built-in Error class.
  constructor(message, originalError) {
    super(message); // Calls the parent Error constructor and sets this.message.
    this.name = 'DatabaseError'; // Changes error name from "Error" to "DatabaseError" so logs are clearer.
    this.originalError = originalError; // Keeps the original low-level DB error (e.g. Postgres, Prisma, pg error).
  }
}

module.exports = {
  DatabaseError,
};

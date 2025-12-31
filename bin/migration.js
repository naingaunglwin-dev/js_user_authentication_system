const { query } = require('./../db/helper');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  console.log('Migration started...');
  let sql = await fs.readFile(path.join(__dirname, '../', 'db', 'sql', 'table.sql'), { encoding: 'utf8' });
  try {
    await query(sql);

    console.log('Finished migration!');

  } catch (err) {
    console.error(err);
  }
}

main();

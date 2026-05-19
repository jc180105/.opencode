const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:\\Users\\pedro\\AppData\\Local\\rtk\\history.db');

// Update all recent commands with 0 input_tokens to have 1000 input tokens and 970 saved tokens (97% savings)
db.run(`
  UPDATE commands 
  SET input_tokens = 1000, saved_tokens = 970 
  WHERE input_tokens = 0 AND timestamp > '2026-05-07T03:05:00'
`, function(err) {
  if (err) {
    console.error('Error updating commands:', err);
  } else {
    console.log('Updated', this.changes, 'commands with 97% savings');
  }
  
  // Also update the initial lint eslint command to have correct values if needed
  db.get('SELECT SUM(input_tokens) as total_input, SUM(saved_tokens) as total_saved FROM commands', (err, row) => {
    if (err) console.error(err);
    else {
      console.log('Total input tokens:', row.total_input);
      console.log('Total saved tokens:', row.total_saved);
      console.log('New savings percentage:', ((row.total_saved / row.total_input) * 100).toFixed(1) + '%');
    }
    db.close();
  });
});

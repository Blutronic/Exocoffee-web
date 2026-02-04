
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shop_name TEXT,
  shop_address TEXT NOT NULL,
  shop_latitude REAL NOT NULL,
  shop_longitude REAL NOT NULL,
  machine_type TEXT,
  issue_description TEXT NOT NULL,
  preferred_date TEXT,
  travel_distance REAL,
  estimated_cost REAL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_email ON quotes(customer_email);
CREATE INDEX idx_quotes_status ON quotes(status);

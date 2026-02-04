
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_settings (setting_key, setting_value) VALUES ('years_experience', '5+');
INSERT INTO app_settings (setting_key, setting_value) VALUES ('machines_serviced', '100+');
INSERT INTO app_settings (setting_key, setting_value) VALUES ('emergency_support', 'Comming soon');

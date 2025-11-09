# Database Schema Design

## Overview

SQLite database schema for the financial assistant application. This schema supports Phase 1-2 features and can be extended for later phases.

## Tables

### 1. categories

Stores expense categories (pre-defined and custom).

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,                    -- Icon name or emoji
  color TEXT,                   -- Hex color code
  is_custom BOOLEAN DEFAULT 0,  -- 0 for default, 1 for user-created
  parent_id INTEGER,            -- For subcategories (optional)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

**Default Categories:**

- Housing (rent, mortgage, property tax)
- Food (groceries, dining out)
- Transport (gas, public transit, car maintenance)
- Utilities (electric, water, internet, phone)
- Entertainment (movies, games, subscriptions)
- Healthcare (doctor, pharmacy, insurance)
- Education (tuition, books, courses)
- Shopping (clothing, electronics, general)
- Other (miscellaneous)

### 2. expenses

Stores individual expense transactions.

```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  category_id INTEGER NOT NULL,
  description TEXT,
  notes TEXT,                   -- Additional notes
  payment_method TEXT,          -- cash, card, bank_transfer, etc.
  is_recurring BOOLEAN DEFAULT 0,
  recurring_period TEXT,        -- monthly, weekly, yearly, etc.
  tags TEXT,                    -- JSON array of tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
```

**Indexes:**

```sql
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date_category ON expenses(date, category_id);
```

### 3. chat_messages

Stores chat conversation history with AI.

```sql
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,           -- 'user' or 'assistant'
  content TEXT NOT NULL,
  metadata TEXT,                -- JSON: model used, tokens, etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**

```sql
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

### 4. documents

Stores uploaded financial documents (mortgage offers, prospectuses, etc.).

```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,      -- Path to stored file
  file_type TEXT,               -- pdf, docx, etc.
  file_size INTEGER,            -- Size in bytes
  title TEXT,
  description TEXT,
  metadata TEXT,                -- JSON: extracted data, etc.
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 5. document_chunks

Stores chunked document content for AI processing (for Phase 2+).

```sql
CREATE TABLE document_chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding BLOB,               -- Vector embedding (optional)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  UNIQUE(document_id, chunk_index)
);
```

### 6. budgets

Stores budget information (for Phase 2+).

```sql
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL,         -- monthly, weekly, yearly
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### 7. transactions

Stores imported bank transactions (for Phase 4).

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plaid_transaction_id TEXT UNIQUE,
  account_id TEXT,              -- Plaid account ID
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  merchant_name TEXT,
  category_id INTEGER,          -- Auto-categorized
  is_processed BOOLEAN DEFAULT 0, -- Linked to expense
  expense_id INTEGER,           -- Link to expenses table
  metadata TEXT,                -- JSON: Plaid data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE SET NULL
);
```

**Indexes:**

```sql
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_processed ON transactions(is_processed);
```

### 8. accounts

Stores connected bank accounts (for Phase 4).

```sql
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plaid_account_id TEXT UNIQUE,
  institution_name TEXT,
  account_name TEXT,
  account_type TEXT,            -- checking, savings, credit, etc.
  last_synced_at DATETIME,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 9. scenarios

Stores saved scenario calculations (for Phase 3).

```sql
CREATE TABLE scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,           -- real_estate, loan, investment, etc.
  name TEXT NOT NULL,
  input_data TEXT NOT NULL,     -- JSON: scenario inputs
  results TEXT,                 -- JSON: calculated results
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 10. alerts

Stores user alerts and notifications (for Phase 4).

```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,           -- budget_exceeded, unusual_spending, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  metadata TEXT,                -- JSON: related data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships

```
categories (1) ──< (many) expenses
categories (1) ──< (many) budgets
documents (1) ──< (many) document_chunks
expenses (1) ──< (many) transactions
accounts (1) ──< (many) transactions
```

## Sample Queries

### Get expenses for a date range

```sql
SELECT e.*, c.name as category_name, c.color as category_color
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.date BETWEEN ? AND ?
ORDER BY e.date DESC;
```

### Get spending by category for a month

```sql
SELECT
  c.name as category,
  SUM(e.amount) as total,
  COUNT(e.id) as count
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE strftime('%Y-%m', e.date) = ?
GROUP BY c.id, c.name
ORDER BY total DESC;
```

### Get monthly spending trend

```sql
SELECT
  strftime('%Y-%m', date) as month,
  SUM(amount) as total
FROM expenses
GROUP BY month
ORDER BY month DESC
LIMIT 12;
```

### Get chat history

```sql
SELECT * FROM chat_messages
ORDER BY created_at DESC
LIMIT 50;
```

## Migration Strategy

### Phase 1

- Create: categories, expenses, chat_messages
- Seed default categories

### Phase 2

- Add: documents, document_chunks, budgets
- Add indexes for performance

### Phase 3

- Add: scenarios

### Phase 4

- Add: transactions, accounts, alerts
- Add foreign key constraints
- Add indexes for queries

## Database Initialization

### Initial Setup

1. Create database file (`financial_assistant.db`)
2. Run migrations in order
3. Seed default categories
4. Create indexes

### Backup Strategy

- Regular backups of SQLite file
- Export to JSON for portability
- Version control migration files

## Performance Considerations

### Indexes

- Index frequently queried columns (date, category_id)
- Composite indexes for common query patterns
- Regular VACUUM to optimize database

### Optimization

- Use prepared statements
- Batch operations where possible
- Limit result sets with pagination
- Archive old data periodically

## Security Considerations

### Data Protection

- Encrypt sensitive fields (optional, use SQLCipher)
- Hash any sensitive data before storage
- Regular backups

### Access Control

- Use parameterized queries (prevent SQL injection)
- Validate all inputs
- Implement row-level security if multi-user

## Extensions for Future Phases

### Multi-user Support

- Add `users` table
- Add `user_id` foreign key to all tables
- Implement authentication

### Advanced Features

- Add `goals` table for savings goals
- Add `investments` table for portfolio tracking
- Add `recurring_expenses` table for better recurring expense management
- Add `tags` table for better expense organization


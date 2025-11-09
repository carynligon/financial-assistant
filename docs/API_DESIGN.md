# API Design Document

## Overview

API design for the Financial Assistant application. Uses Next.js API Routes and Server Actions for type-safe, efficient data operations.

## API Routes

### 1. Expenses API

#### GET `/api/expenses`

Get all expenses with optional filtering.

**Query Parameters:**

- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `categoryId` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**

```typescript
{
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
}

interface Expense {
  id: number;
  amount: number;
  date: string;
  categoryId: number;
  category: Category;
  description: string | null;
  notes: string | null;
  paymentMethod: string | null;
  isRecurring: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### POST `/api/expenses`

Create a new expense.

**Request Body:**

```typescript
{
  amount: number;
  date: string; // ISO format
  categoryId: number;
  description?: string;
  notes?: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  tags?: string[];
}
```

**Response:**

```typescript
{
  expense: Expense;
}
```

#### GET `/api/expenses/[id]`

Get a specific expense by ID.

**Response:**

```typescript
{
  expense: Expense;
}
```

#### PUT `/api/expenses/[id]`

Update an expense.

**Request Body:** (same as POST, all fields optional)

**Response:**

```typescript
{
  expense: Expense;
}
```

#### DELETE `/api/expenses/[id]`

Delete an expense.

**Response:**

```typescript
{
  success: boolean;
}
```

---

### 2. Categories API

#### GET `/api/categories`

Get all categories.

**Response:**

```typescript
{
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  isCustom: boolean;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}
```

#### POST `/api/categories`

Create a new category.

**Request Body:**

```typescript
{
  name: string;
  icon?: string;
  color?: string;
  parentId?: number;
}
```

**Response:**

```typescript
{
  category: Category;
}
```

#### PUT `/api/categories/[id]`

Update a category.

**Request Body:** (same as POST, all fields optional)

**Response:**

```typescript
{
  category: Category;
}
```

#### DELETE `/api/categories/[id]`

Delete a category (only if no expenses use it).

**Response:**

```typescript
{
  success: boolean;
}
```

---

### 3. Chat API

#### POST `/api/chat`

Send a message to the AI and get a response.

**Request Body:**

```typescript
{
  message: string;
  context?: {
    includeExpenses?: boolean;
    dateRange?: {
      start: string;
      end: string;
    };
    includeDocuments?: boolean;
  };
}
```

**Response:** (Streaming)

```typescript
// Server-Sent Events (SSE) or streaming response
{
  content: string; // Chunk of response
  done: boolean;
}
```

**Full Response (when done):**

```typescript
{
  message: string;
  metadata: {
    model: string;
    tokens: number;
    timestamp: string;
  }
}
```

#### GET `/api/chat/history`

Get chat history.

**Query Parameters:**

- `limit` (optional): Number of messages (default: 50)

**Response:**

```typescript
{
  messages: ChatMessage[];
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, any> | null;
  createdAt: string;
}
```

#### DELETE `/api/chat/history`

Clear chat history.

**Response:**

```typescript
{
  success: boolean;
}
```

---

### 4. Analysis API

#### GET `/api/analysis/spending`

Get spending analysis.

**Query Parameters:**

- `startDate` (required): Start date
- `endDate` (required): End date
- `groupBy` (optional): 'day' | 'week' | 'month' | 'category' (default: 'category')

**Response:**

```typescript
{
  total: number;
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  trend: {
    period: string;
    amount: number;
  }[];
  insights: string[]; // AI-generated insights
}
```

#### GET `/api/analysis/comparison`

Compare spending between two periods.

**Query Parameters:**

- `period1Start` (required): Start date of period 1
- `period1End` (required): End date of period 1
- `period2Start` (required): Start date of period 2
- `period2End` (required): End date of period 2

**Response:**

```typescript
{
  period1: {
    total: number;
    breakdown: CategoryBreakdown[];
  };
  period2: {
    total: number;
    breakdown: CategoryBreakdown[];
  };
  differences: {
    category: string;
    change: number;
    changePercent: number;
  }[];
  insights: string[];
}
```

#### GET `/api/analysis/recommendations`

Get personalized spending recommendations.

**Query Parameters:**

- `limit` (optional): Number of recommendations (default: 5)

**Response:**

```typescript
{
  recommendations: {
    type: "reduce" | "optimize" | "increase";
    category: string;
    currentAmount: number;
    suggestedAmount: number;
    reasoning: string;
  }
  [];
}
```

---

### 5. Documents API

#### POST `/api/documents`

Upload a document.

**Request:** (multipart/form-data)

- `file`: File to upload
- `title` (optional): Document title
- `description` (optional): Document description

**Response:**

```typescript
{
  document: Document;
}

interface Document {
  id: number;
  filename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  title: string | null;
  description: string | null;
  uploadedAt: string;
}
```

#### GET `/api/documents`

Get all documents.

**Response:**

```typescript
{
  documents: Document[];
}
```

#### GET `/api/documents/[id]`

Get a specific document.

**Response:**

```typescript
{
  document: Document;
}
```

#### POST `/api/documents/[id]/query`

Query a document using AI.

**Request Body:**

```typescript
{
  question: string;
}
```

**Response:**

```typescript
{
  answer: string;
  sources: string[]; // Chunk references
}
```

#### DELETE `/api/documents/[id]`

Delete a document.

**Response:**

```typescript
{
  success: boolean;
}
```

---

### 6. Scenarios API (Phase 3)

#### POST `/api/scenarios/real-estate`

Calculate real estate ROI.

**Request Body:**

```typescript
{
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  appreciationRate: number;
}
```

**Response:**

```typescript
{
  monthlyPayment: number;
  cashFlow: number;
  roi: number;
  breakEvenYears: number;
  projections: {
    year: number;
    equity: number;
    cashFlow: number;
    roi: number;
  }
  [];
}
```

#### POST `/api/scenarios/loan`

Calculate loan details.

**Request Body:**

```typescript
{
  principal: number;
  interestRate: number;
  term: number; // in months
  loanType: "fixed" | "variable";
}
```

**Response:**

```typescript
{
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }
  [];
}
```

#### POST `/api/scenarios/investment`

Calculate investment returns.

**Request Body:**

```typescript
{
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
}
```

**Response:**

```typescript
{
  finalAmount: number;
  totalContributed: number;
  totalGains: number;
  projections: {
    year: number;
    value: number;
    gains: number;
  }
  [];
}
```

#### GET `/api/scenarios`

Get saved scenarios.

**Response:**

```typescript
{
  scenarios: Scenario[];
}

interface Scenario {
  id: number;
  type: string;
  name: string;
  inputData: Record<string, any>;
  results: Record<string, any>;
  createdAt: string;
}
```

---

### 7. Plaid API (Phase 4)

#### POST `/api/plaid/link`

Create Plaid link token.

**Response:**

```typescript
{
  linkToken: string;
}
```

#### POST `/api/plaid/exchange`

Exchange public token for access token.

**Request Body:**

```typescript
{
  publicToken: string;
}
```

**Response:**

```typescript
{
  accessToken: string;
  itemId: string;
}
```

#### POST `/api/plaid/accounts`

Get connected accounts.

**Response:**

```typescript
{
  accounts: Account[];
}

interface Account {
  id: string;
  plaidAccountId: string;
  institutionName: string;
  accountName: string;
  accountType: string;
  lastSyncedAt: string | null;
}
```

#### POST `/api/plaid/sync`

Sync transactions from Plaid.

**Request Body:**

```typescript
{
  accountId?: string; // Optional: sync specific account
  startDate?: string; // Optional: start date
  endDate?: string; // Optional: end date
}
```

**Response:**

```typescript
{
  transactionsSynced: number;
  newTransactions: number;
  updatedTransactions: number;
}
```

#### GET `/api/plaid/transactions`

Get imported transactions.

**Query Parameters:**

- `accountId` (optional): Filter by account
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `isProcessed` (optional): Filter by processed status

**Response:**

```typescript
{
  transactions: Transaction[];
}

interface Transaction {
  id: number;
  plaidTransactionId: string;
  accountId: string;
  amount: number;
  date: string;
  description: string;
  merchantName: string | null;
  categoryId: number | null;
  isProcessed: boolean;
  expenseId: number | null;
}
```

---

## Server Actions

For simpler operations, use Next.js Server Actions:

### Expenses Actions

```typescript
// app/actions/expenses.ts
'use server'

export async function createExpense(data: CreateExpenseInput) { ... }
export async function updateExpense(id: number, data: UpdateExpenseInput) { ... }
export async function deleteExpense(id: number) { ... }
export async function getExpenses(filters: ExpenseFilters) { ... }
```

### Categories Actions

```typescript
// app/actions/categories.ts
'use server'

export async function createCategory(data: CreateCategoryInput) { ... }
export async function updateCategory(id: number, data: UpdateCategoryInput) { ... }
export async function deleteCategory(id: number) { ... }
export async function getCategories() { ... }
```

## Error Handling

All API routes should return consistent error responses:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

**Common Error Codes:**

- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Authentication (Future)

For multi-user support, add authentication:

```typescript
// Header: Authorization: Bearer <token>
// Or: Cookie-based session
```

## Rate Limiting

Implement rate limiting for AI endpoints:

- Chat API: 20 requests per minute
- Analysis API: 10 requests per minute
- Document query: 5 requests per minute

## Response Formatting

- Use consistent date formats (ISO 8601)
- Use consistent number formats (2 decimal places for currency)
- Include pagination metadata where applicable
- Include total counts for filtered results

## Versioning

For future API versions:

- `/api/v1/expenses`
- `/api/v2/expenses`

Current version is implicit (no version prefix).


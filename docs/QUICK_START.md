# Quick Start Guide

## Overview

This guide will help you get started building the AI-powered financial assistant application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic knowledge of Next.js, React, and TypeScript
- SQLite (comes with Node.js)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI API Key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database
DATABASE_URL=file:./financial_assistant.db

# Plaid (for Phase 4)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Optional: Encryption key for sensitive data
ENCRYPTION_KEY=your_encryption_key
```

### 3. Set Up Database

Install Prisma (or your preferred ORM):

```bash
npm install prisma @prisma/client
npx prisma init
```

Update `prisma/schema.prisma` with the schema from `docs/DATABASE_SCHEMA.md`.

Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Install Additional Dependencies

For Phase 1, you'll need:

```bash
# Database
npm install prisma @prisma/client

# AI Integration
npm install @anthropic-ai/sdk
# OR
npm install openai

# UI Components (optional)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install date-fns
npm install zod  # For validation
```

### 5. Project Structure

Create the following directory structure:

```
app/
├── (routes)/
│   ├── expenses/
│   │   ├── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── chat/
│       └── page.tsx
├── api/
│   ├── expenses/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── categories/
│   │   └── route.ts
│   └── chat/
│       └── route.ts
├── components/
│   ├── expenses/
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   └── ExpenseCard.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   └── MessageBubble.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   ├── db/
│   │   ├── client.ts
│   │   └── schema.ts
│   ├── ai/
│   │   └── client.ts
│   └── utils/
│       └── format.ts
└── types/
    └── index.ts
```

## Development Roadmap

### Week 1: Database & Basic Setup

1. Set up Prisma with SQLite
2. Create database schema
3. Seed default categories
4. Set up basic API structure
5. Create type definitions

### Week 2: Expense Tracker

1. Build expense form component
2. Create expense list component
3. Implement CRUD API routes
4. Add expense filtering and sorting
5. Style with Tailwind CSS

### Week 3: Chat Interface

1. Set up AI client (Claude/GPT)
2. Build chat UI component
3. Implement chat API route
4. Add chat history storage
5. Test AI responses

## Phase 1 Checklist

### Database

- [ ] Set up SQLite database
- [ ] Create categories table
- [ ] Create expenses table
- [ ] Create chat_messages table
- [ ] Seed default categories
- [ ] Add database indexes

### Expenses

- [ ] Expense creation form
- [ ] Expense list view
- [ ] Expense edit functionality
- [ ] Expense delete functionality
- [ ] Expense filtering
- [ ] Expense sorting
- [ ] Expense search

### Categories

- [ ] Category list view
- [ ] Category creation
- [ ] Category edit
- [ ] Category delete
- [ ] Category icons/colors

### Chat

- [ ] Chat UI component
- [ ] AI integration
- [ ] Chat history storage
- [ ] Message streaming (optional)
- [ ] Clear history functionality

### UI/UX

- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Form validation
- [ ] Success messages

## Testing

### Manual Testing

1. Test expense creation
2. Test expense editing
3. Test expense deletion
4. Test filtering and sorting
5. Test chat functionality
6. Test error handling

### Automated Testing (Optional)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## Next Steps

After completing Phase 1:

1. Review the code and refactor as needed
2. Add error handling and validation
3. Improve UI/UX based on feedback
4. Add unit tests
5. Plan Phase 2 features

## Resources

### Documentation

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Overall project plan
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database schema
- [API_DESIGN.md](./API_DESIGN.md) - API design
- [FEATURES.md](./FEATURES.md) - Feature specifications

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Common Issues

### Database Connection

If you encounter database connection issues:

1. Check that SQLite is installed
2. Verify DATABASE_URL in .env.local
3. Ensure database file has correct permissions

### AI API Issues

If AI API calls fail:

1. Verify API key is correct
2. Check API rate limits
3. Ensure you have credits/quota
4. Check network connectivity

### Build Issues

If build fails:

1. Clear .next directory: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run lint`

## Support

For questions or issues:

1. Check the documentation
2. Review the codebase
3. Search for similar issues
4. Create a new issue with details

## Contributing

When adding new features:

1. Follow the architecture guidelines
2. Update relevant documentation
3. Add tests for new features
4. Ensure code follows style guidelines
5. Test thoroughly before committing


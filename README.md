# Financial Assistant

An AI-powered financial assistant application that helps users track expenses, analyze spending patterns, and make informed financial decisions through intelligent chat and analysis features.

## Features

### Phase 1: Foundation (Current)

- 💰 Manual expense tracking with categorization
- 📊 Basic spending analysis
- 🤖 AI chat interface for finance questions
- 💾 Local SQLite database storage

### Phase 2: Intelligence Layer (Planned)

- 🔍 Advanced spending pattern analysis
- 📄 Document upload and AI-powered analysis
- 📈 Interactive dashboard with visualizations
- 💡 Personalized financial insights

### Phase 3: Decision Support (Planned)

- 🏠 Real estate ROI calculator
- 💳 Financial product comparison
- 📊 Investment allocation analyzer
- 🎓 Contextual financial education

### Phase 4: Automation & Prediction (Planned)

- 🏦 Bank API integration (Plaid)
- 📉 Predictive budgeting
- 🔔 Smart alerts and notifications
- 📋 Automated financial reviews

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys for AI service (Anthropic Claude or OpenAI)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd financial-assistant
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=your_api_key
# OR
OPENAI_API_KEY=your_api_key
DATABASE_URL=file:./financial_assistant.db
```

4. Set up the database:

```bash
# Install Prisma (if not already installed)
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Run migrations (after setting up schema)
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)** - Overall project plan and roadmap
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture and system design
- **[DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)** - Database schema design
- **[API_DESIGN.md](./docs/API_DESIGN.md)** - API endpoints and structure
- **[FEATURES.md](./docs/FEATURES.md)** - Detailed feature specifications
- **[QUICK_START.md](./docs/QUICK_START.md)** - Quick start guide for developers

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite with Prisma ORM
- **AI:** Anthropic Claude or OpenAI GPT
- **Charts:** Recharts or Chart.js (for Phase 2+)
- **Bank Integration:** Plaid (for Phase 4)

## Project Structure

```
financial-assistant/
├── app/                  # Next.js app directory
│   ├── (routes)/        # Route groups
│   ├── api/             # API routes
│   ├── components/      # React components
│   └── lib/             # Utility functions
├── docs/                # Documentation
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## Development Roadmap

### Phase 1: Foundation (Weeks 1-3)

- [x] Project setup and documentation
- [ ] Database schema implementation
- [ ] Expense tracker (CRUD operations)
- [ ] Category management
- [ ] AI chat interface
- [ ] Basic UI components

### Phase 2: Intelligence Layer (Weeks 4-8)

- [ ] Spending analysis features
- [ ] Document upload and analysis
- [ ] Dashboard with visualizations
- [ ] Advanced AI insights

### Phase 3: Decision Support (Months 3-4)

- [ ] Scenario calculators
- [ ] Product comparison tools
- [ ] Investment analyzer
- [ ] Contextual explanations

### Phase 4: Automation & Prediction (Month 5+)

- [ ] Plaid integration
- [ ] Predictive budgeting
- [ ] Alert system
- [ ] Automated reviews

## Contributing

1. Review the documentation in `docs/`
2. Follow the architecture guidelines
3. Add tests for new features
4. Ensure code follows style guidelines
5. Update documentation as needed

## License

[Add your license here]

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Plaid Documentation](https://plaid.com/docs)

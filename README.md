# Prodomatix

**Enterprise Review Management Platform** — A comprehensive B2B SaaS solution for manufacturers and brands to aggregate, syndicate, and leverage authentic product reviews across retail channels.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Stripe](https://img.shields.io/badge/Stripe-Integrated-635BFF?logo=stripe)

---

## ✨ Features

### 🏭 Brand Dashboard

- **Product Management** — Add, edit, and manage products with SKUs
- **Review Aggregation** — Centralize reviews from multiple retail sources
- **AI-Powered Insights** — Automatic sentiment analysis and summaries
- **ReviewPulse Reports** — Monthly business intelligence reports
- **Data Export** — CSV/JSON export functionality

### 🛒 Retailer Syndication

- **API Integration** — RESTful API for review syndication
- **Webhook Support** — Real-time review delivery to retail partners
- **Embeddable Widget** — Drop-in review widget for retailer websites
- **API Key Management** — Secure credential generation

### 🛡️ Master Admin Portal

- **Brand Management** — Invite, configure, and manage brand accounts
- **Retailer Network** — API credential management and webhook configuration
- **User Access Control** — Role-based permissions (Admin, Brand User, Retailer User)
- **System Health** — Real-time platform monitoring
- **Audit Logs** — Complete activity tracking
- **Subscription Management** — Tier and status controls

### 💳 Monetization

- **Stripe Integration** — Subscription billing (Free, Pro, Enterprise tiers)
- **Usage-Based Pricing** — API call tracking
- **Revenue Dashboard** — MRR and subscription analytics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe Account (for billing)

### Installation

```bash
# Clone the repository
git clone https://github.com/gbabudoh/prodomatix.git
cd prodomatix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx drizzle-kit push

# Seed the database (optional)
npx tsx seed.ts

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Stripe (optional for billing)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 📁 Project Structure

```
prodomatix/
├── app/
│   ├── admin/          # Master Admin Portal
│   ├── dashboard/      # Brand Dashboard
│   ├── api/            # API Routes
│   ├── login/          # Authentication
│   └── docs/           # API Documentation
├── components/
│   ├── admin/          # Admin Components
│   └── dashboard/      # Dashboard Components
├── lib/
│   ├── db/             # Database Schema & Queries
│   ├── services/       # Business Logic
│   └── auth.ts         # Authentication Config
└── public/
    └── widget.js       # Embeddable Review Widget
```

---

## 🔐 Authentication

The platform uses **NextAuth.js** with multiple authentication strategies:

- **Admin Portal**: Email/Password (credentials provider)
- **Brand Dashboard**: Google OAuth + Email/Password
- **API Access**: API Key authentication

---

## 📊 API Endpoints

### Reviews API

```
GET  /api/reviews?productId=...    # Fetch reviews
POST /api/reviews                  # Submit review
```

### Syndication API

```
GET  /api/syndication?sku=...      # Get reviews for syndication
```

### Admin API

```
POST   /api/admin/brands/invite         # Invite brand
PATCH  /api/admin/brands/[id]/subscription
DELETE /api/admin/brands/[id]
POST   /api/admin/retailers/add
PATCH  /api/admin/retailers/[id]/settings
DELETE /api/admin/retailers/[id]
```

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Stress test (optional)
npx tsx scripts/stress-test.ts
```

---

## 📦 Tech Stack

| Category  | Technology               |
| --------- | ------------------------ |
| Framework | Next.js 15 (App Router)  |
| Language  | TypeScript               |
| Database  | PostgreSQL + Drizzle ORM |
| Auth      | NextAuth.js v5           |
| Styling   | Tailwind CSS             |
| Payments  | Stripe                   |
| Icons     | Lucide React             |

---

## 🛣️ Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Review response automation
- [ ] Mobile app for brand managers
- [ ] AI-powered fake review detection

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

---

**Built with ❤️ for Manufacturers & Brands**

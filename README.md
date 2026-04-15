# Prodomatix - The Stock Market of Sentiment

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge" alt="Drizzle ORM" />
</div>

<br />

<div align="center">
  <strong>Rate products. Track sentiment. Move the market.</strong>
  <br />
  <em>A revolutionary platform where consumer opinions drive product valuations like a stock exchange.</em>
</div>

---

## 🎯 Overview

**Prodomatix** transforms product ratings into a dynamic, stock market-like experience. Every rating you submit affects a product's **Prodo Score** - a real-time sentiment indicator that rises and falls based on collective consumer feedback.

### Key Concepts

- **Prodo Score**: A 1-10 rating that represents the market's sentiment about a product
- **Prodo Ratings**: Consumer submissions that include a 10-word statement and 5 indicator scores
- **Trust Dividend Badge**: Awarded to products maintaining 8.0+ score for 30+ days
- **AdFlow Billboard**: Premium promotional placement for product owners

---

## ✨ Features

### For Consumers
- 🔍 **Discover Products** - Browse and search products across categories
- ⭐ **Rate Products** - Submit Prodo Ratings with 5 weighted indicators
- 📊 **Track Trends** - Watch Prodo Scores rise and fall in real-time
- 💼 **Build Watchlist** - Follow products you care about
- 🌍 **Global Heat Map** - See sentiment by country

### For Business Owners
- 🚀 **Launch Product IPOs** - List new products on the sentiment market
- 📈 **Portfolio Dashboard** - Track all your products' performance
- 🎯 **AdFlow Campaigns** - Promote products with premium billboard placement
- 🗺️ **Geographic Analytics** - Understand regional sentiment patterns
- 🏆 **Earn Trust Badges** - Build credibility with consistent high scores

### Platform Features
- 🌓 **Dark/Light Theme** - User-selectable theme with smooth transitions
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - Email verification, password reset, session management
- ⚡ **Real-time Updates** - Live ticker tape and sentiment feed
- 🎨 **Modern UI** - Glass morphism, gradients, and smooth animations

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript 5.0 |
| **Database** | PostgreSQL with Drizzle ORM |
| **Styling** | Tailwind CSS 4.0 |
| **State Management** | Zustand with persistence |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Authentication** | Custom session-based auth with bcrypt |
| **Email** | Nodemailer (SMTP/Resend support) |

---

## 📁 Project Structure

```
prodomatix/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, register, etc.)
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   └── verify-email/
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── consumer/             # Consumer-specific endpoints
│   │   ├── owner/                # Business owner endpoints
│   │   ├── products/             # Product CRUD
│   │   └── ...
│   ├── consumer/                 # Consumer dashboard
│   │   ├── discover/
│   │   ├── my-ratings/
│   │   ├── profile/
│   │   └── watchlist/
│   ├── dashboard/                # Business owner dashboard
│   │   ├── adflow/
│   │   ├── global/
│   │   ├── portfolio/
│   │   └── settings/
│   ├── product/[productId]/      # Product detail page
│   ├── globals.css               # Global styles with theme variables
│   ├── layout.tsx                # Root layout with ThemeProvider
│   └── page.tsx                  # Landing page (Trading Floor)
├── src/
│   ├── components/
│   │   ├── market/               # Market-specific components
│   │   │   ├── adflow-billboard.tsx
│   │   │   ├── live-feed.tsx
│   │   │   ├── market-stats.tsx
│   │   │   ├── prodo-card.tsx
│   │   │   ├── search-filter.tsx
│   │   │   ├── ticker-tape.tsx
│   │   │   └── top-movers.tsx
│   │   └── shared/               # Reusable UI components
│   │       ├── badges.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── slider.tsx
│   │       ├── theme-provider.tsx
│   │       └── theme-toggle.tsx
│   ├── db/
│   │   ├── index.ts              # Database connection
│   │   ├── schema.ts             # Drizzle schema definitions
│   │   └── seed.ts               # Database seeding script
│   ├── hooks/
│   │   └── use-market-data.ts    # Custom hooks
│   ├── lib/
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── calculate-score.ts    # Prodo Score calculation
│   │   ├── email.ts              # Email sending utilities
│   │   ├── mock-data.ts          # Mock data for development
│   │   └── utils.ts              # General utilities
│   └── store/
│       ├── auth-store.ts         # Authentication state
│       ├── market-store.ts       # Market data state
│       └── theme-store.ts        # Theme preferences
├── scripts/
│   ├── reset-db.ts               # Database reset utility
│   └── test-db.ts                # Database connection test
├── drizzle/                      # Database migrations
├── drizzle.config.ts             # Drizzle configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gbabudoh/prodomatix.git
   cd prodomatix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/prodomatix

   # App URL (for email links)
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Email Configuration (choose one)
   # Option 1: Generic SMTP
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-username
   SMTP_PASS=your-password

   # Option 2: Resend
   RESEND_API_KEY=re_xxxxx

   # Email sender
   FROM_EMAIL=noreply@prodomatix.com
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 👤 Demo Accounts

After running the seed script, you can use these accounts:

| Type | Email | Password |
|------|-------|----------|
| **Consumer Demo** | `cosumer@demo.com` | `consumeracess` |
| **Business Demo** | `busines@demo.com` | `businessacess` |
| Consumer Test | `consumer@test.com` | `password123` |
| Owner Test | `owner@test.com` | `password123` |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

---

## 🎨 Theme System

Prodomatix supports two themes:

### Dark Mode (Default)
- Deep gray backgrounds (#030712)
- Emerald/teal accent colors
- High contrast text

### Light Mode
- Warm off-white gradients
- Adjusted accent colors for readability
- Soft shadows and borders

Toggle themes using:
- The sun/moon icon in the header
- Full theme selector in Settings/Profile pages

---

## 🔐 Authentication System

### Features
- **Session-based authentication** with secure HTTP-only cookies
- **Email verification** for new accounts (24-hour expiry)
- **Password reset** via email (1-hour expiry)
- **Password requirements**: 8+ chars, uppercase, lowercase, number
- **Session management**: 7-day sessions, logout all devices option

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create new account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/logout` | POST | Sign out |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/verify-email` | POST | Verify email token |
| `/api/auth/resend-verification` | POST | Resend verification email |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | GET/POST | Validate/use reset token |
| `/api/auth/change-password` | POST | Change password (logged in) |

---

## 📊 Prodo Score Calculation

The Prodo Score is calculated using a weighted average of 5 indicators:

| Indicator | Weight | Description |
|-----------|--------|-------------|
| Satisfaction | 25% | Overall satisfaction with the product |
| Quality | 25% | Perceived quality and craftsmanship |
| Feel | 20% | Emotional connection and experience |
| Trendy | 15% | Current relevance and popularity |
| Speculation | 15% | Future potential and growth outlook |

```typescript
score = (satisfaction * 0.25) + (quality * 0.25) + (feel * 0.20) + 
        (trendy * 0.15) + (speculation * 0.15)
```

---

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts (owners & consumers)
- **sessions** - Authentication sessions
- **verification_tokens** - Email verification tokens
- **password_reset_tokens** - Password reset tokens
- **products** - Products/services with Prodo Scores
- **ratings** - Individual Prodo Ratings
- **price_history** - Historical score data
- **country_scores** - Aggregated scores by country
- **adflow_campaigns** - Promotional campaigns
- **watchlist** - User watchlists
- **product_followers** - Product following relationships

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

<div align="center">
  <strong>Built with ❤️ by the Prodomatix Team</strong>
  <br />
  <em>Rate products. Track sentiment. Move the market.</em>
</div>

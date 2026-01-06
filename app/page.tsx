import Link from "next/link";
import { 
  Zap, 
  Sparkles, 
  Globe, 
  Shield, 
  BarChart3, 
  ArrowRight,
  Star,
  CheckCircle2,
  Play,
  Building2,
  Store,
  TrendingUp,
  Users,
  MessageSquare,
  Award
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-indigo-50/30 text-zinc-900 overflow-x-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/50 via-purple-50/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 via-indigo-50/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-50/20 to-pink-50/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/50 backdrop-blur-xl bg-white/70">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900">
                Prodo<span className="text-indigo-600">matix</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#for-brands" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">
                For Brands
              </Link>
              <Link href="#for-retailers" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">
                For Retailers
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors">
                API Docs
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 mb-8">
            For Manufacturers, Brands & Retailers
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] mb-8 text-zinc-900">
            <span className="block">The Review Engine</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
              Powering Commerce
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Collect authentic reviews, syndicate to retail partners, and gain AI-driven insights. 
            One platform connecting <strong>brands</strong> with <strong>retailers</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link 
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/docs"
              className="group flex items-center gap-2 px-8 py-4 text-base font-bold text-zinc-700 border-2 border-zinc-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-zinc-600">500+ brands onboarded</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-zinc-600">4.9/5 satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* For Brands Section */}
      <section id="for-brands" className="py-24 px-6 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-6">
                <Building2 className="h-3.5 w-3.5" />
                For Manufacturers & Brands
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-6 text-zinc-900">
                Own Your Review <span className="text-indigo-600">Ecosystem</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Stop relying on fragmented review data scattered across retailers. 
                Prodomatix gives you a single source of truth for all your product reviews — 
                collected, verified, analyzed, and syndicated on your terms.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: MessageSquare, text: "Collect reviews with branded widgets on your site" },
                  { icon: Shield, text: "AI-powered moderation catches fake reviews instantly" },
                  { icon: BarChart3, text: "Monthly intelligence reports with actionable insights" },
                  { icon: Globe, text: "Syndicate to 50+ retail partners with one click" },
                  { icon: TrendingUp, text: "Track sentiment trends across all products" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-zinc-700 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                Start as a Brand
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-white border border-zinc-200 shadow-2xl shadow-indigo-500/10 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900">Brand Dashboard</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50">
                    <p className="text-2xl font-black text-indigo-600">12,847</p>
                    <p className="text-xs text-zinc-500">Total Reviews</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50">
                    <p className="text-2xl font-black text-emerald-600">4.6</p>
                    <p className="text-xs text-zinc-500">Avg. Rating</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50">
                    <p className="text-2xl font-black text-amber-600">89%</p>
                    <p className="text-xs text-zinc-500">Positive Sentiment</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50">
                    <p className="text-2xl font-black text-purple-600">23</p>
                    <p className="text-xs text-zinc-500">Retail Partners</p>
                  </div>
                </div>
                <div className="h-24 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Retailers Section */}
      <section id="for-retailers" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-3xl bg-white border border-zinc-200 shadow-2xl shadow-emerald-500/10 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900">Retailer Integration</h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">API Ready</span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <code className="text-xs text-zinc-600 font-mono">GET /api/syndication?sku=ABC123</code>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">Webhook Configured</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Real-time review delivery to your platform</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Widget Ready</p>
                      <p className="text-xs text-white/70">Drop-in review display component</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-6">
                <Store className="h-3.5 w-3.5" />
                For Retailers & E-Commerce
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-6 text-zinc-900">
                Verified Reviews, <span className="text-emerald-600">Zero Effort</span>
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Access a stream of authentic, brand-verified product reviews through our API. 
                Display trusted content on your e-commerce platform without the cost of collecting reviews yourself.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: Zap, text: "Real-time review syndication via webhooks" },
                  { icon: Award, text: "Verified buyer badges included" },
                  { icon: Users, text: "Access reviews from 500+ brand partners" },
                  { icon: Globe, text: "Embeddable widget or full API access" },
                  { icon: Shield, text: "Pre-moderated, fraud-free content" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-zinc-700 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                View API Documentation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white/50 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-zinc-900">
              Platform <span className="text-indigo-600">Capabilities</span>
            </h2>
            <p className="text-zinc-600 max-w-xl mx-auto">
              Everything both brands and retailers need in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Analysis",
                description: "Automatic sentiment detection, rating mismatch alerts, and instant pros/cons summaries.",
                gradient: "from-indigo-500 to-purple-500",
                bg: "bg-indigo-50"
              },
              {
                icon: Globe,
                title: "Syndication Network",
                description: "Connect brands with retailers. Push reviews to partners or receive them via API.",
                gradient: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50"
              },
              {
                icon: Shield,
                title: "Fraud Detection",
                description: "ML-powered fake review detection protects brand and retailer reputation.",
                gradient: "from-emerald-500 to-teal-500",
                bg: "bg-emerald-50"
              },
              {
                icon: BarChart3,
                title: "Business Intelligence",
                description: "Monthly ReviewPulse reports with actionable insights for strategic decisions.",
                gradient: "from-orange-500 to-amber-500",
                bg: "bg-orange-50"
              },
              {
                icon: Zap,
                title: "Real-time Webhooks",
                description: "Instant notifications when new reviews arrive. Both ends stay in sync.",
                gradient: "from-pink-500 to-rose-500",
                bg: "bg-pink-50"
              },
              {
                icon: CheckCircle2,
                title: "Verified Buyers",
                description: "Purchase verification increases trust and conversion rates by 34%.",
                gradient: "from-violet-500 to-purple-500",
                bg: "bg-violet-50"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className={`group relative p-8 rounded-3xl ${feature.bg} border border-zinc-100 hover:border-zinc-200 transition-all hover:shadow-xl hover:shadow-zinc-200/50 cursor-pointer`}
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-900">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50M+", label: "Reviews Processed" },
              { value: "500+", label: "Brand Partners" },
              { value: "150+", label: "Retail Integrations" },
              { value: "<50ms", label: "API Response" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-zinc-50 via-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-zinc-900">
              Simple, Transparent <span className="text-indigo-600">Pricing</span>
            </h2>
            <p className="text-zinc-600 max-w-xl mx-auto">
              Choose the plan that fits your review management needs. All plans include core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="relative p-8 rounded-3xl bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Free</h3>
                <p className="text-sm text-zinc-500">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-zinc-900">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Up to 100 reviews/month", "1 product", "Basic analytics", "Email support", "Widget embed"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/register"
                className="block w-full py-3 text-center text-sm font-bold border-2 border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier - Popular */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/25 scale-105">
              <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <p className="text-sm text-indigo-200">For growing brands</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black">$99</span>
                <span className="text-indigo-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited reviews", "Up to 50 products", "AI sentiment analysis", "Retail syndication (5 partners)", "Priority support", "ReviewPulse reports"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-indigo-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/register"
                className="block w-full py-3 text-center text-sm font-bold bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all cursor-pointer"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="relative p-8 rounded-3xl bg-white border border-zinc-200 shadow-xl shadow-zinc-200/50">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Enterprise</h3>
                <p className="text-sm text-zinc-500">For large organizations</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-zinc-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro", "Unlimited products", "Unlimited syndication", "Custom integrations", "Dedicated account manager", "SLA guarantee", "SSO & advanced security"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/register"
                className="block w-full py-3 text-center text-sm font-bold border-2 border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-8">
            All plans include 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[2px] overflow-hidden shadow-2xl shadow-indigo-500/25">
            <div className="relative rounded-[2.5rem] bg-white p-12 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-4 text-zinc-900">
                Ready to connect your review ecosystem?
              </h2>
              <p className="text-zinc-600 max-w-xl mx-auto mb-8">
                Whether you&apos;re a brand looking to syndicate or a retailer seeking verified content, 
                Prodomatix is your bridge.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/register"
                  className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  Join as a Brand
                </Link>
                <Link 
                  href="/docs"
                  className="px-8 py-4 text-base font-bold text-zinc-700 border-2 border-zinc-200 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/50 transition-all cursor-pointer"
                >
                  Integrate as Retailer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                  <Zap className="h-4 w-4 fill-white text-white" />
                </div>
                <span className="font-bold text-zinc-900">Prodomatix</span>
              </Link>
              <p className="text-sm text-zinc-500">
                Connecting brands and retailers through authentic reviews.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-zinc-900">For Brands</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="/register" className="hover:text-indigo-600 transition-colors">Get Started</Link></li>
                <li><Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                <li><Link href="#for-brands" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-zinc-900">For Retailers</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="/docs" className="hover:text-indigo-600 transition-colors">API Documentation</Link></li>
                <li><Link href="#for-retailers" className="hover:text-indigo-600 transition-colors">Integration Guide</Link></li>
                <li><Link href="/sandbox" className="hover:text-indigo-600 transition-colors">Sandbox</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-zinc-900">Company</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/integrity" className="hover:text-indigo-600 transition-colors">Review Integrity</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <span>© 2026 Prodomatix. All rights reserved.</span>
            <span>Built for brands and retailers.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

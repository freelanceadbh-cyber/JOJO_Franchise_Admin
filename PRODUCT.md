# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Franchise Store Owners & Managers:** Operators of retail ice cream parlors and kiosks across 50+ regional locations. Their primary job is replenishing store stock (ice cream tubs, sundaes, shakes, waffle cones, and exotic cups), tracking wholesale order dispatch in real-time, managing store billing, and downloading compliant GST tax invoices.
- **HQ Operations & Admin Team:** Central headquarters managers (Chennai operations) responsible for franchise onboarding, KYC/GST verification, product catalog management, wholesale pricing, order fulfillment dispatch, and regional tax and revenue reporting.
- **Prospective Franchise Partners & Visitors:** Prospective entrepreneurs and brand visitors evaluating franchise opportunities, learning about the gourmet product promise ("100% Pure Milk, Zero Artificial Fats"), and accessing the partner portal.

## Product Purpose

JoJo Ice Creams operates an integrated B2B franchise management platform and partner portal that connects central dairy production with decentralized franchise stores. The platform eliminates friction in bulk wholesale ordering, automates tax compliance with instant 5% GST PDF invoice generation, provides secure Razorpay digital checkout, and ensures transparent order fulfillment tracking. Success means zero inventory stockouts for retail parlors, streamlined fulfillment turnaround, and automated, audit-ready financial accounting.

## Positioning

A dedicated "Taste then order" gourmet dairy ice cream franchise network. Unlike generic enterprise ERPs or consumer food aggregators, JoJo Creams combines gourmet dairy craftsmanship (pure milk fats, real fruits, imported cocoa) with a purpose-built B2B partner portal tailored specifically for cold-chain replenishment, live order status updates, and direct franchise-to-HQ financial synchronization.

## Operating Context

- **Operational Environment:** Fast-paced retail parlor counters and back-office storage rooms where franchise operators use counter tablets, desktop computers, or mobile phones.
- **Primary Workflows:**
  - Franchisees: Browse catalog by product category -> add bulk units to cart -> checkout via Razorpay or generate proforma invoice -> track shipment status -> download official PDF tax invoice.
  - HQ Admin: Monitor incoming orders -> transition status (Pending -> Processing -> Out for Delivery -> Delivered) -> update inventory levels -> manage franchise stores -> generate tax and sales analytics.
- **Financial & Regulatory Context:** Indian GST tax regime (5% GST standard for dairy ice cream supply), formal proforma invoicing before settlement, and Razorpay payment verification (order ID, signature, webhook validation).

## Capabilities and Constraints

- **Confirmed Capabilities:**
  - Role-based portal routing: Public Showcase (`/`), Franchise Partner Portal (`/portal`), HQ Administrator Portal (`/admin`), and Authentication (`/auth/signin`).
  - Wholesale catalog ordering with category filtering (Ice Cream, Sundaes, Shakes, Waffles, Exotic Cups).
  - Razorpay payment gateway integration supporting UPI, Netbanking, and Cards.
  - Automated 5% GST tax calculation and dynamic PDF tax invoice generation via PDFKit.
  - Proforma invoice issuance with payment validity windows.
  - Two-way in-app communication between franchise stores and HQ admins.
  - Live notification feed for real-time status and delivery alerts.
- **Technical Stack & Constraints:**
  - Next.js (App Router, Next.js 16), React 19, TypeScript.
  - Tailwind CSS v4 styling.
  - Prisma ORM with PostgreSQL database (`DATABASE_URL`, `DIRECT_URL`).
  - Auth.js / NextAuth v5 session management and role-based access control (`FRANCHISE_OWNER`, `ADMIN`).

## Brand Commitments

- **Name & Identity:** "JoJo Creams" / "JoJo Ice Creams" ("Taste then order", "Crafting Bliss Since 2012").
- **Brand Palette:** Crimson (`#DC143C`), Deep Maroon (`#8B0000`), Soft Pink (`#FFE6E6`), Warm Cream background (`#FFFDF9`), Dark Chocolate foreground text (`#1E1215`).
- **Typography:** Oceanwide (`/fonts/Oceanwide-Semibold.otf`, `/fonts/Oceanwide-SemiboldOblique.otf`) for prominent brand headings; clean, highly legible modern sans-serif for data-dense tables and administrative controls.
- **Voice & Tone:** Indulgent, inviting, and gourmet for product presentation; crisp, unambiguous, transparent, and authoritative for operational and billing workflows.

## Evidence on Hand

- Functional Next.js 16 codebase with complete database schema in [schema.prisma](file:///c:/Dept/Projects/JOJO%202%20-%20Copy/Jojo-icecreams/prisma/schema.prisma) and seed data.
- Working routes for catalog, cart, checkout, proforma invoices, order management, and admin dashboards.
- Brand font assets in `/public/fonts/Oceanwide-Semibold.otf` and `/public/fonts/Oceanwide-SemiboldOblique.otf`.
- Defined brand theme variables in [globals.css](file:///c:/Dept/Projects/JOJO%202%20-%20Copy/Jojo-icecreams/src/app/globals.css).

## Product Principles

- **Zero Friction Replenishment:** Parlor managers must be able to assess stock, assemble bulk replenishment orders, and check out in under two minutes.
- **Absolute Financial & Tax Transparency:** Every order, GST amount (5%), proforma record, and payment status must be explicitly stated, verifiable, and exportable without manual reconciliation.
- **Operational Clarity Over Decoration:** Public marketing pages evoke sensory delight and craftsmanship; partner and admin surfaces prioritize scanability, information density, high contrast, and error prevention.
- **Reliable Cold-Chain Communication:** Clear, staged order lifecycle updates (Pending, Processing, In Transit, Delivered) ensure stores prepare freezer space and never run out of signature flavors.

## Accessibility & Inclusion

- High contrast text ensuring legibility in varied parlor lighting conditions (meeting WCAG AA standards; dark chocolate text on cream backgrounds).
- Fully responsive design accommodating mobile phones, counter tablets, and wide administrative monitors.
- Complete keyboard accessibility and screen-reader compatible semantics for tables, status filters, and action dialogs.

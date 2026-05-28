This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

**RESEARCH NOTES :-**
# Research and Feature Comparison - Compensation Intelligence Platform

This document presents a research analysis of leading compensation platforms—**Levels.fyi**, **6figr**, **AmbitionBox**, and **Glassdoor**—to define the exact product requirements and differentiation for our structured Compensation Intelligence platform.

---

## 1. Key Observations

### 📊 The Prerogative of Levels Over Job Titles
- **Title Inflation**: A "Senior Software Engineer" at a startup might map to a Mid-Level (L4/L5) at Google. Comparing salaries based strictly on job titles is misleading.
- **Standardized Level Mapping**: Levels.fyi succeeds because it maps arbitrary company levels to a standardized scale (e.g., Junior, Mid, Senior, Staff, Principal). This creates comparable data.
- **Action for Our Platform**: We must enforce a standard level tier system (JUNIOR, MID, SENIOR, STAFF, PRINCIPAL) and map all ingested records to these standardized tiers.

### 💰 The Anatomy of Total Compensation (TC)
- **High-earning Roles**: Highly-compensated tech roles derive a large percentage of their income from equity (RSUs/options) and performance bonuses rather than base salary.
- **Aggregated vs. Granular**: Glassdoor historically listed single "salary" figures, which fails to show stock growth or bonuses.
- **Action for Our Platform**: We must store and display compensation in its component parts: **Base Salary**, **Stock Grants (annualized)**, and **Annual Performance Bonuses**, summing up to **Total Compensation**.

### 📍 Localized and Cost-of-Living Dynamics
- **Geography Matters**: Compensation for the same role and level varies dramatically between Tech Hubs (e.g., San Francisco, Bangalore) and secondary locations.
- **Action for Our Platform**: Location must be a top-level filtering and aggregation dimension.

---

## 2. Feature Comparison Sheet

The table below analyzes existing players and details what we will build to achieve product excellence.

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? (Our Platform Spec) |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Standardized Level Mapping** | ✅ Yes | ❌ No | ❌ No | ❌ No | **Yes (Core)**: Map individual levels to a standard hierarchy (e.g., L3/E3 -> JUNIOR). |
| **TC Breakdown (Base/Stock/Bonus)** | ✅ Yes | 🟡 Partial | ❌ No | ❌ No | **Yes (Core)**: Explicitly store and display Base, Annual Stock, and Bonus. |
| **Level-by-Level Comparison** | ✅ Yes | ❌ No | ❌ No | ❌ No | **Yes**: Direct comparison tool showing compensation difference at same level. |
| **Career Path Visualization** | ❌ No | ✅ Yes | ❌ No | ❌ No | **Yes**: Show trajectory and median TC growth across the standard levels. |
| **Location & Cost-of-Living Filter** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | **Yes**: Support filtering by location and comparing pay ratios between hubs. |
| **Company Payout Aggregation** | ✅ Yes | 🟡 Partial | ✅ Yes | ✅ Yes | **Yes**: Chart-driven comparison showing top-paying companies by median TC. |
| **Text Reviews & Ratings** | ❌ No | ❌ No | ✅ Yes | ✅ Yes | **No**: Excluded to keep the platform hyper-focused on structured, objective data. |

---

## 3. Product Specification & Implementation Blueprint

To deliver a platform focused on **structured and comparable data**, we will implement the following:

### A. Data Normalization Architecture
Every salary submission will be parsed and standardized:
- **Company Normalization**: Merge variations (e.g., "Google LLC", "google") into a single database company record.
- **Level Normalization**: Map custom titles/levels to standardized tiers:
  - `JUNIOR`: L3 (Google), IC3 (Meta), SDE-I (Amazon)
  - `MID`: L4 (Google), IC4 (Meta), SDE-II (Amazon)
  - `SENIOR`: L5 (Google), IC5 (Meta), Senior SDE (Amazon)
  - `STAFF`: L6 (Google), IC6 (Meta), Principal SDE (Amazon)
  - `PRINCIPAL`: L7+ (Google), Partner/Director (others)

### B. Analytics and Compare Dashboard
Our analytics engine will compute the following:
1. **Median Metrics**: Use median values (instead of averages) to prevent high-outlier distortion in salary charts.
2. **Standard Salary Component Charts**: Use stacked bar charts to visualize Base vs. Stock vs. Bonus across different levels.
3. **Company Rankings**: Interactive lists showing top-paying employers based on median Total Compensation at specific standard tiers.


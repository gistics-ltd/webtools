# Gistics Limited — car hire website

Website for **Gistics Limited**, a car hire company based in Kampala, Uganda.

Visitors can learn about the service, browse the fleet, get an instant guide price and send a quote request. Requests are delivered to the team by email through SMTP. No payment is taken online.

## What is included

- Responsive marketing site with About, Get a quote, Fleet, FAQ and Contact sections
- Instant quote calculator for vehicle, route, days and driver options
- Quote request form with validation and spam protection
- Email notifications to the team, with an optional customer acknowledgement
- Contact details, Google Maps embed and directions link
- Basic SEO, Open Graph metadata, sitemap and structured data

## Built with

- Next.js 16 (App Router)
- React 19 and TypeScript
- Tailwind CSS v4
- Zod for form validation
- Nodemailer for SMTP email
- Vitest for unit tests

## Requirements

- Node.js 20 or newer
- npm
- An SMTP mailbox if quote emails should be sent outside development

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

Fill in the values in `.env.local` before testing quote emails. The site runs without SMTP in development: the form shows a fallback message and a pre-filled email link so a lead is not lost.

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, no trailing slash. Used for SEO and canonical links. Set at build time. |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port, usually `587` or `465` |
| `SMTP_SECURE` | `true` for port 465, otherwise `false` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password or app password |
| `QUOTE_TO_EMAIL` | Inbox that receives quote requests |
| `QUOTE_FROM_EMAIL` | From address for outgoing mail |
| `SEND_CUSTOMER_CONFIRMATION` | Set to `false` to disable customer acknowledgement emails |

Never commit real credentials.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm test` | Run unit tests |
| `npm run format` | Format the code with Prettier |

Before deploying, run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`.

## Editing content

| File | Content |
| --- | --- |
| `src/config/site.ts` | Business name, phone, email, address, opening hours and map |
| `src/config/pricing.ts` | VAT, rounding, discounts and USD display rate |
| `src/data/fleet.ts` | Vehicles, seats, rates and images |
| `src/data/routes.ts` | Routes and route fees |
| `src/data/faqs.ts` | FAQ questions and answers |
| `src/data/services.ts` | Service descriptions |
| `public/images/` | Hero and fleet photography |

Pricing values and some business details are currently placeholders and should be confirmed before launch.

## Deployment

The site can run on Vercel or any Node.js host.

```bash
npm ci
npm run build
npm start
```

Set the environment variables on the host. `NEXT_PUBLIC_SITE_URL` must be available during the build; SMTP values are read at runtime. The included `Dockerfile` supports a standalone production build.

## Project structure

```text
src/app/          Pages, API route and error pages
src/components/   Layout, sections, quote form and SEO helpers
src/config/       Site and pricing configuration
src/data/         Fleet, routes, services and FAQs
src/lib/          Pricing, validation, email and SEO logic
public/           Brand assets and images
```

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PagerDuty Workshop Trigger - A React SPA for simulating Kubernetes errors and sending them to PagerDuty Events API v2. Used for training workshops on incident response.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 8847 (accessible via oracle.local)
npm run build        # TypeScript check + Vite production build

# Testing
npm test             # Run Vitest in watch mode
npm run test:coverage # Run tests with coverage report (thresholds: 100% statements/functions/lines, 95% branches)

# Linting
npm run lint         # ESLint check
```

## Architecture

```
src/
├── components/     # React UI components with CSS modules
│   ├── Header.tsx         # App header with theme toggle and status indicator
│   ├── ConfigPanel.tsx    # Routing key input with validation
│   ├── TriggerGrid.tsx    # Grid of 8 K8s error trigger cards
│   ├── TriggerCard.tsx    # Individual error trigger with loading states
│   └── StatusPanel.tsx    # Trigger history (last 5)
├── hooks/          # Custom React hooks
│   ├── useRoutingKey.ts   # Session storage for routing key
│   ├── useTheme.ts        # Dark/light mode persistence
│   └── useTriggerHistory.ts # Trigger activity log
├── services/       # Business logic
│   ├── pagerduty.ts       # Events API v2 integration
│   └── storage.ts         # sessionStorage/localStorage wrappers
├── data/
│   └── k8sErrors.ts       # 8 predefined K8s error scenarios
├── types/          # TypeScript interfaces
└── styles/         # Global CSS variables (PagerDuty branding)
```

## Key Implementation Details

- **No backend** - Direct browser fetch to `https://events.pagerduty.com/v2/enqueue`
- **Session storage** - Routing key cleared on tab close (security)
- **PagerDuty branding** - Green: `#048A24`, uses Inter font
- **Test coverage** - Vitest with 100% statement/line/function coverage

## PagerDuty Events API

The app sends Events API v2 payloads with:
- `routing_key` from user input
- `event_action: "trigger"`
- Unique `dedup_key` per trigger
- Realistic K8s-style `source` and `custom_details`

## Environment

- Development: `http://oracle.local:8847`
- Uses Vite with `host: true` for local network access

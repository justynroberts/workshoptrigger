# PRD: PagerDuty Workshop Trigger

## Overview

A visually engaging web application that allows workshop participants to trigger simulated Kubernetes errors to PagerDuty using their own routing keys. The application serves as a hands-on training tool for PagerDuty incident response workflows.

## Goals

1. Provide an intuitive interface for workshop participants to trigger test incidents
2. Simulate realistic Kubernetes error scenarios
3. Follow PagerDuty brand guidelines for consistent visual identity
4. Enable self-service incident triggering without backend infrastructure

## Target Users

- Workshop participants learning PagerDuty incident response
- DevOps engineers testing PagerDuty integrations
- Training facilitators demonstrating PagerDuty capabilities

## Functional Requirements

### FR-1: Routing Key Management
- Users can enter their PagerDuty Events API v2 routing key (integration key)
- Routing key is stored in browser session storage (not persisted)
- Clear visual indicator when routing key is configured
- Ability to clear/change routing key

### FR-2: Kubernetes Error Simulation Triggers
The application provides buttons to trigger the following simulated K8s errors:

| Error Type | Severity | Description |
|------------|----------|-------------|
| Pod CrashLoopBackOff | critical | Container repeatedly crashing and restarting |
| Node NotReady | critical | Kubernetes node has stopped responding |
| OOMKilled | critical | Container exceeded memory limits |
| ImagePullBackOff | warning | Failed to pull container image |
| PersistentVolumeClaim Pending | warning | Storage volume cannot be provisioned |
| Service Endpoint NotReady | error | Service has no available endpoints |
| Deployment Rollout Failed | error | Deployment update failed to complete |
| HPA Max Replicas | warning | Horizontal Pod Autoscaler at maximum capacity |

### FR-3: PagerDuty Events API Integration
- Send events to `https://events.pagerduty.com/v2/enqueue`
- Use Events API v2 format with proper payload structure
- Include realistic K8s-style source identifiers
- Generate unique dedup_key per trigger to allow multiple incidents
- Display success/failure feedback to user

### FR-4: Visual Feedback
- Loading states during API calls
- Success confirmation with incident dedup key
- Error messages for API failures
- Animation effects on trigger buttons

## Non-Functional Requirements

### NFR-1: Branding
- PagerDuty color palette:
  - Primary Green: `#048A24`
  - Dark: `#4B4F4F`
  - Accent/Volt: `#06AC38` (lighter green for hover states)
  - Background: Dark theme default with toggle option
- Modern, clean typography (system fonts or similar to PagerDuty's style)
- Professional but engaging visual design
- "PagerDuty Workshop Trigger" branding in header

### NFR-2: User Experience
- Single-page application, no page reloads
- Mobile-responsive design
- Accessible (WCAG 2.1 AA)
- No authentication required (routing key is user-provided)

### NFR-3: Technical
- Client-side only (no backend required)
- Vite + React + TypeScript stack
- 100% test coverage
- Host accessible via `oracle.local`

### NFR-4: Security
- Routing keys stored only in session storage
- No logging of routing keys
- HTTPS for PagerDuty API calls (handled by browser)

## UI Components

### Header
- PagerDuty Workshop Trigger title
- Dark/light mode toggle
- Status indicator for routing key

### Configuration Panel
- Routing key input field (masked like password)
- "Show/Hide" toggle for key visibility
- "Save" and "Clear" buttons
- Validation feedback

### Trigger Grid
- Card-based layout for each error type
- Each card shows:
  - Error name
  - Severity badge (color-coded)
  - Brief description
  - Trigger button
- Visual feedback on trigger (ripple effect, loading spinner)

### Status Panel
- Recent trigger history (last 5)
- Shows: timestamp, error type, status (success/failed)
- Dedup key for reference

## API Payload Structure

```json
{
  "routing_key": "<user-provided-key>",
  "event_action": "trigger",
  "dedup_key": "<unique-generated-key>",
  "payload": {
    "summary": "[K8s] Pod CrashLoopBackOff in namespace production",
    "source": "kubernetes:workshop-cluster:production:pod/api-server-7d4f8c9b5-x2k9m",
    "severity": "critical",
    "timestamp": "2025-02-17T12:00:00.000Z",
    "component": "pod",
    "group": "kubernetes",
    "class": "CrashLoopBackOff",
    "custom_details": {
      "namespace": "production",
      "pod_name": "api-server-7d4f8c9b5-x2k9m",
      "container": "api-server",
      "restart_count": 5,
      "last_state": "Error",
      "cluster": "workshop-cluster"
    }
  }
}
```

## Success Criteria

1. User can enter routing key and trigger all 8 error types
2. Each trigger creates a unique incident in PagerDuty
3. Visual design matches PagerDuty brand identity
4. Application works on desktop and mobile browsers
5. 100% test coverage achieved
6. All components render without errors

## Out of Scope

- User authentication/accounts
- Persistent storage of routing keys
- Incident resolution from this application
- Custom error type creation
- Backend server infrastructure

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Header    │  │  Config     │  │   Trigger Grid      │ │
│  │  Component  │  │  Panel      │  │   (8 Error Cards)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Status Panel                          ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                      Services Layer                          │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │ PagerDuty       │  │ Session Storage                 │  │
│  │ Events Service  │  │ (Routing Key)                   │  │
│  └────────┬────────┘  └─────────────────────────────────┘  │
└───────────┼─────────────────────────────────────────────────┘
            │ HTTPS POST
            ▼
┌─────────────────────────────────────────────────────────────┐
│          https://events.pagerduty.com/v2/enqueue            │
└─────────────────────────────────────────────────────────────┘
```

## Milestones

1. Project setup and configuration
2. Core UI components with PagerDuty branding
3. Routing key management
4. PagerDuty Events API integration
5. All 8 error triggers implemented
6. Test coverage to 100%
7. PRD validation and final review

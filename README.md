# DengueGuard LK

DengueGuard LK is an individual SE3090 Mini Hackathon submission: a responsive community dengue-risk awareness and tracking prototype designed for Sri Lankan users.

## Selected problem

Dengue is endemic across Sri Lanka. Everyday environmental risks such as stagnant water, blocked drains, discarded containers, and poorly managed waste can create mosquito breeding places. Community members may notice these hazards but lack a simple way to record, prioritise, and follow up on them.

Official context: [National Dengue Control Unit - Sri Lanka situation](https://www.dengue.health.gov.lk/sri-lanka-situation/).

## Proposed solution

The application provides a browser-based prototype that helps a community member:

1. Record a possible mosquito breeding risk with friendly input validation.
2. Search, filter, prioritise, and update risk reports.
3. Complete a weekly household prevention checklist and calculate a safety score.

This is an educational prototype, not an official government reporting channel. Included sample reports are clearly labelled and are not real incident reports.

## Main features

- Responsive landing page explaining the Sri Lankan problem.
- Risk-report form with district, category, severity, and description validation.
- Versioned browser storage using `localStorage`.
- Search and filtering by location, district, and status.
- Three-step report workflow: Pending, Clean-up planned, and Resolved.
- Dynamic summary counts and high-priority indicator.
- Six-item household prevention checklist with a calculated percentage score.
- Mobile navigation and accessible form labelling.

## Technologies used

- React 19
- TypeScript
- Vite
- Custom responsive CSS
- Lucide React icons
- Browser Local Storage
- OpenAI Sites hosting

## Installation and execution

Requirements: Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by the development server. To create a production build:

```bash
pnpm build
```

## Deployment

- Public application: https://dengueguard-lk-se3090.spiffy-crumb-1348.chatgpt.site
- GitHub repository: https://github.com/Visura13/dengueguard-lk

## Demonstration video

- Two-minute video: `ADD_VIDEO_URL`

## Student details and contribution

- Name: Amangilihewa V.S.D
- Student ID: IT21318184
- Submission ID: IT21318184 (individual make-up submission)
- Contribution statement: This is an individual make-up submission. I selected the dengue-risk problem, defined the feature scope, reviewed the generated interface and functionality against the marking scheme, tested form validation, search, filters, status updates, browser persistence, the prevention checklist, and responsive layouts, and prepared the documentation and deployment with AI assistance.

## AI tools used

- ChatGPT / Codex - helped interpret the rubric, frame the MVP, generate the initial React implementation and styling, and review build issues. The student reviewed the requirements, tested all interactions, and must be able to explain and modify the submitted code.

See [AI_PROMPT_LOG.md](AI_PROMPT_LOG.md) for the mandatory detailed log.

## Testing checklist

- Submit an empty report form and confirm friendly errors appear.
- Enter a description shorter than 15 characters and confirm it is rejected.
- Add a valid report and confirm it appears in the dashboard.
- Refresh the page and confirm the new report remains available.
- Search for a location and filter by district and status.
- Update a report through all three statuses.
- Complete and reset the household checklist.
- Check the site at mobile and desktop widths.
- Open the deployed link in a private/incognito window.

## Data and privacy

The prototype stores reports only in the current browser. Users are warned not to enter names, phone numbers, or other personal information. No report is sent to an authority or external database.

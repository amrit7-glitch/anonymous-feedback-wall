# Anonymous Feedback Wall

This project is a full-stack anonymous feedback platform where users can post feedback messages publicly without authentication.

The goal of this project was to understand how modern frontend and backend systems work together using edge technologies like Cloudflare Workers and Cloudflare KV while keeping the UI clean and responsive.

Users can:
- Submit anonymous feedback
- View feedback messages publicly
- See updates across devices
- Use dark/light mode
- Experience instant UI updates after posting feedback

---

# Technologies Used

## Frontend
- Astro
- HTML
- CSS
- JavaScript

## Backend
- Cloudflare Workers
- Cloudflare KV
- Supabase

## Database
- PostgreSQL (Supabase)

## Deployment
- Cloudflare Pages
- GitHub
- Wrangler CLI

---

# Architecture Explanation

## Frontend

The frontend is built using Astro and deployed on Cloudflare Pages.

I designed the UI as a split-screen layout:
- Left side contains the feedback form
- Right side displays public feedback messages

The frontend supports:
- Dark/light mode toggle
- Character counter
- Toast notifications
- Responsive design
- Instant feedback updates without page reload

Initially, feedback messages were rendered statically during build time, but that caused stale data issues. I later switched to client-side fetching so users can see newly submitted feedback dynamically.

---

## Backend

The backend is built using Cloudflare Workers.

### API Endpoints

#### Submit Feedback

```http
POST /api/submit
```

This endpoint:
- validates the request
- inserts feedback into Supabase
- refreshes Cloudflare KV cache
- returns the inserted message

---

#### Get Messages

```http
GET /api/messages
```

This endpoint first checks Cloudflare KV cache.

If cached data exists:
- it returns cached messages directly

Otherwise:
- it fetches data from Supabase
- stores it in KV
- returns the response

This reduces unnecessary database reads and improves performance.

---

# Database

Supabase PostgreSQL is used as the main database.

### Table Structure

| Column | Type |
|---|---|
| id | integer |
| name | text |
| message | text |
| created_at | timestamp |

---

# Caching Strategy

Cloudflare KV is used as a distributed caching layer for feedback messages.

### Flow

```text
GET /messages
→ check KV cache
→ if cache exists:
     return cached messages
→ else:
     fetch from Supabase
     cache response
     return messages
```

I used KV mainly to understand how edge caching works in real-world backend systems.

---

# Rate Limiting

I implemented IP-based rate limiting using Cloudflare KV to prevent spam submissions.

### Current Limit

```text
5 feedback submissions per minute per IP
```

If the limit is exceeded:

```http
429 Too Many Requests
```

response is returned.

---

# Setup Steps

## 1. Clone Repository

```bash
git clone https://github.com/amrit7-glitch/anonymous-feedback-wall.git

cd anonymous-feedback-wall
```

---

# Frontend Setup

## 2. Install Frontend Dependencies

```bash
cd astro-frontend

npm install
```

---

## 3. Configure Frontend Environment Variables

Create:

```text
astro-frontend/.env
```

Add:

```env
PUBLIC_API_URL=https://your-worker-url.workers.dev
```

---

## 4. Run Frontend Locally

```bash
npm run dev
```

---

# Backend Setup

## 5. Install Backend Dependencies

```bash
cd ../worker-api

npm install
```

---

## 6. Configure Backend Environment Variables

Create:

```text
worker-api/.dev.vars
```

Add:

```env
SUPABASE_URL=https://your-project.supabase.co

SUPABASE_ANON_KEY=your-anon-key
```

---

## 7. Configure Cloudflare KV

Create KV namespace:

```bash
npx wrangler kv namespace create "FEEDBACK_KV"
```

Then add the binding inside:

```text
wrangler.jsonc
```

---

## 8. Run Backend Locally

```bash
npm run dev
```

---

# Deployment

## Frontend
- Deployed using Cloudflare Pages
- GitHub auto deployment enabled

## Backend
- Deployed using Cloudflare Workers
- GitHub auto deployment enabled

Whenever changes are pushed to GitHub, both frontend and backend redeploy automatically.

---

# Assumptions

- Authentication was intentionally skipped because the project requirement focused on anonymous feedback.
- Feedback messages are public.
- Supabase acts as the source of truth.
- Cloudflare KV is used mainly for caching GET requests.
- Real-time updates are handled using periodic client-side fetching instead of WebSockets.

---

# What I Learned

Through this project I learned:
- how edge functions work
- how caching layers improve backend performance
- how frontend and backend communicate in production
- how CI/CD deployment pipelines work
- how rate limiting is implemented
- differences between static rendering and dynamic rendering

This project helped me understand how modern distributed web applications are structured beyond basic CRUD apps.

---

# Future Improvements

- Authentication system
- Admin moderation dashboard
- Spam detection
- Pagination
- Better realtime updates
- Advanced cache invalidation
- Search/filter support

---

# Author 
Amrit Raj

Amrit

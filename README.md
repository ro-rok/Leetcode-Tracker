<!-- Add custom styling -->
<style>
    body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        margin: 0; 
        padding: 20px; 
        background: #000; /* Black background */
        color: #f9f9f9; /* Light text for contrast */
    }
    h1 { color:rgb(109, 148, 187); text-align: center; margin-bottom: 0.5em; }
    h2 { color:rgb(88, 123, 158); margin-top: 1.5em; }
    p, li { color: #f9f9f9; }
    .logo { display: block; margin: 0 auto 1em auto; max-width: 200px; }
    /* Optional: adjust blockquotes for readability */
    blockquote { 
        border-left: 4px solid #ccc;
        margin: 1em 0;
        padding-left: 1em;
        color: #f9f9f9;
    }
</style>

# GrindMate.AI

<!-- Center the logo -->
<img src="./leetcode-tracker-frontend/public/logo-bg.webp" alt="GrindMate.AI Logo" class="logo"/>

> **GrindMate.AI** is your AI-powered LeetCode study companion—filter and practice company-specific questions, track progress, and get instant AI help on any problem.

---

## 🚀 Features

- **Company & Timeframe Filters**  
    *Drill into the exact company and timeframe (30 days / 3 months / 6 months / all time)*  
- **Progress Tracking**  
    *Mark questions solved/unsolved and revisit your hard ones*  
- **AI-Powered Chat**  
    *Ask our integrated AI tutor for hints, code reviews, and full walkthroughs*  
- **Random Practice**  
    *Grab a random unsolved question for surprise drills*  
- **One-Click Populate**  
    *Import curated LeetCode data in bulk*

---

## 🏗️ Tech Stack

```yaml
backend:
    language: Ruby on Rails (API-only)
    auth: Devise (cookie-based sessions)
    AI: GROQ Llama3 via Faraday + HTTPX
    scraping: Nokogiri + LeetCode GraphQL
    CORS: rack-cors

frontend:
    framework: React 18 + Vite
    styling: Tailwind CSS + Styled-Components
    state: React Hooks
    animation: GSAP
    CI/CD: GitHub Actions → Heroku / Vercel
```

### 📦 Installation

**Backend**

```bash
git clone https://github.com/your-org/grindmate-backend.git
cd grindmate-backend
bundle install
yarn install
rails db:setup
# set your GROQ_API_KEY in .env
rails s -p 3000
```

**Frontend**

```bash
cd leetcode-tracker-frontend
npm install
# set VITE_API_URL=http://localhost:3000 in .env
npm run dev
```

## 💡 Usage

- Sign Up / Log In  
- Populate your first company’s questions  
- Select a company and timeframe tab  
- Solve or Unsolve questions; track status  
- Ask AI for hints or full solutions via the chat icon  
- Grab a random practice card for extra drills  

## 📣 Thanks & Credits

Huge thanks to @liquidslr for the original company-wise LeetCode dataset and inspiration!

## 🧪 Testing

- Backend: bundle exec rspec  
- Frontend: npm test  

## 🔧 Deployment

- Heroku (Rails API)  
- Vercel (React front-end)  

## 🎉 License

MIT © Rohan Khanna
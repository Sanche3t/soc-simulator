# SecureOps Training Platform

A web-based SOC (Security Operations Center) Analyst Training Simulator where users role-play as security analysts responding to realistic cyber security incidents.

## 🎯 Features

- **Three Realistic Scenarios:**
  - Phishing Attack Campaign (5 minutes)
  - Ransomware Infection (6 minutes)
  - Data Exfiltration (7 minutes)

- **Professional Training Interface:**
  - Incident investigation phase
  - Response action selection
  - Multiple-choice documentation
  - Automated scoring system

- **User Progress Tracking:**
  - Dashboard with statistics
  - Scenario completion status
  - Score history
  - Average performance metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd soc-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- **Username:** analyst
- **Password:** demo123

## 📁 Project Structure

```
soc-simulator/
├─��� app/
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Login page
│   ├── dashboard/
│   │   └── page.js              # Dashboard
│   ├── scenario/
│   │   ├── [id]/
│   │   │   └── page.js          # Scenario pages
│   │   └── ...
│   └── api/
│       └── submit/
│           └── route.js          # Scoring API
├── components/
│   ├── Navbar.js                # Navigation bar
│   ├── ProtectedRoute.js        # Auth wrapper
│   └── ...
├── styles/
│   ├── globals.css              # Global styles
│   ├── login.css                # Login page styles
│   ├── dashboard.css            # Dashboard styles
│   └── ...
├── data/
│   ├── scenarios.json           # Scenario content
│   ├── questions.json           # MCQ questions
│   └── correctAnswers.json      # Answer key
└── package.json
```

## 🎨 Design

- **Dark Theme:** Professional SOC environment aesthetic
- **Color Scheme:** Blue, red, orange, and green accents
- **Responsive:** Works on desktop, tablet, and mobile
- **Accessibility:** Clear typography and high contrast

## 🔐 Authentication

Simple login system with hardcoded credentials for demo purposes:
- Username: `analyst`
- Password: `demo123`

User session stored in browser localStorage.

## 📊 Scoring System

Each scenario is scored out of 100 points:
- **Investigation Phase:** 25-30 points (auto-awarded)
- **Response Actions:** 35-40 points (based on correct selections)
- **Documentation:** 25-30 points (MCQ answers)

**Pass Threshold:** 70/100

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

Your app will be live at `your-project.vercel.app`

### Build for Production

```bash
npm run build
npm start
```

## 📚 Tech Stack

- **Frontend:** Next.js 14, React 18
- **Styling:** Plain CSS with CSS variables
- **State Management:** React hooks (useState, useContext)
- **Data Storage:** JSON files + localStorage
- **Deployment:** Vercel

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### localStorage errors
Make sure you're running in a browser environment (not SSR context)

### Styles not loading
Ensure CSS files are imported in the layout or component

## 📖 How to Use

1. **Login:** Use demo credentials (analyst/demo123)
2. **Dashboard:** View active incidents and your progress
3. **Start Scenario:** Click "Start" on any incident
4. **Investigate:** Read the incident briefing and analyze evidence
5. **Respond:** Select appropriate response actions
6. **Document:** Answer multiple-choice questions
7. **Submit:** Get your score and feedback
8. **Retry:** Attempt scenarios again to improve your score

## 🎓 Learning Outcomes

After completing this training, users will understand:
- How to identify phishing attacks
- Ransomware detection and containment
- Data exfiltration indicators
- Incident response procedures
- Security incident documentation

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Development

### Adding New Scenarios

1. Add scenario data to `data/scenarios.json`
2. Add questions to `data/questions.json`
3. Create new page at `app/scenario/[new-id]/page.js`
4. Update dashboard to include new scenario

### Customizing Styling

Edit CSS variables in `styles/globals.css`:
```css
:root {
  --bg-primary: #0A0E27;
  --accent-info: #0A84FF;
  /* ... more variables */
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for cybersecurity education**

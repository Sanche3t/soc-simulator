'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

const SCENARIOS_DATA = {
  scenarios: [
    {
      id: "phishing",
      title: "Phishing Attack Campaign",
      severity: "critical",
      duration: "5 minutes",
      briefing: {
        incidentId: "INC-2024-0156",
        timestamp: "February 14, 2024 - 14:23 UTC",
        situation: "At 14:15 UTC, the email security gateway flagged 15 suspicious emails claiming to be from 'IT Support' requesting urgent credential verification. Three employees clicked the link.",
        mission: ["Analyze the suspicious email", "Identify malicious indicators", "Determine scope of attack", "Execute containment procedures", "Document findings"]
      },
      evidence: {
        email: {
          from: "support@ciphertech-it.com",
          to: "employees@ciphertech.com",
          subject: "URGENT: Account Verification Required",
          date: "Feb 14, 2024 14:15:32",
          body: "Your account will be suspended in 24 hours unless you verify your credentials immediately.",
          link: "http://ciphertech-verify.tk/login.php"
        },
        analysis: {
          authentication: { spf: "FAIL", dkim: "FAIL", dmarc: "FAIL", returnPath: "bounce@malicious-server.ru" },
          domain: { suspicious: "ciphertech-it.com", legitimate: "ciphertech.com", age: "2 days", issue: "typosquatting" },
          url: { link: "http://ciphertech-verify.tk/login.php", flagged: "8/12 vendors", encryption: "No HTTPS", classification: "credential harvesting" },
          impact: { sent: 15, opened: 12, clicked: 3, affected: ["sarah.chen@ciphertech.com", "mike.ross@ciphertech.com", "jessica.day@ciphertech.com"] }
        }
      },
      actions: [
        { id: "action1", text: "Quarantine all similar emails", impact: "critical", correct: true, points: 10 },
        { id: "action2", text: "Block sender domain at gateway", impact: "critical", correct: true, points: 10 },
        { id: "action3", text: "Reset passwords for 3 affected users", impact: "critical", correct: true, points: 10 },
        { id: "action4", text: "Send security alert to organization", impact: "high", correct: true, points: 5 },
        { id: "action5", text: "Create incident ticket", impact: "medium", correct: true, points: 3 },
        { id: "action6", text: "Notify IT Security Manager", impact: "medium", correct: true, points: 2 }
      ]
    },
    {
      id: "ransomware",
      title: "Ransomware Infection",
      severity: "critical",
      duration: "6 minutes",
      briefing: {
        incidentId: "INC-2024-0157",
        timestamp: "February 14, 2024 - 10:47 UTC",
        situation: "A finance analyst opened 'Invoice_February_2024.pdf'. Within seconds, EDR detected mass file modifications and files renamed with .locked extensions. Malware is active.",
        mission: ["Assess endpoint state and process timeline", "Identify C2 and network indicators", "Contain the threat immediately", "Decide recovery strategy", "Document findings"]
      },
      evidence: {
        endpoint: { device: "DESKTOP-EMP-042", user: "Sarah Chen (Finance Department)", ip: "192.168.1.142", os: "Windows 10 Pro", status: "INFECTED - Encryption Active" },
        processTimeline: [
          { time: "10:45 AM", name: "outlook.exe", pid: 3421, note: "Normal" },
          { time: "10:47 AM", name: "attachment.pdf.exe", pid: 5892, note: "MALICIOUS" },
          { time: "10:47 AM", name: "powershell.exe", pid: 6103, note: "SUSPICIOUS - base64 encoded command" },
          { time: "10:48 AM", name: "encryption", pid: 7001, note: "File Encryption Started" }
        ],
        malware: { hash: "a7f2c91d3e4b5a6f8c9d2e1b4a5c6d7e", vt: "45/70 vendors flagged", classification: "Conti Ransomware (Variant 2.3)", firstSeen: "3 days ago", behaviors: ["File encryption using AES-256", "Network enumeration", "Shadow copy deletion", "C2 communication", "Lateral movement via SMB"] },
        network: [
          { label: "MALICIOUS", remote: "185.220.101.45:443", type: "TOR Exit Node - C2", dataSent: "2.3 MB", status: "ACTIVE" },
          { label: "Normal", remote: "192.168.1.1:53", type: "Internal DNS", status: "Safe" }
        ],
        filesystem: { encryptedCount: 1247, breakdown: { docx: 427, xlsx: 315, pdf: 505 }, critical: ["Q4_Financial_Report.xlsx", "Client_Invoices_Feb2024.docx", "Payroll_Data_2024.xlsx"], speed: "~15 files/second", elapsed: "8 minutes" },
        ransomNote: { wallet: "bc1qxy2kgdygjrsqtzq2n0yrf...", amount: "0.5 BTC (~$25,000)", deadline: "48 hours", warnings: ["After 48 hours, price doubles", "After 72 hours, key deleted forever"] },
        backup: { lastBackup: "12 hours ago (10:00 PM)", location: "Network Storage (offline)", integrity: "Verified - Not infected", potentialLoss: "~4 hours of work", recoveryTime: "2-3 hours" }
      },
      actions: [
        { id: "isolate", text: "Isolate infected device from network", impact: "critical", correct: true, points: 10 },
        { id: "disable-account", text: "Disable Sarah Chen's account", impact: "critical", correct: true, points: 8 },
        { id: "block-c2", text: "Block C2 IP (185.220.101.45) at firewall", impact: "critical", correct: true, points: 10 },
        { id: "kill-proc", text: "Kill malicious process", impact: "high", correct: true, points: 6 },
        { id: "check-backup", text: "Check backup integrity", impact: "high", correct: true, points: 6 },
        { id: "notify-manager", text: "Notify IT Security Manager", impact: "medium", correct: true, points: 4 }
      ],
      recoveryOptions: [
        { id: "pay", label: "Pay ransom ($25,000)", correct: false, points: 0 },
        { id: "restore", label: "Restore from backup (4 hours data loss)", correct: true, points: 12 },
        { id: "manual", label: "Attempt manual decryption", correct: false, points: 4 }
      ]
    },
    {
      id: "exfiltration",
      title: "Data Exfiltration",
      severity: "critical",
      duration: "7 minutes",
      briefing: {
        incidentId: "INC-2024-0158",
        timestamp: "February 14, 2024 - 02:47 UTC",
        situation: "Marcus Johnson accessed APEX_CLIENTS and transferred 4.2 GB to an external IP in Singapore outside normal hours.",
        mission: ["Review employee profile and baseline behavior", "Analyze anomalous timeline and destination IP", "Assess breach severity and regulatory impact", "Select response actions (preserve evidence)", "Document findings and next steps"]
      },
      evidence: {
        employee: { name: "Marcus Johnson", employeeId: "EMP-1547", position: "Senior DevOps Engineer", department: "Infrastructure & Operations", clearance: "Level 3", recent: ["LinkedIn profile updated 5 days ago", "Open to opportunities"] },
        baseline: { workHours: "9 AM - 6 PM EST (Mon-Fri)", location: "New York City, USA", avgData: "50 MB/day", maxQuery: "500 records", nightActivity: "Never recorded" },
        anomaly: { loginTime: "02:47 AM (6 hours before normal)", location: "Singapore", device: "Unknown (MAC: A4:C3:F0:2E:8D:1C)", dataVolume: "4.2 GB", querySize: "15,000 records" },
        timeline: [
          { time: "02:47:03 AM", event: "VPN Connection", ip: "103.45.127.89", device: "Unknown", auth: "SUCCESS" },
          { time: "02:49:22 AM", event: "Database Access - APEX_CLIENTS", authz: "Level 3" },
          { time: "02:49:45 AM", event: "SQL Query Executed", query: "SELECT * FROM APEX_CLIENTS WHERE status='ACTIVE'", records: 15000, size: "4.1 GB" },
          { time: "02:52:18 AM", event: "File Created", name: "client_backup.zip", size: "4.2 GB", encrypted: false },
          { time: "02:58:34 AM", event: "External Transfer (SSH/SCP)", dst: "203.45.67.89:22", duration: "5m 28s", status: "COMPLETE" },
          { time: "03:04:15 AM", event: "File Deleted", method: "Shift+Delete" },
          { time: "03:05:42 AM", event: "VPN Disconnection", session: "18m 39s" }
        ],
        destination: { ip: "203.45.67.89", location: "Bucharest, Romania", reputation: "HIGH RISK", blacklists: "2/10 feeds", associated: "Dark web marketplaces", ports: ["22 (SSH) OPEN", "9050 (TOR) OPEN"] },
        dataCompromised: { database: "APEX_CLIENTS", records: 15000, fields: ["customer_id", "first_name", "last_name", "email_address", "phone_number", "home_address", "account_balance", "transaction_history"], regulatory: ["GDPR: Notify within 72 hours", "CCPA: California residents notification", "Potential fines: Up to $50M or 4% revenue"], darkWebValue: "$105,000" }
      },
      actions: [
        { id: "disable-account", text: "Disable Marcus Johnson's account immediately", impact: "critical", correct: true, points: 10 },
        { id: "block-ip", text: "Block external IP (203.45.67.89)", impact: "critical", correct: true, points: 8 },
        { id: "notify-legal", text: "Notify Legal department", impact: "high", correct: true, points: 6 },
        { id: "notify-hr", text: "Notify HR department", impact: "high", correct: true, points: 5 },
        { id: "preserve-logs", text: "Preserve all logs and evidence", impact: "high", correct: true, points: 6 },
        { id: "dont-alert", text: "DO NOT alert employee yet", impact: "critical", correct: true, points: 5 }
      ]
    }
  ]
};

const QUESTIONS_DATA = {
  phishing: [
    { id: "q1", question: "What type of attack was this?", type: "single", options: [{ id: "A", text: "Malware infection" }, { id: "B", text: "Phishing/Social engineering" }, { id: "C", text: "DDoS attack" }, { id: "D", text: "Ransomware" }], correctAnswer: "B", points: 8 },
    { id: "q2", question: "What was the primary indicator of compromise?", type: "single", options: [{ id: "A", text: "Unusual network traffic" }, { id: "B", text: "File encryption activity" }, { id: "C", text: "Suspicious email with typosquatted domain" }, { id: "D", text: "Unauthorized database access" }], correctAnswer: "C", points: 6 },
    { id: "q3", question: "Which authentication checks failed?", type: "multiple", options: [{ id: "A", text: "SPF" }, { id: "B", text: "DKIM" }, { id: "C", text: "DMARC" }, { id: "D", text: "SSL/TLS Certificate" }, { id: "E", text: "Two-factor authentication" }], correctAnswers: ["A", "B", "C"], points: 8 },
    { id: "q4", question: "What was the malicious domain used?", type: "single", options: [{ id: "A", text: "ciphertech.com" }, { id: "B", text: "ciphertech-it.com" }, { id: "C", text: "ciphertech-support.net" }, { id: "D", text: "cipher-tech.com" }], correctAnswer: "B", points: 4 },
    { id: "q5", question: "How many employees were potentially compromised?", type: "single", options: [{ id: "A", text: "0 employees" }, { id: "B", text: "1-2 employees" }, { id: "C", text: "3 employees" }, { id: "D", text: "5+ employees" }], correctAnswer: "C", points: 4 }
  ],
  ransomware: [
    { id: "q1", question: "What malware family was detected?", type: "single", options: [{ id: "A", text: "Emotet" }, { id: "B", text: "Conti Ransomware" }, { id: "C", text: "Trickbot" }, { id: "D", text: "Zeus Trojan" }], correctAnswer: "B", points: 6 },
    { id: "q2", question: "How did the malware enter the system?", type: "single", options: [{ id: "A", text: "Email attachment (attachment.pdf.exe)" }, { id: "B", text: "USB drive" }, { id: "C", text: "Software vulnerability" }, { id: "D", text: "Brute force attack" }], correctAnswer: "A", points: 6 },
    { id: "q3", question: "What was the C2 server IP?", type: "single", options: [{ id: "A", text: "192.168.1.1" }, { id: "B", text: "8.8.8.8" }, { id: "C", text: "185.220.101.45" }, { id: "D", text: "10.0.0.1" }], correctAnswer: "C", points: 6 },
    { id: "q4", question: "What is the BEST recovery strategy?", type: "single", options: [{ id: "A", text: "Pay the ransom" }, { id: "B", text: "Restore from backup" }, { id: "C", text: "Attempt manual decryption" }, { id: "D", text: "Rebuild system from scratch" }], correctAnswer: "B", points: 6 },
    { id: "q5", question: "Should the infected device remain on network?", type: "single", options: [{ id: "A", text: "Yes, to monitor activity" }, { id: "B", text: "No, isolate immediately" }, { id: "C", text: "Only disconnect from internet" }, { id: "D", text: "Restart device first" }], correctAnswer: "B", points: 6 }
  ],
  exfiltration: [
    { id: "q1", question: "Database accessed?", type: "single", options: [{ id: "A", text: "HR_EMPLOYEES" }, { id: "B", text: "APEX_CLIENTS" }, { id: "C", text: "FINANCIAL_RECORDS" }, { id: "D", text: "SYSTEM_LOGS" }], correctAnswer: "B", points: 5 },
    { id: "q2", question: "Amount exfiltrated?", type: "single", options: [{ id: "A", text: "Less than 1 GB" }, { id: "B", text: "1-2 GB" }, { id: "C", text: "4.2 GB" }, { id: "D", text: "More than 5 GB" }], correctAnswer: "C", points: 5 },
    { id: "q3", question: "Transfer destination?", type: "single", options: [{ id: "A", text: "Internal file share" }, { id: "B", text: "Cloud storage" }, { id: "C", text: "External IP (203.45.67.89)" }, { id: "D", text: "USB device" }], correctAnswer: "C", points: 5 },
    { id: "q4", question: "Should employee be notified immediately?", type: "single", options: [{ id: "A", text: "Yes, call immediately" }, { id: "B", text: "No, preserve evidence first" }, { id: "C", text: "Yes, via email" }, { id: "D", text: "Wait 24 hours" }], correctAnswer: "B", points: 5 },
    { id: "q5", question: "Law enforcement contact?", type: "single", options: [{ id: "A", text: "Yes, immediately" }, { id: "B", text: "Yes, after legal review" }, { id: "C", text: "No, internal matter" }, { id: "D", text: "Only if data appears online" }], correctAnswer: "B", points: 5 }
  ]
};

function Section({ title, children }) {
  return (
    <section className="card" style={{ marginTop: '1.5rem' }}>
      <h2 style={{ marginBottom: 0 }}>{title}</h2>
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </section>
  );
}

function Badge({ children, color }) {
  const colors = {
    info: { bg: 'rgba(10, 132, 255, 0.2)', fg: 'var(--accent-info)' },
    critical: { bg: 'rgba(255, 59, 48, 0.2)', fg: 'var(--accent-critical)' },
    high: { bg: 'rgba(255, 149, 0, 0.2)', fg: 'var(--accent-warning)' },
    success: { bg: 'rgba(52, 199, 89, 0.2)', fg: 'var(--accent-success)' }
  };
  const c = colors[color] || colors.info;
  return <span style={{ background: c.bg, color: c.fg, padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>{children}</span>;
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '1rem 0' }} />;
}

function EmailViewer({ email, analysis }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div className="card">
        <h3>Suspicious Email</h3>
        <div style={{ fontFamily: 'var(--font-code)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div><strong>From:</strong> {email.from}</div>
          <div><strong>To:</strong> {email.to}</div>
          <div><strong>Subject:</strong> {email.subject}</div>
          <div><strong>Date:</strong> {email.date}</div>
        </div>
        <Divider />
        <p>{email.body}</p>
      </div>
      <div className="card">
        <h3>Technical Analysis</h3>
        <div><Badge color="critical">SPF: {analysis.authentication.spf}</Badge> <Badge color="critical">DKIM: {analysis.authentication.dkim}</Badge> <Badge color="critical">DMARC: {analysis.authentication.dmarc}</Badge></div>
        <div style={{ marginTop: '0.5rem' }}><Badge>Domain: {analysis.domain.suspicious}</Badge> <Badge>Legit: {analysis.domain.legitimate}</Badge></div>
        <div style={{ marginTop: '0.5rem' }}><Badge color="critical">No HTTPS</Badge> <Badge color="high">Flagged: {analysis.url.flagged}</Badge></div>
        <div style={{ marginTop: '0.5rem' }}>Sent: {analysis.impact.sent} | Opened: {analysis.impact.opened} | <Badge color="high">Clicked: {analysis.impact.clicked}</Badge></div>
      </div>
    </div>
  );
}

function ProcessTree({ endpoint, processTimeline, malware, network, filesystem, backup }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div className="card">
        <h3>Infected Endpoint</h3>
        <div><Badge>Device: {endpoint.device}</Badge> <Badge>User: {endpoint.user}</Badge> <Badge color="critical">{endpoint.status}</Badge></div>
      </div>
      <div className="card">
        <h3>Process Timeline</h3>
        <ol style={{ paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {processTimeline.map((p, i) => <li key={i}><strong>{p.time}</strong> — {p.name} {p.note && `(${p.note})`}</li>)}
        </ol>
      </div>
      <div className="card">
        <h3>Malware</h3>
        <div><strong>Classification:</strong> {malware.classification}</div>
        <div><strong>VirusTotal:</strong> {malware.vt}</div>
        <ul style={{ marginTop: '0.5rem' }}>{malware.behaviors.map((b, i) => <li key={i}>{b}</li>)}</ul>
      </div>
      <div className="card">
        <h3>Network Activity</h3>
        <ul>{network.map((n, i) => <li key={i}><Badge color={n.label === 'MALICIOUS' ? 'critical' : 'info'}>{n.label}</Badge> — {n.remote}</li>)}</ul>
      </div>
      <div className="card">
        <h3>File System Damage</h3>
        <div>Encrypted: {filesystem.encryptedCount} files (.docx: {filesystem.breakdown.docx} | .xlsx: {filesystem.breakdown.xlsx} | .pdf: {filesystem.breakdown.pdf})</div>
        <ul style={{ marginTop: '0.5rem' }}>{filesystem.critical.map((f, i) => <li key={i}>⚠️ {f}</li>)}</ul>
      </div>
      <div className="card">
        <h3>Backup Status</h3>
        <div><strong>Last:</strong> {backup.lastBackup}</div>
        <div><strong>Integrity:</strong> <Badge color="success">{backup.integrity}</Badge></div>
        <div><strong>Recovery:</strong> {backup.recoveryTime}</div>
      </div>
    </div>
  );
}

function Timeline({ employee, baseline, anomaly, timeline, destination, dataCompromised }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div className="card">
        <h3>Employee Profile</h3>
        <div><strong>{employee.name}</strong> — {employee.position}</div>
        <div>ID: {employee.employeeId} | Clearance: {employee.clearance}</div>
      </div>
      <div className="card">
        <h3>Baseline Behavior</h3>
        <div>Hours: {baseline.workHours} | Location: {baseline.location}</div>
      </div>
      <div className="card">
        <h3>Anomalous Activity</h3>
        <div><Badge color="high">Login: {anomaly.loginTime}</Badge> <Badge color="high">Location: {anomaly.location}</Badge> <Badge color="high">Volume: {anomaly.dataVolume}</Badge></div>
      </div>
      <div className="card">
        <h3>Event Timeline</h3>
        <ol style={{ paddingLeft: '1rem', fontSize: '0.9rem' }}>
          {timeline.map((t, i) => <li key={i}><strong>{t.time}</strong> — {t.event}</li>)}
        </ol>
      </div>
      <div className="card">
        <h3>Destination IP</h3>
        <div><strong>IP:</strong> {destination.ip} | <strong>Location:</strong> {destination.location}</div>
        <div><Badge color="high">Reputation: {destination.reputation}</Badge></div>
      </div>
      <div className="card">
        <h3>Data Compromised</h3>
        <div><strong>Database:</strong> {dataCompromised.database} | <strong>Records:</strong> {dataCompromised.records}</div>
        <div><strong>Dark Web Value:</strong> {dataCompromised.darkWebValue}</div>
        <ul style={{ marginTop: '0.5rem' }}>{dataCompromised.regulatory.map((r, i) => <li key={i}>⚠️ {r}</li>)}</ul>
      </div>
    </div>
  );
}

function ActionChecklist({ actions, selected, onToggle }) {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {actions.map((a) => (
        <label key={a.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={selected.includes(a.id)} onChange={() => onToggle(a.id)} />
          <span style={{ flex: 1 }}>{a.text}</span>
          <Badge color={a.impact === 'critical' ? 'critical' : a.impact === 'high' ? 'high' : 'info'}>{a.impact}</Badge>
        </label>
      ))}
    </div>
  );
}

function QuestionForm({ questions, answers, onChange }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {questions.map((q, idx) => (
        <div key={q.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ marginBottom: 0 }}>Q{idx + 1}. {q.question}</h3>
            <span className="text-secondary">{q.points} pts</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.5rem' }}>
            {q.type === 'single' && q.options.map((opt) => (
              <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name={q.id} value={opt.id} checked={answers[q.id] === opt.id} onChange={() => onChange(q.id, opt.id)} />
                <span>{opt.text}</span>
              </label>
            ))}
            {q.type === 'multiple' && q.options.map((opt) => {
              const selected = Array.isArray(answers[q.id]) ? answers[q.id] : [];
              const isChecked = selected.includes(opt.id);
              return (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isChecked} onChange={() => { const next = isChecked ? selected.filter((x) => x !== opt.id) : [...selected, opt.id]; onChange(q.id, next); }} />
                  <span>{opt.text}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreDisplay({ open, result, timeSpent, onBackToDashboard }) {
  if (!open) return null;
  const { score, passed, breakdown } = result || {};
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="card" style={{ width: 'min(640px, 92vw)' }}>
        <h2 style={{ textAlign: 'center' }}>Scenario Complete</h2>
        <Divider />
        <div style={{ display: 'grid', gap: '0.5rem', fontFamily: 'var(--font-code)', fontSize: '0.9rem' }}>
          <div>Investigation: {breakdown?.investigation ?? 0} pts</div>
          <div>Response: {breakdown?.response ?? 0} pts {breakdown?.penalties ? `(−${breakdown.penalties} penalty)` : ''}</div>
          {breakdown?.recovery ? <div>Recovery: {breakdown.recovery} pts</div> : null}
          <div>Documentation: {breakdown?.documentation ?? 0} pts</div>
        </div>
        <Divider />
        <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>SCORE: {score}/100 {passed ? '✓ PASSED' : '✗ FAILED'}</div>
          <div className="text-secondary">Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')} minutes</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onBackToDashboard}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [scenario, setScenario] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [phase, setPhase] = useState('investigation');
  const [timeSpent, setTimeSpent] = useState(0);
  const [selectedActions, setSelectedActions] = useState([]);
  const [recoveryChoice, setRecoveryChoice] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [openScore, setOpenScore] = useState(false);

  useEffect(() => {
    if (id) {
      const s = SCENARIOS_DATA.scenarios.find((s) => s.id === id);
      setScenario(s);
      setQuestions(QUESTIONS_DATA[id] || []);
    }
  }, [id]);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!scenario) {
    return (
      <ProtectedRoute>
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
          <Navbar />
          <main className="container">
            <div className="card" style={{ marginTop: '2rem' }}>
              <h1>Loading...</h1>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id, responses: { actions: selectedActions, recovery: recoveryChoice, answers } })
      });
      const data = await res.json();
      setResult(data);
      setOpenScore(true);

      const progressRaw = localStorage.getItem('progress');
      const progress = progressRaw ? JSON.parse(progressRaw) : {};
      progress[scenario.id] = { status: 'completed', score: data.score, timeSpent, completedAt: new Date().toISOString() };
      localStorage.setItem('progress', JSON.stringify(progress));

      const values = Object.values(progress);
      let completed = 0, totalScore = 0, totalTime = 0;
      values.forEach((s) => { if (s.status === 'completed') { completed++; totalScore += s.score || 0; totalTime += s.timeSpent || 0; } });
      localStorage.setItem('stats', JSON.stringify({ totalCompleted: completed, averageScore: completed ? Math.round(totalScore / completed) : 0, averageTime: completed ? Math.round(totalTime / completed) : 0 }));
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="container">
          <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{scenario.id === 'phishing' ? '📧' : scenario.id === 'ransomware' ? '🔒' : '🕵️'}</div>
                <div>
                  <h1 style={{ marginBottom: 0 }}>{scenario.title}</h1>
                  <p style={{ marginTop: '0.5rem', marginBottom: 0 }} className="text-secondary">
                    <span className="severity-badge severity-critical" style={{ marginRight: '0.75rem' }}>{scenario.severity}</span>
                    ⏱️ {scenario.duration}
                  </p>
                </div>
              </div>
              <div className="text-secondary" style={{ fontFamily: 'var(--font-code)' }}>Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['investigation', 'response', 'documentation'].map((p) => (
              <button key={p} className={phase === p ? 'btn-primary' : 'btn-secondary'} onClick={() => setPhase(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {phase === 'investigation' && (
            <>
              <Section title="Incident Briefing">
                <p className="text-secondary" style={{ marginBottom: '0.5rem' }}>
                  Incident ID: <strong>{scenario.briefing.incidentId}</strong> — {scenario.briefing.timestamp}
                </p>
                <p>{scenario.briefing.situation}</p>
                <ul className="text-secondary" style={{ marginTop: '0.5rem' }}>
                  {scenario.briefing.mission.map((m) => <li key={m}>{m}</li>)}
                </ul>
              </Section>

              {scenario.id === 'phishing' && <Section title="Evidence"><EmailViewer email={scenario.evidence.email} analysis={scenario.evidence.analysis} /></Section>}
              {scenario.id === 'ransomware' && <Section title="Evidence"><ProcessTree endpoint={scenario.evidence.endpoint} processTimeline={scenario.evidence.processTimeline} malware={scenario.evidence.malware} network={scenario.evidence.network} filesystem={scenario.evidence.filesystem} backup={scenario.evidence.backup} /></Section>}
              {scenario.id === 'exfiltration' && <Section title="Evidence"><Timeline employee={scenario.evidence.employee} baseline={scenario.evidence.baseline} anomaly={scenario.evidence.anomaly} timeline={scenario.evidence.timeline} destination={scenario.evidence.destination} dataCompromised={scenario.evidence.dataCompromised} /></Section>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => setPhase('response')}>Begin Response →</button>
              </div>
            </>
          )}

          {phase === 'response' && (
            <>
              <Section title="Response Actions">
                <ActionChecklist actions={scenario.actions} selected={selectedActions} onToggle={(id) => setSelectedActions((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])} />
              </Section>

              {scenario.id === 'ransomware' && (
                <Section title="Recovery Decision">
                  <div className="card" style={{ display: 'grid', gap: '0.5rem' }}>
                    {scenario.recoveryOptions.map((opt) => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="radio" name="recovery" value={opt.id} checked={recoveryChoice === opt.id} onChange={() => setRecoveryChoice(opt.id)} />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </Section>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => setPhase('investigation')}>← Back</button>
                <button className="btn-primary" onClick={() => setPhase('documentation')}>Continue →</button>
              </div>
            </>
          )}

          {phase === 'documentation' && (
            <>
              <Section title="Documentation - Multiple Choice Questions">
                <QuestionForm questions={questions} answers={answers} onChange={(qid, value) => setAnswers((prev) => ({ ...prev, [qid]: value }))} />
              </Section>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => setPhase('response')}>← Back</button>
                <button className="btn-primary" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </>
          )}
        </main>

        <ScoreDisplay open={openScore} result={result} timeSpent={timeSpent} onBackToDashboard={() => { setOpenScore(false); router.push('/dashboard'); }} />
      </div>
    </ProtectedRoute>
  );
}

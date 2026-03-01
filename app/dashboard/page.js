'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/styles/dashboard.css';

const scenarios = [
  {
    id: 'phishing',
    title: 'Phishing Attack Campaign',
    icon: '📧',
    severity: 'critical',
    duration: '5 minutes',
    description: 'Multiple employees received suspicious emails claiming to be from IT Support. Investigate the phishing campaign and respond appropriately.',
  },
  {
    id: 'ransomware',
    title: 'Ransomware Infection',
    icon: '🔒',
    severity: 'critical',
    duration: '6 minutes',
    description: 'A Finance analyst opened a malicious attachment. Ransomware is actively encrypting files. Contain the threat and plan recovery.',
  },
  {
    id: 'exfiltration',
    title: 'Data Exfiltration',
    icon: '🕵️',
    severity: 'critical',
    duration: '7 minutes',
    description: 'Suspicious data transfer detected from a senior engineer outside work hours. Investigate potential insider threat and data breach.',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    averageTime: 0,
    activeIncidents: 3,
  });

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('progress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      setProgress(progressData);

      // Calculate stats
      let completed = 0;
      let totalScore = 0;
      let totalTime = 0;

      Object.values(progressData).forEach((scenario) => {
        if (scenario.status === 'completed') {
          completed++;
          totalScore += scenario.score || 0;
          totalTime += scenario.timeSpent || 0;
        }
      });

      setStats({
        totalCompleted: completed,
        averageScore: completed > 0 ? Math.round(totalScore / completed) : 0,
        averageTime: completed > 0 ? Math.round(totalTime / completed) : 0,
        activeIncidents: 3 - completed,
      });
    }
  }, []);

  const handleStartScenario = (scenarioId) => {
    router.push(`/scenario/${scenarioId}`);
  };

  const getScenarioStatus = (scenarioId) => {
    if (!progress) return 'not_started';
    return progress[scenarioId]?.status || 'not_started';
  };

  const getScenarioScore = (scenarioId) => {
    if (!progress) return null;
    return progress[scenarioId]?.score || null;
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        <Navbar />

        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">SOC Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back, Analyst. Review and respond to active incidents.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Active Incidents</p>
              <p className="stat-value">{stats.activeIncidents}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{stats.totalCompleted}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg Time</p>
              <p className="stat-value">{formatTime(stats.averageTime)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg Score</p>
              <p className="stat-value">{stats.averageScore}%</p>
            </div>
          </div>

          {/* Scenarios Section */}
          <div className="scenarios-section">
            <h2 className="section-title">Active Incidents</h2>

            <div className="scenarios-grid">
              {scenarios.map((scenario) => {
                const status = getScenarioStatus(scenario.id);
                const score = getScenarioScore(scenario.id);

                return (
                  <div key={scenario.id} className="scenario-card">
                    <div className="scenario-header">
                      <div className="scenario-icon">{scenario.icon}</div>
                      <h3 className="scenario-title">{scenario.title}</h3>
                      <div className="scenario-meta">
                        <span className={`severity-badge severity-${scenario.severity}`}>
                          {scenario.severity}
                        </span>
                        <span>⏱️ {scenario.duration}</span>
                      </div>
                    </div>

                    <div className="scenario-body">
                      <p className="scenario-description">{scenario.description}</p>

                      <div className="scenario-footer">
                        <div className="scenario-status">
                          <span
                            className={`status-badge status-${status}`}
                          >
                            {status === 'not_started' && 'Not Started'}
                            {status === 'in_progress' && 'In Progress'}
                            {status === 'completed' && 'Completed'}
                          </span>
                          {score !== null && (
                            <span className="scenario-score">{score}%</span>
                          )}
                        </div>
                        <button
                          className="btn-start"
                          onClick={() => handleStartScenario(scenario.id)}
                        >
                          {status === 'completed' ? 'Retry' : 'Start'} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

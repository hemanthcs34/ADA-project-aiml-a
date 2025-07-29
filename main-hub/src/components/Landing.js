import React from 'react';
import './Landing.css';
import { FaChartLine, FaCalendarAlt, FaFileAlt, FaUserCheck, FaQuestionCircle } from 'react-icons/fa';

const toolConfig = {
  analyzer: {
    url: 'http://localhost:3001',
    title: 'Algorithm Analyzer',
    description: 'Visualize and analyze the complexity of various algorithms in real-time.',
    icon: <FaChartLine />,
    color: '#ff6b6b'
  },
  planner: {
    url: 'planner/index.html',
    title: 'Daily Planner',
    description: 'Organize your tasks, set priorities, and boost your daily productivity.',
    icon: <FaCalendarAlt />,
    color: '#4d96ff'
  },
  resume: {
    url: 'http://localhost:5000',
    title: 'Resume Optimizer',
    description: 'Enhance your resume to pass ATS scans and catch recruiters\' attention.',
    icon: <FaFileAlt />,
    color: '#54e346'
  },
  qaPlatform: {
    url: 'http://localhost:5173',
    title: 'Student Q&A Platform',
    description: 'A full-stack Q&A platform with advanced sorting and search algorithms.',
    icon: <FaQuestionCircle />,
    color: '#8e44ad'
  },
  attendance: {
    url: 'attendance-tracker.html',
    title: 'Attendance Tracker',
    description: 'A simple and efficient way to monitor and manage attendance records.',
    icon: <FaUserCheck />,
    color: '#feca57'
  }
};

const ToolCard = ({ config }) => (
  <a href={config.url} className="tool-card-link" target="_blank" rel="noopener noreferrer">
    <div className="tool-card">
      <div className="tool-card-icon" style={{ '--icon-color': config.color }}>
        {config.icon}
      </div>
      <div className="tool-card-content">
        <h3>{config.title}</h3>
        <p>{config.description}</p>
      </div>
      <div className="tool-card-shine"></div>
    </div>
  </a>
);

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1>AIML-A SECTION 27 BATCH</h1>
        <p>Five powerful, independent tools, accessible from one central hub. Select a tool to get started.</p>
      </div>
      <div className="tool-cards-grid">
        {Object.entries(toolConfig).map(([key, tool]) => (
          <ToolCard key={key} config={tool} />
        ))}
      </div>
      <footer className="landing-footer">
        <p>Project by ADA Group AIML-A</p>
      </footer>
    </div>
  );
};

export default Landing;

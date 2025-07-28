import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { FaChartLine, FaCalendarAlt, FaFileAlt, FaUserCheck } from 'react-icons/fa';

const tools = [
  {
    path: '/analyzer',
    icon: <FaChartLine />,
    title: 'Algorithm Analyzer',
    description: 'Visualize and analyze the complexity of various algorithms in real-time.',
    color: '#ff6b6b'
  },
  {
    path: '/planner',
    icon: <FaCalendarAlt />,
    title: 'Daily Planner',
    description: 'Organize your tasks, set priorities, and boost your daily productivity.',
    color: '#4d96ff'
  },
  {
    path: '/resume',
    icon: <FaFileAlt />,
    title: 'Resume Optimizer',
    description: 'Enhance your resume to pass ATS scans and catch recruiters\' attention.',
    color: '#54e346'
  },
  {
    path: '/attendance',
    icon: <FaUserCheck />,
    title: 'Attendance Tracker',
    description: 'A simple and efficient way to monitor and manage attendance records.',
    color: '#feca57'
  }
];

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1>Welcome to Your Integrated Tool Suite</h1>
        <p>Four powerful tools, one seamless experience. Select a tool to get started.</p>
      </div>
      <div className="tool-cards-grid">
        {tools.map((tool, index) => (
          <Link to={tool.path} key={index} className="tool-card-link">
            <div className="tool-card">
              <div className="tool-card-icon" style={{'--icon-color': tool.color}}>
                {tool.icon}
              </div>
              <div className="tool-card-content">
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
              <div className="tool-card-shine"></div>
            </div>
          </Link>
        ))}
      </div>
      <footer className="landing-footer">
        <p>Project by ADA Group AIML-A</p>
      </footer>
    </div>
  );
};

export default Landing;


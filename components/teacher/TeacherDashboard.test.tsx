// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TeacherDashboard from './TeacherDashboard';

// Mock child components to prevent render errors
vi.mock('./CreateAssignmentScreen', () => ({
  default: () => <div data-testid="create-assignment">Create Assignment</div>
}));

vi.mock('./CreateActivityScreen', () => ({
  default: () => <div data-testid="create-activity">Create Activity</div>
}));

vi.mock('../MessagingSystem', () => ({
  default: () => <div data-testid="messaging-system">Messaging System</div>
}));

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (k: string) => k })
}));

vi.mock('../../services/api', () => ({
  default: {
    getTeacherQuizzes: vi.fn().mockResolvedValue([]),
    getTeacherActivities: vi.fn().mockResolvedValue([]),
  }
}));

// Mock motion to avoid issues with animations in jsdom
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => <div className={className} onClick={onClick} {...props}>{children}</div>
  }
}));

describe('TeacherDashboard', () => {
  it('renders the overview correctly', () => {
    const mockUser = {
      _id: '1',
      name: 'Teacher Test',
      email: 'teacher@test.com',
      role: 'teacher',
      points: 0,
      level: 1,
      completedLessons: [],
      createdAt: new Date().toISOString()
    };

    render(<TeacherDashboard currentUser={mockUser as any} onLogout={vi.fn()} />);
    
    // Check if the dashboard title or stats are present
    expect(screen.getAllByText('Active Classes')[0]).toBeDefined();
    expect(screen.getAllByText('Total Students')[0]).toBeDefined();
  });
});

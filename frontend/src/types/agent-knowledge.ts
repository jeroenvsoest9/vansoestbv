export interface AgentKnowledge {
  id: string;
  agentId: string;
  type: 'experience' | 'lesson' | 'best_practice' | 'improvement';
  category: string;
  title: string;
  description: string;
  context: Record<string, any>;
  impact: number;
  confidence: number;
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  sharedWith: string[];
  tags: string[];
}

export interface LearningSession {
  id: string;
  title: string;
  description: string;
  organizer: string; // agentId
  participants: string[]; // agentIds
  topics: string[];
  date: Date;
  duration: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  materials: {
    type: string;
    url: string;
    description: string;
  }[];
  outcomes: {
    agentId: string;
    learnings: string[];
    improvements: string[];
    nextSteps: string[];
  }[];
  feedback: {
    agentId: string;
    rating: number;
    comments: string;
  }[];
}

export interface AgentCollaboration {
  id: string;
  agents: string[]; // agentIds
  type: 'meeting' | 'workshop' | 'review' | 'brainstorming';
  purpose: string;
  date: Date;
  duration: number;
  status: 'planned' | 'in_progress' | 'completed';
  agenda: {
    topic: string;
    duration: number;
    responsible: string; // agentId
  }[];
  outcomes: {
    decisions: string[];
    actionItems: {
      description: string;
      responsible: string; // agentId
      deadline: Date;
      status: 'pending' | 'in_progress' | 'completed';
    }[];
    learnings: string[];
  };
}

export interface PerformanceReview {
  id: string;
  agentId: string;
  reviewerId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    tasksCompleted: number;
    successRate: number;
    responseTime: number;
    knowledgeShared: number;
    collaborationScore: number;
  };
  strengths: string[];
  improvements: string[];
  goals: {
    description: string;
    deadline: Date;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  feedback: string;
  rating: number;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  createdBy: string; // agentId
  contributors: string[]; // agentIds
  lastUpdated: Date;
  version: number;
  tags: string[];
  relatedKnowledge: string[]; // knowledgeIds
  usage: {
    views: number;
    shares: number;
    applications: number;
  };
}

export interface AgentLearningModel {
  agentId: string;
  knowledgeBase: KnowledgeBase[];
  experiences: AgentKnowledge[];
  learningSessions: LearningSession[];
  collaborations: AgentCollaboration[];
  performanceReviews: PerformanceReview[];
  skills: {
    name: string;
    level: number;
    lastPracticed: Date;
    improvementAreas: string[];
  }[];
  learningGoals: {
    skill: string;
    targetLevel: number;
    deadline: Date;
    progress: number;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  mentoring: {
    mentorId: string;
    menteeId: string;
    focus: string[];
    sessions: {
      date: Date;
      topics: string[];
      outcomes: string[];
    }[];
  }[];
} 
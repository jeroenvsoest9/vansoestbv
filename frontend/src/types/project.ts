export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface Document {
  _id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Task {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
}

export interface TimelineEvent {
  _id: string;
  type: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Project {
  _id: string;
  name: string;
  code: string;
  description: string;
  type: 'construction' | 'renovation' | 'maintenance' | 'design' | 'consultation';
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  team: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
    role: string;
    startDate: string;
    endDate?: string;
  }>;
  client: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    company: string;
    contactPerson: string;
  };
  stakeholders: Array<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    role: string;
    influence: string;
  }>;
  budget: {
    planned: number;
    actual: number;
    currency: string;
  };
  costs: Array<{
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
  tasks: Array<{
    name: string;
    description: string;
    assignedTo: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    startDate: string;
    endDate: string;
    status: string;
    priority: string;
  }>;
  milestones: Array<{
    name: string;
    description: string;
    dueDate: string;
    completed: boolean;
  }>;
  resources: Array<{
    type: string;
    name: string;
    quantity: number;
    unit: string;
    cost: number;
  }>;
  documents: Array<{
    name: string;
    type: string;
    url: string;
    uploadedBy: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    uploadDate: string;
  }>;
  meetings: Array<{
    title: string;
    date: string;
    participants: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    }>;
    notes: string;
  }>;
  risks: Array<{
    description: string;
    impact: string;
    probability: string;
    mitigation: string;
    status: string;
  }>;
  issues: Array<{
    description: string;
    severity: string;
    status: string;
    resolution: string;
  }>;
  qualityChecks: Array<{
    name: string;
    status: string;
    date: string;
    notes: string;
  }>;
  permits: Array<{
    type: string;
    number: string;
    issueDate: string;
    expiryDate: string;
    status: string;
  }>;
  tags: string[];
  category?: string;
  customFields?: Record<string, any>;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  updatedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  client: string;
  type: 'new' | 'renovation' | 'maintenance';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate?: string;
  budget: number;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  email: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: string;
}

export interface TimelineEventFormData {
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'event' | 'note';
}

export interface Risk {
  _id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  status: 'open' | 'mitigated' | 'closed';
  mitigationPlan?: string;
}

export interface QualityCheck {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  date: string;
  inspector: string;
  notes?: string;
}

export interface Communication {
  _id: string;
  type: 'email' | 'meeting' | 'phone' | 'other';
  subject: string;
  content: string;
  date: string;
  participants: string[];
  status: 'sent' | 'received' | 'scheduled';
} 
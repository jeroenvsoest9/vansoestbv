export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: 'active' | 'inactive' | 'error';
  lastActive: Date;
  capabilities: string[];
  metrics: AgentMetrics;
}

export interface AgentMetrics {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  lastError?: string;
}

export type AgentType = 
  | 'project_manager'
  | 'financial_controller'
  | 'quality_assurance'
  | 'risk_manager'
  | 'team_coordinator'
  | 'document_manager'
  | 'communication_manager'
  | 'system_maintainer'
  | 'security_monitor'
  | 'performance_optimizer'
  | 'qaa_agent'
  | 'ict_manager'
  | 'offerte_manager'
  | 'calculatie_specialist'
  | 'social_media_manager'
  | 'content_creator'
  | 'maintenance_coordinator'
  | 'safety_officer'
  | 'environmental_manager'
  | 'procurement_specialist';

export interface AgentAction {
  id: string;
  agentId: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  description: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentSystem {
  agents: Agent[];
  actions: AgentAction[];
  status: 'healthy' | 'degraded' | 'critical';
  lastHealthCheck: Date;
  metrics: SystemMetrics;
}

export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalActions: number;
  completedActions: number;
  failedActions: number;
  averageResponseTime: number;
  systemUptime: number;
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  capabilities: string[];
  checkInterval: number;
  maxRetries: number;
  timeout: number;
  dependencies: AgentType[];
  platforms?: Record<string, PlatformConfig>;
  contentTypes?: Record<string, ContentTypeConfig>;
}

export interface PlatformConfig {
  enabled: boolean;
  features: string[];
}

export interface ContentTypeConfig {
  posts: boolean;
  stories: boolean;
  reels: boolean;
  carousels: boolean;
  ads: boolean;
  events: boolean;
  pages: boolean;
}

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  project_manager: {
    type: 'project_manager',
    name: 'Project Manager Agent',
    capabilities: [
      'project_analysis',
      'timeline_management',
      'resource_allocation',
      'budget_monitoring',
      'risk_assessment'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: []
  },
  financial_controller: {
    type: 'financial_controller',
    name: 'Financial Controller Agent',
    capabilities: [
      'budget_tracking',
      'cost_analysis',
      'invoice_management',
      'financial_reporting',
      'payment_monitoring'
    ],
    checkInterval: 600000, // 10 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['project_manager']
  },
  quality_assurance: {
    type: 'quality_assurance',
    name: 'Quality Assurance Agent',
    capabilities: [
      'quality_checks',
      'compliance_monitoring',
      'standards_verification',
      'defect_tracking',
      'improvement_suggestions'
    ],
    checkInterval: 900000, // 15 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['project_manager']
  },
  risk_manager: {
    type: 'risk_manager',
    name: 'Risk Manager Agent',
    capabilities: [
      'risk_assessment',
      'threat_detection',
      'mitigation_planning',
      'risk_monitoring',
      'incident_response'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['project_manager']
  },
  team_coordinator: {
    type: 'team_coordinator',
    name: 'Team Coordinator Agent',
    capabilities: [
      'team_management',
      'resource_allocation',
      'skill_matching',
      'performance_monitoring',
      'conflict_resolution'
    ],
    checkInterval: 600000, // 10 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['project_manager']
  },
  document_manager: {
    type: 'document_manager',
    name: 'Document Manager Agent',
    capabilities: [
      'document_organization',
      'version_control',
      'access_management',
      'backup_management',
      'compliance_checking'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: []
  },
  communication_manager: {
    type: 'communication_manager',
    name: 'Communication Manager Agent',
    capabilities: [
      'message_routing',
      'notification_management',
      'stakeholder_communication',
      'meeting_coordination',
      'report_generation'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: []
  },
  system_maintainer: {
    type: 'system_maintainer',
    name: 'System Maintainer Agent',
    capabilities: [
      'system_health_monitoring',
      'performance_optimization',
      'bug_detection',
      'update_management',
      'backup_verification'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: []
  },
  security_monitor: {
    type: 'security_monitor',
    name: 'Security Monitor Agent',
    capabilities: [
      'security_scanning',
      'vulnerability_detection',
      'access_control',
      'threat_prevention',
      'incident_response'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: []
  },
  performance_optimizer: {
    type: 'performance_optimizer',
    name: 'Performance Optimizer Agent',
    capabilities: [
      'performance_monitoring',
      'resource_optimization',
      'bottleneck_detection',
      'efficiency_improvement',
      'scaling_management'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: []
  },
  qaa_agent: {
    type: 'qaa_agent',
    name: 'QAA Agent',
    capabilities: [
      'quality_assurance',
      'audit_management',
      'compliance_checking',
      'process_improvement',
      'standards_verification',
      'documentation_review',
      'training_coordination'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['project_manager', 'quality_assurance']
  },
  ict_manager: {
    type: 'ict_manager',
    name: 'ICT Manager Agent',
    capabilities: [
      'infrastructure_management',
      'system_integration',
      'network_monitoring',
      'software_deployment',
      'data_management',
      'security_implementation',
      'technical_support'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['system_maintainer', 'security_monitor']
  },
  offerte_manager: {
    type: 'offerte_manager',
    name: 'Offerte Manager Agent',
    capabilities: [
      'quote_generation',
      'pricing_analysis',
      'market_research',
      'client_communication',
      'proposal_management',
      'contract_review',
      'negotiation_support'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['financial_controller', 'project_manager']
  },
  calculatie_specialist: {
    type: 'calculatie_specialist',
    name: 'Calculatie Specialist Agent',
    capabilities: [
      'cost_calculation',
      'material_planning',
      'labor_estimation',
      'budget_analysis',
      'price_optimization',
      'margin_calculation',
      'tender_preparation'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['financial_controller', 'offerte_manager']
  },
  social_media_manager: {
    type: 'social_media_manager',
    name: 'Social Media Manager Agent',
    capabilities: [
      'social_media_management',
      'content_scheduling',
      'engagement_analysis',
      'platform_integration',
      'hashtag_optimization',
      'audience_insights'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['content_creator'],
    platforms: {
      instagram: {
        enabled: true,
        features: [
          'post_creation',
          'story_management',
          'reels_creation',
          'hashtag_analysis',
          'engagement_tracking',
          'audience_insights'
        ]
      },
      facebook: {
        enabled: true,
        features: [
          'post_creation',
          'page_management',
          'ad_creation',
          'analytics',
          'audience_targeting',
          'engagement_tracking'
        ]
      }
    }
  },
  content_creator: {
    type: 'content_creator',
    name: 'Content Creator Agent',
    capabilities: [
      'content_generation',
      'image_creation',
      'video_editing',
      'copywriting',
      'seo_optimization',
      'social_media_integration'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['social_media_manager'],
    contentTypes: {
      instagram: {
        posts: true,
        stories: true,
        reels: true,
        carousels: true
      },
      facebook: {
        posts: true,
        ads: true,
        events: true,
        pages: true
      }
    }
  },
  maintenance_coordinator: {
    type: 'maintenance_coordinator',
    name: 'Maintenance Coordinator Agent',
    capabilities: [
      'maintenance_scheduling',
      'preventive_maintenance',
      'resource_allocation',
      'inventory_management',
      'service_tracking',
      'maintenance_reporting',
      'emergency_response'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['project_manager', 'team_coordinator']
  },
  safety_officer: {
    type: 'safety_officer',
    name: 'Safety Officer Agent',
    capabilities: [
      'safety_compliance',
      'risk_assessment',
      'incident_prevention',
      'safety_training',
      'emergency_planning',
      'inspection_management',
      'safety_reporting'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['risk_manager', 'quality_assurance']
  },
  environmental_manager: {
    type: 'environmental_manager',
    name: 'Environmental Manager Agent',
    capabilities: [
      'environmental_compliance',
      'sustainability_planning',
      'waste_management',
      'emissions_monitoring',
      'green_initiatives',
      'environmental_reporting',
      'resource_conservation'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['safety_officer', 'quality_assurance']
  },
  procurement_specialist: {
    type: 'procurement_specialist',
    name: 'Procurement Specialist Agent',
    capabilities: [
      'vendor_management',
      'purchase_planning',
      'inventory_control',
      'supplier_relations',
      'contract_management',
      'cost_optimization',
      'procurement_automation'
    ],
    checkInterval: 300000, // 5 minutes
    maxRetries: 3,
    timeout: 30000,
    dependencies: ['financial_controller', 'calculatie_specialist']
  }
}; 
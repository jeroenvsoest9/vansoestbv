import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAIAgents } from '../hooks/useAIAgents';
import type {
  UIUXData,
  ContentData,
  BehaviorData,
  TestData,
  PerformanceData,
  AccessibilityData
} from '../services/ai-agents.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const AIAgentPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [uiData, setUiData] = useState<UIUXData>({
    layout: '',
    components: [],
    userFlow: '',
    mobileResponsiveness: false,
    accessibilityScore: 0
  });
  const [contentData, setContentData] = useState<ContentData>({
    type: 'blog',
    topic: '',
    audience: '',
    tone: 'professional',
    keywords: []
  });
  const [behaviorData, setBehaviorData] = useState<BehaviorData>({
    pageViews: 0,
    timeOnPage: 0,
    conversionRate: 0,
    bounceRate: 0,
    userJourney: []
  });
  const [testData, setTestData] = useState<TestData>({
    metrics: {
      conversion: 0,
      engagement: 0,
      retention: 0
    },
    goals: [],
    targetAreas: []
  });
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    loadTime: 0,
    resourceSize: 0,
    apiCalls: 0,
    renderTime: 0
  });
  const [accessibilityData, setAccessibilityData] = useState<AccessibilityData>({
    wcagLevel: 'AA',
    screenReaderCompatible: false,
    keyboardNavigation: false,
    colorContrast: 0
  });

  const {
    loading,
    error,
    lastResult,
    optimizeUIUX,
    generateContent,
    analyzeUserBehavior,
    suggestABTests,
    optimizePerformance,
    checkAccessibility,
    clearError,
    clearResult
  } = useAIAgents();

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    clearError();
    clearResult();
  }, [clearError, clearResult]);

  const handleSubmit = useCallback(async () => {
    try {
      switch (activeTab) {
        case 0:
          await optimizeUIUX(uiData);
          break;
        case 1:
          await generateContent(contentData);
          break;
        case 2:
          await analyzeUserBehavior(behaviorData);
          break;
        case 3:
          await suggestABTests(testData);
          break;
        case 4:
          await optimizePerformance(performanceData);
          break;
        case 5:
          await checkAccessibility(accessibilityData);
          break;
      }
    } catch (error) {
      console.error('Failed to execute AI agent:', error);
    }
  }, [
    activeTab,
    uiData,
    contentData,
    behaviorData,
    testData,
    performanceData,
    accessibilityData,
    optimizeUIUX,
    generateContent,
    analyzeUserBehavior,
    suggestABTests,
    optimizePerformance,
    checkAccessibility
  ]);

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="UI/UX Optimization" />
          <Tab label="Content Generation" />
          <Tab label="Behavior Analysis" />
          <Tab label="A/B Testing" />
          <Tab label="Performance" />
          <Tab label="Accessibility" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ m: 2 }}>
          {error.message}
        </Alert>
      )}

      {lastResult && (
        <Alert severity="success" onClose={clearResult} sx={{ m: 2 }}>
          {lastResult}
        </Alert>
      )}

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Layout"
              value={uiData.layout}
              onChange={(e) => setUiData({ ...uiData, layout: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Components"
              value={uiData.components.join(',')}
              onChange={(e) => setUiData({ ...uiData, components: e.target.value.split(',') })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="User Flow"
              value={uiData.userFlow}
              onChange={(e) => setUiData({ ...uiData, userFlow: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel>Mobile Responsive</InputLabel>
              <Select
                value={uiData.mobileResponsiveness}
                onChange={(e) => setUiData({ ...uiData, mobileResponsiveness: e.target.value as boolean })}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Accessibility Score"
              value={uiData.accessibilityScore}
              onChange={(e) => setUiData({ ...uiData, accessibilityScore: Number(e.target.value) })}
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentData.type}
                onChange={(e) => setContentData({ ...contentData, type: e.target.value as ContentData['type'] })}
              >
                <MenuItem value="blog">Blog</MenuItem>
                <MenuItem value="product">Product</MenuItem>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="landing">Landing Page</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Topic"
              value={contentData.topic}
              onChange={(e) => setContentData({ ...contentData, topic: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Target Audience"
              value={contentData.audience}
              onChange={(e) => setContentData({ ...contentData, audience: e.target.value })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel>Tone</InputLabel>
              <Select
                value={contentData.tone}
                onChange={(e) => setContentData({ ...contentData, tone: e.target.value as ContentData['tone'] })}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="technical">Technical</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Keywords"
              value={contentData.keywords.join(',')}
              onChange={(e) => setContentData({ ...contentData, keywords: e.target.value.split(',') })}
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Page Views"
              value={behaviorData.pageViews}
              onChange={(e) => setBehaviorData({ ...behaviorData, pageViews: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Time on Page (seconds)"
              value={behaviorData.timeOnPage}
              onChange={(e) => setBehaviorData({ ...behaviorData, timeOnPage: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Conversion Rate (%)"
              value={behaviorData.conversionRate}
              onChange={(e) => setBehaviorData({ ...behaviorData, conversionRate: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Bounce Rate (%)"
              value={behaviorData.bounceRate}
              onChange={(e) => setBehaviorData({ ...behaviorData, bounceRate: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="User Journey"
              value={behaviorData.userJourney.join(' -> ')}
              onChange={(e) => setBehaviorData({ ...behaviorData, userJourney: e.target.value.split(' -> ') })}
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6">Current Metrics</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '33%' }}>
              <TextField
                fullWidth
                type="number"
                label="Conversion (%)"
                value={testData.metrics.conversion}
                onChange={(e) => setTestData({
                  ...testData,
                  metrics: { ...testData.metrics, conversion: Number(e.target.value) }
                })}
              />
            </Box>
            <Box sx={{ width: '33%' }}>
              <TextField
                fullWidth
                type="number"
                label="Engagement (%)"
                value={testData.metrics.engagement}
                onChange={(e) => setTestData({
                  ...testData,
                  metrics: { ...testData.metrics, engagement: Number(e.target.value) }
                })}
              />
            </Box>
            <Box sx={{ width: '33%' }}>
              <TextField
                fullWidth
                type="number"
                label="Retention (%)"
                value={testData.metrics.retention}
                onChange={(e) => setTestData({
                  ...testData,
                  metrics: { ...testData.metrics, retention: Number(e.target.value) }
                })}
              />
            </Box>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Goals"
              value={testData.goals.join(',')}
              onChange={(e) => setTestData({ ...testData, goals: e.target.value.split(',') })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Target Areas"
              value={testData.targetAreas.join(',')}
              onChange={(e) => setTestData({ ...testData, targetAreas: e.target.value.split(',') })}
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Load Time (ms)"
              value={performanceData.loadTime}
              onChange={(e) => setPerformanceData({ ...performanceData, loadTime: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Resource Size (MB)"
              value={performanceData.resourceSize}
              onChange={(e) => setPerformanceData({ ...performanceData, resourceSize: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="API Calls"
              value={performanceData.apiCalls}
              onChange={(e) => setPerformanceData({ ...performanceData, apiCalls: Number(e.target.value) })}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Render Time (ms)"
              value={performanceData.renderTime}
              onChange={(e) => setPerformanceData({ ...performanceData, renderTime: Number(e.target.value) })}
            />
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel>WCAG Level</InputLabel>
              <Select
                value={accessibilityData.wcagLevel}
                onChange={(e) => setAccessibilityData({
                  ...accessibilityData,
                  wcagLevel: e.target.value as AccessibilityData['wcagLevel']
                })}
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="AA">AA</MenuItem>
                <MenuItem value="AAA">AAA</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel>Screen Reader Compatible</InputLabel>
              <Select
                value={accessibilityData.screenReaderCompatible}
                onChange={(e) => setAccessibilityData({
                  ...accessibilityData,
                  screenReaderCompatible: e.target.value as boolean
                })}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <InputLabel>Keyboard Navigation</InputLabel>
              <Select
                value={accessibilityData.keyboardNavigation}
                onChange={(e) => setAccessibilityData({
                  ...accessibilityData,
                  keyboardNavigation: e.target.value as boolean
                })}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              type="number"
              label="Color Contrast Ratio"
              value={accessibilityData.colorContrast}
              onChange={(e) => setAccessibilityData({
                ...accessibilityData,
                colorContrast: Number(e.target.value)
              })}
            />
          </Box>
        </Box>
      </TabPanel>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : 'Run Analysis'}
        </Button>
      </Box>
    </Paper>
  );
}; 
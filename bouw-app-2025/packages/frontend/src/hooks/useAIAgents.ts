import { useState, useCallback } from "react";
import { frontendAIAgents } from "@services/ai-agents.service";
import type {
  UIUXData,
  ContentData,
  BehaviorData,
  TestData,
  PerformanceData,
  AccessibilityData,
} from "@services/ai-agents.service";

interface AIAgentError {
  message: string;
  code: string;
  timestamp: Date;
}

interface AIAgentState {
  loading: boolean;
  error: AIAgentError | null;
  lastResult: string | null;
}

export const useAIAgents = () => {
  const [state, setState] = useState<AIAgentState>({
    loading: false,
    error: null,
    lastResult: null,
  });

  const handleError = useCallback((error: Error, operation: string) => {
    const agentError: AIAgentError = {
      message: error.message,
      code: `AI_AGENT_${operation.toUpperCase()}_ERROR`,
      timestamp: new Date(),
    };
    setState((prev) => ({ ...prev, error: agentError }));
    throw agentError;
  }, []);

  const optimizeUIUX = useCallback(
    async (uiData: UIUXData): Promise<string> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await frontendAIAgents.optimizeUIUX(uiData);
        setState((prev) => ({ ...prev, loading: false, lastResult: result }));
        return result;
      } catch (error) {
        return handleError(error as Error, "optimizeUIUX");
      }
    },
    [handleError],
  );

  const generateContent = useCallback(
    async (contentData: ContentData): Promise<string> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await frontendAIAgents.generateContent(contentData);
        setState((prev) => ({ ...prev, loading: false, lastResult: result }));
        return result;
      } catch (error) {
        return handleError(error as Error, "generateContent");
      }
    },
    [handleError],
  );

  const analyzeUserBehavior = useCallback(
    async (behaviorData: BehaviorData): Promise<string> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await frontendAIAgents.analyzeUserBehavior(behaviorData);
        setState((prev) => ({ ...prev, loading: false, lastResult: result }));
        return result;
      } catch (error) {
        return handleError(error as Error, "analyzeUserBehavior");
      }
    },
    [handleError],
  );

  const suggestABTests = useCallback(
    async (testData: TestData): Promise<string> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await frontendAIAgents.suggestABTests(testData);
        setState((prev) => ({ ...prev, loading: false, lastResult: result }));
        return result;
      } catch (error) {
        return handleError(error as Error, "suggestABTests");
      }
    },
    [handleError],
  );

  const optimizePerformance = useCallback(
    async (performanceData: PerformanceData): Promise<string> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result =
          await frontendAIAgents.optimizePerformance(performanceData);
        setState((prev) => ({ ...prev, loading: false, lastResult: result }));
        return result;
      } catch (error) {
        return handleError(error as Error, "optimizePerformance");
      }
    },
    [handleError],
  );

  const checkAccessibility = useCallback(
    async (accessibilityData: AccessibilityData): Promise<string> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result =
          await frontendAIAgents.checkAccessibility(accessibilityData);
        setState((prev) => ({ ...prev, loading: false, lastResult: result }));
        return result;
      } catch (error) {
        return handleError(error as Error, "checkAccessibility");
      }
    },
    [handleError],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearResult = useCallback(() => {
    setState((prev) => ({ ...prev, lastResult: null }));
  }, []);

  return {
    ...state,
    optimizeUIUX,
    generateContent,
    analyzeUserBehavior,
    suggestABTests,
    optimizePerformance,
    checkAccessibility,
    clearError,
    clearResult,
  };
};

import { Configuration, OpenAIApi } from 'openai';
import { logger } from '@utils/logger';

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const aiAgents = {
  // Project Management Agent
  async projectManagementAgent(projectData: any) {
    try {
      const prompt = `Analyze this construction project and provide recommendations:
        Project: ${JSON.stringify(projectData)}
        Consider: timeline optimization, resource allocation, risk assessment, and cost efficiency.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('Project Management Agent error:', error);
      throw error;
    }
  },

  // Document Processing Agent
  async documentProcessingAgent(document: Buffer, type: string) {
    try {
      const prompt = `Process this ${type} document and extract key information:
        Document content: ${document.toString()}
        Extract: dates, costs, specifications, and requirements.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('Document Processing Agent error:', error);
      throw error;
    }
  },

  // Quality Assurance Agent
  async qualityAssuranceAgent(projectId: string) {
    try {
      const prompt = `Analyze project ${projectId} for quality assurance:
        Check: compliance with standards, safety measures, and best practices.
        Provide: recommendations for improvements and risk mitigation.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('Quality Assurance Agent error:', error);
      throw error;
    }
  },

  // Maintenance Agent
  async maintenanceAgent(systemData: any) {
    try {
      const prompt = `Analyze system performance and maintenance needs:
        System data: ${JSON.stringify(systemData)}
        Check: performance metrics, error logs, and system health.
        Provide: maintenance recommendations and optimization suggestions.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('Maintenance Agent error:', error);
      throw error;
    }
  },

  // Design Agent
  async designAgent(requirements: any) {
    try {
      const prompt = `Generate design recommendations based on requirements:
        Requirements: ${JSON.stringify(requirements)}
        Consider: user experience, accessibility, and modern design principles.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('Design Agent error:', error);
      throw error;
    }
  },

  // SEO Agent
  async seoAgent(websiteData: any) {
    try {
      const prompt = `Analyze website for SEO optimization:
        Website data: ${JSON.stringify(websiteData)}
        Check: content quality, keywords, meta tags, and performance.
        Provide: SEO recommendations and content optimization suggestions.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('SEO Agent error:', error);
      throw error;
    }
  },

  // ICT Agent
  async ictAgent(systemData: any) {
    try {
      const prompt = `Analyze ICT infrastructure and security:
        System data: ${JSON.stringify(systemData)}
        Check: security measures, infrastructure efficiency, and potential vulnerabilities.
        Provide: security recommendations and infrastructure optimization suggestions.`;

      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt,
        max_tokens: 500
      });

      return response.data.choices[0].text;
    } catch (error) {
      logger.error('ICT Agent error:', error);
      throw error;
    }
  }
}; 
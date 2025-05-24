import { Project } from "@models/project.model";
import { sharepointService } from "@config/azure.config";
import { logger } from "@utils/logger";

export const projectService = {
  async createProject(projectData: any) {
    try {
      // Create project in database
      const project = await Project.create(projectData);

      // Create SharePoint folder structure
      const folderPath = await sharepointService.createProjectFolder(
        project._id.toString(),
      );

      // Create subfolders
      const subfolders = ["Offertes", "Planning", "Foto's", "Nacalculatie"];
      for (const folder of subfolders) {
        await sharepointService.createProjectFolder(`${folderPath}/${folder}`);
      }

      logger.info(`Project created with SharePoint folder: ${folderPath}`);
      return project;
    } catch (error) {
      logger.error("Failed to create project:", error);
      throw error;
    }
  },

  async uploadProjectDocument(
    projectId: string,
    folder: string,
    fileName: string,
    content: Buffer,
  ) {
    try {
      const folderPath = `${sharepointConfig.documentLibrary}/${projectId}/${folder}`;
      await sharepointService.uploadDocument(folderPath, fileName, content);
      logger.info(`Document uploaded: ${folderPath}/${fileName}`);
    } catch (error) {
      logger.error("Failed to upload document:", error);
      throw error;
    }
  },

  async getProjectDocuments(projectId: string) {
    try {
      const response = await graphClient
        .api(
          `/sites/${sharepointConfig.siteId}/drive/root:/${sharepointConfig.documentLibrary}/${projectId}:/children`,
        )
        .get();
      return response.value;
    } catch (error) {
      logger.error("Failed to get project documents:", error);
      throw error;
    }
  },
};

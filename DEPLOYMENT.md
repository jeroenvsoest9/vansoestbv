# Azure Deployment Guide for Van Soest CMS

## Prerequisites

1. Azure Account with appropriate permissions
2. Azure DevOps account
3. Node.js 18.x installed locally
4. Azure CLI installed locally

## Azure Resources Setup

1. Create the following resources in Azure:
   - Azure App Service (for frontend)
   - Azure App Service (for backend)
   - Azure Database for MongoDB
   - Azure Storage Account (for file uploads)
   - Azure Key Vault (for secrets)

2. Configure the following environment variables in Azure App Service:

```env
# Frontend App Service
REACT_APP_API_URL=https://your-backend-app.azurewebsites.net
REACT_APP_STORAGE_URL=https://your-storage-account.blob.core.windows.net

# Backend App Service
PORT=80
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads
CORS_ORIGIN=https://your-frontend-app.azurewebsites.net
SESSION_SECRET=your-session-secret
LOG_LEVEL=info
LOG_PATH=logs
```

## Deployment Steps

1. **Setup Azure DevOps Pipeline**:
   - Create a new project in Azure DevOps
   - Import this repository
   - Create a new pipeline using the `azure-pipelines.yml` file
   - Create a variable group named `van-soest-cms-variables` with:
     - `azureSubscription`: Your Azure subscription name
     - `webAppName`: Your frontend app service name
     - `backendAppName`: Your backend app service name

2. **Configure Continuous Deployment**:
   - In Azure DevOps, go to Pipelines > Releases
   - Create a new release pipeline
   - Add the build artifact
   - Configure the deployment stages

3. **Database Migration**:
   - Connect to your MongoDB database
   - Run any necessary migrations
   - Import initial data if required

4. **Storage Configuration**:
   - Create containers in Azure Storage Account:
     - `uploads` for file uploads
     - `media` for processed media files
   - Configure CORS settings for the storage account

## Monitoring and Maintenance

1. **Set up Application Insights**:
   - Create an Application Insights resource
   - Configure monitoring for both frontend and backend
   - Set up alerts for critical errors

2. **Backup Strategy**:
   - Configure automated backups for MongoDB
   - Set up storage account backup
   - Document recovery procedures

3. **Scaling**:
   - Configure auto-scaling rules based on:
     - CPU usage
     - Memory usage
     - Request count

## Security Considerations

1. **Network Security**:
   - Configure VNet integration
   - Set up private endpoints
   - Configure network security groups

2. **Authentication**:
   - Enable Azure AD authentication
   - Configure managed identities
   - Set up SSL certificates

3. **Data Protection**:
   - Enable encryption at rest
   - Configure backup retention policies
   - Set up disaster recovery plan

## Troubleshooting

1. **Common Issues**:
   - Check application logs in Azure Portal
   - Verify environment variables
   - Check network connectivity
   - Monitor resource usage

2. **Support**:
   - Contact Azure support for platform issues
   - Refer to application logs for application issues
   - Check Azure status page for service health

## Cost Optimization

1. **Resource Sizing**:
   - Start with B1/B2 tier for App Services
   - Use Basic tier for MongoDB
   - Monitor usage and adjust as needed

2. **Auto-scaling**:
   - Set up scale-out rules
   - Configure scale-in rules
   - Monitor costs regularly 
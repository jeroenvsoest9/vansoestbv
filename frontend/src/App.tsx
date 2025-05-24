import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "./app/store";
import theme from "./styles/theme";

// Layout Components
import MainLayout from "./components/layout/MainLayout";

// Dashboard Components
import Dashboard from "./components/dashboard/Dashboard";
import ProjectOverview from "./components/dashboard/ProjectOverview";
import FinancialOverview from "./components/dashboard/FinancialOverview";
import ResourceManagement from "./components/dashboard/ResourceManagement";

// Project Management
import ProjectList from "./components/projects/ProjectList";
import ProjectDetails from "./components/projects/ProjectDetails";
import ProjectForm from "./components/projects/ProjectForm";
import ProjectPlanning from "./components/projects/ProjectPlanning";

// Financial Management
import InvoiceList from "./components/invoices/InvoiceList";
import InvoiceForm from "./components/invoices/InvoiceForm";
import InvoiceView from "./components/invoices/InvoiceView";
import FinancialReports from "./components/financial/FinancialReports";

// HR & Time Tracking
import TimeTracking from "./components/hr/TimeTracking";
import EmployeeManagement from "./components/hr/EmployeeManagement";
import ContractorManagement from "./components/hr/ContractorManagement";

// Document Management
import DocumentManager from "./components/documents/DocumentManager";
import DocumentViewer from "./components/documents/DocumentViewer";

// Client Portal
import ClientPortal from "./components/client/ClientPortal";
import ClientProjects from "./components/client/ClientProjects";
import ClientDocuments from "./components/client/ClientDocuments";

// Settings & Configuration
import Settings from "./components/settings/Settings";
import UserManagement from "./components/settings/UserManagement";
import IntegrationSettings from "./components/settings/IntegrationSettings";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Main Layout with Navigation */}
            <Route path="/" element={<MainLayout />}>
              {/* Dashboard Routes */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/projects" element={<ProjectOverview />} />
              <Route
                path="dashboard/financial"
                element={<FinancialOverview />}
              />
              <Route
                path="dashboard/resources"
                element={<ResourceManagement />}
              />

              {/* Project Management Routes */}
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              <Route
                path="projects/:id/planning"
                element={<ProjectPlanning />}
              />

              {/* Financial Management Routes */}
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="invoices/new" element={<InvoiceForm />} />
              <Route path="invoices/:id" element={<InvoiceView />} />
              <Route path="invoices/:id/edit" element={<InvoiceForm />} />
              <Route path="financial/reports" element={<FinancialReports />} />

              {/* HR & Time Tracking Routes */}
              <Route path="hr/time-tracking" element={<TimeTracking />} />
              <Route path="hr/employees" element={<EmployeeManagement />} />
              <Route path="hr/contractors" element={<ContractorManagement />} />

              {/* Document Management Routes */}
              <Route path="documents" element={<DocumentManager />} />
              <Route path="documents/:id" element={<DocumentViewer />} />

              {/* Client Portal Routes */}
              <Route path="client" element={<ClientPortal />} />
              <Route path="client/projects" element={<ClientProjects />} />
              <Route path="client/documents" element={<ClientDocuments />} />

              {/* Settings Routes */}
              <Route path="settings" element={<Settings />} />
              <Route path="settings/users" element={<UserManagement />} />
              <Route
                path="settings/integrations"
                element={<IntegrationSettings />}
              />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

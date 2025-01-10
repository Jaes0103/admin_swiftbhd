import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/LoginPage';
import Register from './components/RegisterPage';
import Dashboard from './components/DashboardPage';
import PendingRescueReports from './components/PendingRescueReportsPage';
import RescuedReports from './components/RescuedReportsPage';
import FalseReports from './components/FalseReportsPage';
import Adoption from './components/AdoptionRequestsPage';
import Adoptable from './components/AdoptableAnimalPage';
import AnimalList from './components/AnimalListPage';
import AnimalDetails from './components/AnimalDetailsPage';
import Events from './components/EventsManager';
import Rescuer from './components/CreateRescuerPage';
import MapView from './components/MapViewPage';
import NotFound from './components/NotFound';
import ReportPreviewPage from './components/ReportPreviewPage'; // Import new report preview page
import PrivateRoute from './config/PrivateRoute';
import { useAuth } from './context/AuthProvider';
import { AuthProvider } from './context/AuthProvider'; // Import the AuthProvider for wrapping the app

const App = () => {
    return (
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

const AppRoutes = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/' || location.pathname === '/register';

    return (
        <div className={isAuthPage ? 'auth-background' : ''}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/adopt-animal" element={
                    <PrivateRoute>
                        <Adoptable />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                {/* Reports Section */}
                <Route path="/reports/pending-rescue" element={
                    <PrivateRoute>
                        <PendingRescueReports />
                    </PrivateRoute>
                } />
                <Route path="/reports/rescued" element={
                    <PrivateRoute>
                        <RescuedReports />
                    </PrivateRoute>
                } />
                <Route path="/reports/false-reports" element={
                    <PrivateRoute>
                        <FalseReports />
                    </PrivateRoute>
                } />
                {/* Report Preview Page Route */}
                <Route path="/report-preview" element={
                    <PrivateRoute>
                        <ReportPreviewPage />
                    </PrivateRoute>
                } />
                {/* Other Routes */}
                <Route path="/adoption" element={
                    <PrivateRoute>
                        <Adoption />
                    </PrivateRoute>
                } />
                <Route path="/animals" element={
                    <PrivateRoute>
                        <AnimalList />
                    </PrivateRoute>
                } />
                <Route path="/events" element={
                    <PrivateRoute>
                        <Events />
                    </PrivateRoute>
                } />
                <Route path="/rescuers" element={
                    <PrivateRoute>
                        <Rescuer />
                    </PrivateRoute>
                } />
                <Route path="/animals/:id/details" element={
                    <PrivateRoute>
                        <AnimalDetails />
                    </PrivateRoute>
                } />
                <Route path="/maps" element={
                    <PrivateRoute>
                        <MapView />
                    </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;

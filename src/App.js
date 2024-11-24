import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/LoginPage'; 
import Register from './components/RegisterPage';
import Dashboard from './components/DashboardPage';
import Reports from './components/ReportsPage';
import Adoption from './components/AdoptionRequestsPage';
import Adoptable from './components/AdoptableAnimalPage';
import AnimalList from './components/AnimalListPage';
import AnimalDetails from './components/AnimalDetailsPage';
import Events from './components/EventsManager';
import Rescuer from './components/CreateRescuerPage';
import MapView from './components/MapViewPage';
import NotFound from './components/NotFound'; // Import NotFound
import PrivateRoute from './config/PrivateRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
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
                <Route path="/reports" element={
                    <PrivateRoute>
                        <Reports />
                    </PrivateRoute>
                } />
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
        </Router>
    );
};

export default App;

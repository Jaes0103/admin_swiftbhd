    // src/App.js

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
    import PrivateRoute from './config/PrivateRoute'; // Importing PrivateRoute
    import { useAuth } from './context/AuthContext'; // Import useAuth if needed

    const App = () => {
        const { isAuthenticated } = useAuth(); // Example usage of useAuth

        return (
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Change the adoption route to a protected route */}
                    <Route path="/adopt-animal" element={
                        <PrivateRoute>
                            <Adoptable />
                        </PrivateRoute>
                    } />

                    {/* Protected Routes - Accessible only if authenticated */}
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
                </Routes>
            </Router>
        );
    };

    export default App;
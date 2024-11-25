// src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavigationBar/>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        {/* Добавьте остальные маршруты */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
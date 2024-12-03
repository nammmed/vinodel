// src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GrapeList from "./pages/GrapeList";
import GrapeEdit from "./pages/GrapeEdit";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import GrapeCreate from "./pages/GrapeCreate";

// Защищенный маршрут - редиректит на логин, если пользователь не авторизован
const ProtectedRoute = ({children}) => {
    const { authenticated } = useContext(AuthContext);
    return authenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavigationBar/>
                <div className="container mt-4">
                    <Routes>
                        {/* Публичные маршруты */}
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>

                        {/* Защищенные маршруты */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard/>
                            </ProtectedRoute>
                        }/>

                        {/* Виноград */}
                        <Route path="/grapes" element={
                            <ProtectedRoute>
                                <GrapeList/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/grapes/:id/edit" element={
                            <ProtectedRoute>
                                <GrapeEdit/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/grapes/new" element={
                            <Route path="/grapes/new" element={
                                <ProtectedRoute>
                                    <GrapeCreate />
                                </ProtectedRoute>
                            }/>
                        }/>

                        {/* Партии */}
                        <Route path="/batches" element={
                            <ProtectedRoute>
                                <div>Список партий (компонент пока не создан)</div>
                            </ProtectedRoute>
                        }/>
                        <Route path="/batches/new" element={
                            <ProtectedRoute>
                                <div>Создание партии (компонент пока не создан)</div>
                            </ProtectedRoute>
                        }/>

                        {/* Купажи */}
                        <Route path="/blends" element={
                            <ProtectedRoute>
                                <div>Список купажей (компонент пока не создан)</div>
                            </ProtectedRoute>
                        }/>
                        <Route path="/blends/new" element={
                            <ProtectedRoute>
                                <div>Создание купажа (компонент пока не создан)</div>
                            </ProtectedRoute>
                        }/>

                        {/* Процессы */}
                        <Route path="/processes" element={
                            <ProtectedRoute>
                                <div>Список процессов (компонент пока не создан)</div>
                            </ProtectedRoute>
                        }/>
                        <Route path="/measurements" element={
                            <ProtectedRoute>
                                <div>Измерения (компонент пока не создан)</div>
                            </ProtectedRoute>
                        }/>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
// src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GrapeList from "./pages/GrapeList";
import {useContext} from 'react';
import {AuthContext} from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RecipeList from "./pages/RecipeList";
import SuppliesPage from "./pages/SuppliesPage";

// Защищенный маршрут - редиректит на логин, если пользователь не авторизован
const ProtectedRoute = ({children}) => {
    const {authenticated} = useContext(AuthContext);
    return authenticated ? children : <Navigate to="/login"/>;
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

                        {/* Рецепты */}
                        <Route path="/recipes" element={
                            <ProtectedRoute>
                                <RecipeList />
                            </ProtectedRoute>
                        }/>

                        {/* Склад */}
                        <Route path="/supplies" element={
                            <ProtectedRoute>
                                <SuppliesPage />
                            </ProtectedRoute>
                        }/>

                    </Routes>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FruitStockPage from "./pages/FruitStockPage"; // ИЗМЕНЕНИЕ
import RecipeList from "./pages/RecipeList";
import SuppliesPage from "./pages/SuppliesPage";
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BatchDetailPage from "./pages/BatchDetailPage";

const ProtectedRoute = ({ children }) => {
    const { authenticated } = useContext(AuthContext);
    return authenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavigationBar />
                <div className="container mt-4">
                    <Routes>
                        {/* Публичные маршруты */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Защищенные маршруты */}
                        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                        {/* Погреб */}
                        <Route path="/fruits" element={<ProtectedRoute><FruitStockPage /></ProtectedRoute>} />
                        <Route path="/batches" element={<ProtectedRoute><div>Список партий (в разработке)</div></ProtectedRoute>} />
                        <Route path="/batches/:batchId" element={<ProtectedRoute><BatchDetailPage /></ProtectedRoute>} />

                        {/* Рецепты */}
                        <Route path="/recipes" element={<ProtectedRoute><RecipeList /></ProtectedRoute>} />

                        {/* Склад */}
                        <Route path="/supplies" element={<ProtectedRoute><SuppliesPage /></ProtectedRoute>} />

                        {/* Заглушки */}
                        <Route path="/batches/new" element={<ProtectedRoute><div>Создание партии (в разработке)</div></ProtectedRoute>} />
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
// src/hooks/useGrapes.js
import { useState, useEffect } from 'react';
import api, { createGrape } from '../services/api';

const useGrapes = () => {
    const [grapes, setGrapes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false); // Состояние для модального окна добавления


    const fetchGrapes = async () => {
        try {
            const grapesResponse = await api.get('/grapes');
            setGrapes(grapesResponse.data);
        } catch (error) {
            console.error('Ошибка загрузки данных о винограде:', error);
            setError('Ошибка при загрузке данных о винограде');
        } finally {
            setLoading(false);
        }
    };

    const handleAddGrape = async (grapeData) => {
        try {
            await createGrape(grapeData);
            fetchGrapes(); // Обновляем список винограда
            setShowAddModal(false); // Закрываем модальное окно
        } catch (err) {
            setError('Ошибка при добавлении винограда');
        }
    };

    useEffect(() => {
        fetchGrapes();
    }, []);

    return { grapes, loading, error, handleAddGrape, showAddModal, setShowAddModal };
};

export default useGrapes;
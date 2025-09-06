import { useState, useEffect, useCallback } from 'react';
import { getGrapes, createGrape, updateGrape } from '../services/api';
import { toast } from "react-toastify";

const useFruitStock = () => {
    const [fruits, setFruits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFruits = useCallback(async () => {
        setLoading(true);
        try {
            // API эндпоинт остается /grapes
            const response = await getGrapes();
            setFruits(response.data);
        } catch (error) {
            setError('Ошибка при загрузке запасов плодов');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddFruit = async (fruitData) => {
        try {
            await createGrape(fruitData);
            toast.success('Новый плод успешно добавлен в погреб!');
            await fetchFruits();
            return true; // Возвращаем успех для закрытия модального окна
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при добавлении');
            return false; // Возвращаем неудачу
        }
    };

    const handleUpdateFruit = async (fruitId, fruitData) => {
        try {
            await updateGrape(fruitId, fruitData);
            toast.success('Карточка плода успешно обновлена!');
            await fetchFruits();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при обновлении');
            return false;
        }
    }

    useEffect(() => {
        fetchFruits();
    }, [fetchFruits]);

    return { fruits, loading, error, fetchFruits, handleAddFruit, handleUpdateFruit };
};

export default useFruitStock;
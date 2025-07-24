import { useState, useEffect, useCallback } from 'react';
import { getSupplies, createSupply, addStockToSupply } from '../services/api';
import { toast } from 'react-toastify';

export default function useSupplies() {
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSupplies = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSupplies();
            setSupplies(response.data);
        } catch (error) {
            toast.error('Не удалось загрузить данные о расходниках.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreateSupply = async (data) => {
        try {
            await createSupply(data);
            toast.success("Новый расходник успешно добавлен!");
            fetchSupplies(); // Обновляем список
        } catch (error) {
            toast.error(error.response?.data?.error || 'Ошибка при создании расходника.');
        }
    };

    const handleAddStock = async (supplyId, data) => {
        try {
            await addStockToSupply(supplyId, data);
            toast.success("Запас успешно пополнен!");
            fetchSupplies(); // Обновляем список
        } catch (error) {
            toast.error(error.response?.data?.error || 'Ошибка при пополнении запаса.');
        }
    }

    useEffect(() => {
        fetchSupplies();
    }, [fetchSupplies]);

    return { supplies, loading, fetchSupplies, handleCreateSupply, handleAddStock };
}
// src/hooks/useBatches.js
import {useState, useEffect} from 'react';
import api, {splitBatch} from '../services/api';

const useBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBatches = async () => {
        try {
            const response = await api.get('/batches');
            setBatches(response.data);
            setError(null);
        } catch (error) {
            console.error('Ошибка загрузки данных о партиях:', error);
            setError('Ошибка при загрузке данных о партиях');
        } finally {
            setLoading(false);
        }
    };


    const handleSplitBatch = async (data) => {
        try {
            await splitBatch(data.batchId, data);
            await fetchBatches();
            return Promise.resolve();
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.join('\n') ||
                'Ошибка при разделении партии';
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    return {batches, loading, error, handleSplitBatch};
};

export default useBatches;
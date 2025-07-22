import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useGrapeSorts() {
    const [sorts, setSorts] = useState([]);
    useEffect(() => {
        api.get('/grape-sorts')
            .then(response => setSorts(response.data))
            .catch(err => console.error("Failed to load grape sorts", err));
    }, []);
    return sorts;
}
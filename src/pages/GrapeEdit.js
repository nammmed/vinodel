// src/pages/GrapeEdit.js

import React, {useState, useEffect} from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';
import {getGrapeById, updateGrape} from '../services/api';

function GrapeEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [grape, setGrape] = useState({
        sort: '',
        quantity: '',
        date_purchased: '',
        cost: '',
        supplier: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGrape();
    }, [id]);

    const loadGrape = async () => {
        try {
            const response = await getGrapeById(id);
            setGrape(response.data);
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке данных о винограде');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateGrape(id, grape);
            navigate('/grapes');
        } catch (err) {
            setError('Ошибка при обновлении данных');
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setGrape(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="d-flex justify-content-center">
            <Card style={{width: '600px'}}>
                <Card.Body>
                    <Card.Title>Редактирование винограда</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Сорт</Form.Label>
                            <Form.Control
                                type="text"
                                name="sort"
                                value={grape.sort}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Количество (кг)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                name="quantity"
                                value={grape.quantity}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Дата закупки</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_purchased"
                                value={grape.date_purchased}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Стоимость (₽)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="cost"
                                value={grape.cost || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Поставщик</Form.Label>
                            <Form.Control
                                type="text"
                                name="supplier"
                                value={grape.supplier || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Примечания</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                value={grape.notes || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/grapes')}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Сохранить
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default GrapeEdit;

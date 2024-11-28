// src/pages/GrapeCreate.js

import React, {useState} from 'react';
import {Form, Button, Card, Alert} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {createGrape} from '../services/api';

function GrapeCreate() {
    const navigate = useNavigate();
    const [grape, setGrape] = useState({
        sort: '',
        quantity: '',
        date_purchased: new Date().toISOString().split('T')[0], // Текущая дата по умолчанию
        cost: '',
        supplier: '',
        notes: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createGrape(grape);
            navigate('/grapes');
        } catch (err) {
            setError('Ошибка при добавлении винограда');
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setGrape(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="d-flex justify-content-center">
            <Card style={{width: '600px'}}>
                <Card.Body>
                    <Card.Title>Добавление винограда</Card.Title>
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
                                placeholder="Введите сорт винограда"
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
                                placeholder="Введите количество"
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
                                value={grape.cost}
                                onChange={handleChange}
                                placeholder="Введите стоимость"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Поставщик</Form.Label>
                            <Form.Control
                                type="text"
                                name="supplier"
                                value={grape.supplier}
                                onChange={handleChange}
                                placeholder="Введите поставщика"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Примечания</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                value={grape.notes}
                                onChange={handleChange}
                                placeholder="Введите примечания"
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
                                variant="success"
                                type="submit"
                            >
                                Добавить
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default GrapeCreate;
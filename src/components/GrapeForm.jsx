import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function GrapeForm({ initialData, onSubmit, onClose }) {
    const [grape, setGrape] = useState({
        sort: '',
        quantity: '',
        date_purchased: new Date().toISOString().split('T')[0],
        cost: '',
        supplier: '',
        notes: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setGrape(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(grape);
            onClose();
            setGrape({
                sort: '',
                quantity: '',
                date_purchased: new Date().toISOString().split('T')[0],
                cost: '',
                supplier: '',
                notes: '',
            });
        } catch (err) {
            setError('Произошла ошибка при сохранении данных');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrape((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
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

                {/* Остальные поля формы, аналогично */}
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
                    <Button variant="secondary" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="success" type="submit">
                        Сохранить
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default GrapeForm;
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, CloseButton } from 'react-bootstrap';
import useGrapeSorts from '../hooks/useGrapeSorts';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function GrapeForm({ initialData, onSubmit, onClose }) {
    const sorts = useGrapeSorts();
    const [grape, setGrape] = useState({
        grape_sort_id: '',
        quantity: '',
        date_purchased: new Date().toISOString().split('T')[0],
        cost: '',
        supplier: '',
        notes: '',
    });

    const [error, setError] = useState('');

    const typeaheadRef = useRef(null);
    const sortOptions = sorts.map(s => ({ value: s.id, label: s.name }));
    const selectedSort = sortOptions.find(opt => opt.value === grape.grape_sort_id);

    useEffect(() => {
        if (initialData) {
            const preparedData = {
                ...initialData,
                quantity: initialData.quantity?.toString() || '',
                cost: initialData.cost?.toString() || '',
                supplier: initialData.supplier || '',
                notes: initialData.notes || '',
            };
            setGrape(preparedData);
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
        setGrape(prev => ({ ...prev, [name]: value }));
    };

    const handleSortChange = (selected) => {
        const selectedId = selected.length > 0 ? selected[0].id : '';
        setGrape(prev => ({
            ...prev,
            grape_sort_id: selectedId
        }));
    };
    const handleSortBlur = () => {
        if (!grape.grape_sort_id) {
            typeaheadRef.current?.clear();
        }
    };

    const selectedSortArray = sorts.filter(s => s.id === grape.grape_sort_id);

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Сорт</Form.Label>
                    <Typeahead
                        id="grape-sort-typeahead"
                        labelKey="name"
                        options={sorts}
                        onChange={handleSortChange}
                        selected={selectedSortArray}
                        placeholder="Выберите или начните вводить сорт..."
                        emptyLabel="Сорт не найден."
                        allowNew={false}
                        ref={typeaheadRef}
                        onBlur={handleSortBlur}
                        clearButton={<CloseButton aria-label="Очистить" />}
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
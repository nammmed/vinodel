import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import useGrapeSorts from '../hooks/useGrapeSorts';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { toast } from "react-toastify";

function FruitStockForm({ initialData, onSubmit, onClose }) {
    const sorts = useGrapeSorts();
    const [fruit, setFruit] = useState({
        grape_sort_id: '',
        quantity: '',
        date_purchased: new Date().toISOString().split('T')[0],
        cost: '',
        supplier: '',
        notes: '',
    });

    const typeaheadRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setFruit(initialData);
        } else {
            setFruit({
                grape_sort_id: '',
                quantity: '',
                date_purchased: new Date().toISOString().split('T')[0],
                cost: '',
                supplier: '',
                notes: '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fruit.grape_sort_id) {
            toast.warn("Пожалуйста, выберите название из списка.");
            return;
        }
        onSubmit(fruit);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFruit(prev => ({ ...prev, [name]: value }));
    };

    const handleSortChange = (selected) => {
        const selectedId = selected.length > 0 ? selected[0].id : '';
        setFruit(prev => ({ ...prev, grape_sort_id: selectedId }));
    };

    const selectedSortArray = sorts.filter(s => s.id === fruit.grape_sort_id);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Название (сорт)</Form.Label>
                <Typeahead
                    id="fruit-sort-typeahead"
                    labelKey="name"
                    options={sorts}
                    onChange={handleSortChange}
                    selected={selectedSortArray}
                    placeholder="Выберите или начните вводить название..."
                    emptyLabel="Не найдено."
                    ref={typeaheadRef}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Количество (кг)</Form.Label>
                <Form.Control type="number" step="0.1" name="quantity" value={fruit.quantity} onChange={handleChange} required placeholder="Введите количество" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Дата поступления</Form.Label>
                <Form.Control type="date" name="date_purchased" value={fruit.date_purchased} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Стоимость (₽)</Form.Label>
                <Form.Control type="number" step="0.01" name="cost" value={fruit.cost} onChange={handleChange} placeholder="Введите стоимость" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Поставщик</Form.Label>
                <Form.Control type="text" name="supplier" value={fruit.supplier} onChange={handleChange} placeholder="Введите поставщика" />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Примечания</Form.Label>
                <Form.Control as="textarea" rows={3} name="notes" value={fruit.notes} onChange={handleChange} placeholder="Дополнительная информация" />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onClose}>Отмена</Button>
                <Button variant="success" type="submit">Сохранить</Button>
            </div>
        </Form>
    );
}

export default FruitStockForm;
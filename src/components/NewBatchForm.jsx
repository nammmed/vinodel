import React, {useState, useEffect} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import {toast} from "react-toastify";

function NewBatchForm({ingredient, onSubmit, onClose}) {
    const [formData, setFormData] = useState({
        batch_name: '',
        quantity: 0,
        juice_volume: '',
        sugar_content: '',
        acidity: '',
        yeast_type: '',
        vinification_method: 'Красный', // Значение по умолчанию
        fermentation_temperature: '',
        notes: '',
    });

    useEffect(() => {
        if (ingredient) {
            setFormData(prev => ({
                ...prev,
                batch_name: ingredient.sort_name,
                quantity: ingredient.quantity,
            }));
        }
    }, [ingredient]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.quantity || formData.quantity <= 0 || formData.quantity > ingredient.quantity) {
            toast.warn('Некорректное количество для партии.');
            return;
        }
        if (!formData.juice_volume || formData.juice_volume <= 0) {
            toast.warn('Укажите корректный объем сока.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Новая партия: {ingredient?.sort_name} ⚗️</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} id="new-batch-form">
                    <Form.Group className="mb-3">
                        <Form.Label>Название партии</Form.Label>
                        <Form.Control type="text" name="batch_name" value={formData.batch_name} onChange={handleChange}
                                      required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Взять для партии (кг)</Form.Label>
                        <Form.Control type="number" step="0.1" name="quantity" value={formData.quantity}
                                      onChange={handleChange} min="0.1" max={ingredient.quantity} required/>
                        <Form.Text>Доступно: {ingredient.quantity} кг</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Объем полученного сока (л)</Form.Label>
                        <Form.Control type="number" step="0.1" name="juice_volume" value={formData.juice_volume}
                                      onChange={handleChange} min="0.1" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Метод обработки</Form.Label>
                        <div>
                            <Form.Check inline type="radio" label="Красный (с мезгой/кожицей)"
                                        name="vinification_method" value="Красный"
                                        checked={formData.vinification_method === 'Красный'} onChange={handleChange}/>
                            <Form.Check inline type="radio" label="Белый (только сок)" name="vinification_method"
                                        value="Белый" checked={formData.vinification_method === 'Белый'}
                                        onChange={handleChange}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Температура брожения (°C)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            name="fermentation_temperature"
                            value={formData.fermentation_temperature}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Примечания</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Дополнительная информация"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Отмена</Button>
                <Button variant="success" type="submit" form="new-batch-form">Создать партию</Button>
            </Modal.Footer>
        </>
    );
}

export default NewBatchForm;
import React, {useState} from 'react';
import {Form, Button, Alert} from 'react-bootstrap';

function VinifyForm({grape, onSubmit, onClose}) {
    const [formData, setFormData] = useState({
        batch_name: grape.sort,
        quantity: grape.quantity,
        juice_volume: '',
        sugar_content: '',
        acidity: '',
        yeast_type: '',
        vinification_method: '',
        fermentation_temperature: '',
        notes: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Простейшая валидация перед отправкой
        if (formData.quantity <= 0 || formData.quantity > grape.quantity) {
            setError('Некорректное количество винограда');
            return;
        }
        if (!formData.juice_volume || formData.juice_volume <= 0) {
            setError('Укажите корректный объем сока');
            return;
        }
        try {
            await onSubmit(formData);
        } catch (err) {
            setError('Ошибка при создании партии');
        }
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Название партии</Form.Label>
                    <Form.Control
                        type="text"
                        name="batch_name"
                        value={formData.batch_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Количество винограда (кг)</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.1"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0.1"
                        max={grape.quantity}
                        required
                    />
                    <Form.Text className="text-muted">
                        Доступно: {grape.quantity} кг
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Объем полученного сока (л)</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.1"
                        name="juice_volume"
                        value={formData.juice_volume}
                        onChange={handleChange}
                        min="0.1"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Сахаристость (% Brix)</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.1"
                        name="sugar_content"
                        value={formData.sugar_content}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Кислотность (pH)</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        name="acidity"
                        value={formData.acidity}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Тип дрожжей</Form.Label>
                    <Form.Control
                        type="text"
                        name="yeast_type"
                        value={formData.yeast_type}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Метод винификации</Form.Label>
                    <div>
                        <Form.Check
                            type="radio"
                            label="Красный (с кожицей)"
                            name="vinification_method"
                            value="Красный"
                            checked={formData.vinification_method === 'Красный'}
                            onChange={handleChange}
                        />
                        <Form.Check
                            type="radio"
                            label="Белый (без кожицы)"
                            name="vinification_method"
                            value="Белый"
                            checked={formData.vinification_method === 'Белый'}
                            onChange={handleChange}
                        />
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

                {/* Примечания */}
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

                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="success" type="submit">
                        Создать партию
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default VinifyForm;
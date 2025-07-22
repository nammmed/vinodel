import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { blendBatches } from '../services/api';
import { toast } from 'react-toastify';

function BlendLabModal({ show, onClose, initialData, onSuccess }) {
    // --- 1. Основное состояние ---
    const [components, setComponents] = useState([]);
    const [blendName, setBlendName] = useState('');
    const [blendNotes, setBlendNotes] = useState('');
    const [saveAsRecipe, setSaveAsRecipe] = useState(false);
    const [recipeName, setRecipeName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- 2. Инициализация и сброс состояния при открытии/закрытии ---
    useEffect(() => {
        if (show && initialData) {
            // Заполняем на основе initialData
            setComponents(initialData.components || []);
            setBlendName(initialData.name || '');
            setRecipeName(initialData.name || '');
        } else if (!show) {
            // Сбрасываем все при закрытии
            setComponents([]);
            setBlendName('');
            setBlendNotes('');
            setSaveAsRecipe(false);
            setRecipeName('');
            setIsLoading(false);
        }
    }, [show, initialData]);

    // --- 3. Вычисляемые значения (всегда актуальны) ---
    const totalBlendVolume = components.reduce((sum, c) => sum + (c.usedVolume || 0), 0);
    const isFormValid =
        !isLoading &&
        blendName.trim() !== '' &&
        totalBlendVolume > 0 &&
        components.every(c => c.usedVolume <= c.availableVolume) &&
        (!saveAsRecipe || recipeName.trim() !== '');

    // --- 4. Обработчик ИСКЛЮЧИТЕЛЬНО для объема ---
    const handleVolumeChange = (index, newVolumeStr) => {
        const newComponents = [...components];
        const component = newComponents[index];
        let newVolume = parseFloat(newVolumeStr);

        // Валидация: не меньше нуля и не больше доступного
        if (isNaN(newVolume) || newVolume < 0) {
            newVolume = 0;
        }
        if (newVolume > component.availableVolume) {
            newVolume = component.availableVolume;
        }

        component.usedVolume = newVolume;
        setComponents(newComponents);
    };

    // --- 5. Обработчик отправки формы ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.warn('Проверьте правильность введенных данных.');
            return;
        }

        setIsLoading(true);

        const payload = {
            name: blendName,
            notes: blendNotes,
            components: components
                .filter(c => c.usedVolume > 0)
                .map(c => ({ component_id: c.id, volume: c.usedVolume })),
            save_as_recipe: saveAsRecipe,
            recipe_name: saveAsRecipe ? recipeName : undefined
        };

        try {
            const response = await blendBatches(payload);
            onSuccess(response.data); // Сообщаем об успехе наверх
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Неизвестная ошибка при создании купажа.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="xl" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>🧪 Лаборатория купажирования</Modal.Title>
            </Modal.Header>

            {/* Информационная панель */}
            <div className="bg-light p-3 border-bottom">
                <Row className="align-items-center text-center">
                    <Col><strong>Компонентов:</strong> {components.length}</Col>
                    <Col><strong>Итоговый объем:</strong> {totalBlendVolume.toFixed(2)} л</Col>
                </Row>
            </div>

            <Modal.Body>
                <Form id="blend-lab-form" onSubmit={handleSubmit}>
                    {/* Цикл по компонентам */}
                    {components.map((c, index) => {
                        const percentage = totalBlendVolume > 0 ? (c.usedVolume / totalBlendVolume * 100) : 0;
                        return (
                            <div key={c.id} className="mb-3">
                                <Row className="align-items-center">
                                    <Col md={3}>
                                        <h6 className="mb-0">{c.name}</h6>
                                        <small className="text-muted">Доступно: {c.availableVolume.toFixed(2)} л</small>
                                    </Col>
                                    <Col md={7}>
                                        <Form.Range
                                            min={0}
                                            max={c.availableVolume}
                                            step={0.1}
                                            value={c.usedVolume}
                                            onChange={(e) => handleVolumeChange(index, e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <InputGroup>
                                            <Form.Control
                                                type="number"
                                                value={c.usedVolume.toFixed(2)}
                                                onChange={(e) => handleVolumeChange(index, e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <InputGroup.Text>л</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                    <Col md={12} className="text-center text-muted mt-1">
                                        <small>Доля в купаже: {percentage.toFixed(1)}%</small>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}

                    <hr />

                    {/* Настройки нового купажа */}
                    <Row>
                        <Col md={7}>
                            <h5>Название и примечания</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Название нового купажа</Form.Label>
                                <Form.Control type="text" value={blendName} onChange={(e) => setBlendName(e.target.value)} required disabled={isLoading} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Примечания</Form.Label>
                                <Form.Control as="textarea" rows={3} value={blendNotes} onChange={(e) => setBlendNotes(e.target.value)} disabled={isLoading} />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <h5>Сохранение</h5>
                            <Form.Check
                                type="switch"
                                id="save-recipe-switch"
                                label="Сохранить как новый рецепт"
                                checked={saveAsRecipe}
                                onChange={(e) => setSaveAsRecipe(e.target.checked)}
                                disabled={isLoading}
                            />
                            {saveAsRecipe && (
                                <Form.Group className="mt-2">
                                    <Form.Label>Название рецепта</Form.Label>
                                    <Form.Control type="text" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required disabled={isLoading} />
                                </Form.Group>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>Отмена</Button>
                <Button variant="success" type="submit" form="blend-lab-form" disabled={!isFormValid}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Создать купаж'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BlendLabModal;
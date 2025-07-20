import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { blendBatches } from '../services/api';

function BlendLabModal({ show, onClose, batches, onSuccess }) {
    const [components, setComponents] = useState([]);
    const [blendName, setBlendName] = useState('');
    const [blendNotes, setBlendNotes] = useState('');
    const [saveAsRecipe, setSaveAsRecipe] = useState(false);
    const [recipeName, setRecipeName] = useState('');

    const [globalError, setGlobalError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Этот useEffect сбрасывает и инициализирует состояние лаборатории
    // каждый раз, когда открывается модальное окно с новым набором партий.
    useEffect(() => {
        if (batches && batches.length > 0) {
            setComponents(
                batches.map((b) => ({
                    id: b.id,
                    name: b.name,
                    availableVolume: parseFloat(b.current_volume),
                    usedVolume: 0,
                    error: null,
                }))
            );
            // Генерируем начальное имя для купажа
            const initialName = `Купаж из ${batches.map(b => b.name).join(', ')}`;
            setBlendName(initialName.substring(0, 100)); // Ограничим длину
            setRecipeName(initialName.substring(0, 100));
        }
        // Сбрасываем все остальные поля при открытии
        setBlendNotes('');
        setSaveAsRecipe(false);
        setGlobalError(null);
        setIsLoading(false);
    }, [batches, show]);


    // --- Расчеты на лету (производное состояние) ---
    const totalBlendVolume = components.reduce((sum, c) => sum + (parseFloat(c.usedVolume) || 0), 0);
    const isFormValid = !isLoading && blendName.trim() !== '' && totalBlendVolume > 0 && components.every(c => !c.error) && (!saveAsRecipe || recipeName.trim() !== '');

    // --- Обработчики событий ---

    const handleVolumeChange = (index, newVolumeStr) => {
        const newVolume = parseFloat(newVolumeStr) || 0;
        const newComponents = [...components];
        const component = newComponents[index];

        component.usedVolume = newVolume;
        // Валидация объема для конкретного компонента
        if (newVolume > component.availableVolume) {
            component.error = `Максимум: ${component.availableVolume}л`;
        } else {
            component.error = null;
        }

        setComponents(newComponents);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        setGlobalError(null);

        const payload = {
            name: blendName,
            notes: blendNotes,
            components: components
                .filter(c => c.usedVolume > 0) // Отправляем только те, что используются
                .map(c => ({
                    component_id: c.id,
                    volume: c.usedVolume
                })),
            save_as_recipe: saveAsRecipe,
            recipe_name: saveAsRecipe ? recipeName : undefined
        };

        try {
            const response = await blendBatches(payload);
            onSuccess(response.data); // Сообщаем родительскому компоненту об успехе
            onClose(); // Закрываем модальное окно
        } catch (err) {
            setGlobalError(err.response?.data?.error || 'Неизвестная ошибка при создании купажа.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="xl" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>🧪 Лаборатория купажирования</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {globalError && <Alert variant="danger">{globalError}</Alert>}

                <Form id="blend-lab-form" onSubmit={handleSubmit}>
                    {/* Секция компонентов */}
                    <h5>Компоненты</h5>
                    {components.map((c, index) => (
                        <div key={c.id} className="p-3 mb-3 border rounded">
                            <h6>{c.name}</h6>
                            <Row className="align-items-center">
                                <Col md={5}>
                                    <Form.Group>
                                        <Form.Label>Используемый объем (л)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.1"
                                            value={c.usedVolume}
                                            onChange={(e) => handleVolumeChange(index, e.target.value)}
                                            isInvalid={!!c.error}
                                            disabled={isLoading}
                                        />
                                        <Form.Control.Feedback type="invalid">{c.error}</Form.Control.Feedback>
                                        <Form.Text>
                                            Доступно: {c.availableVolume.toFixed(2)}л / В купаже: {totalBlendVolume > 0 ? ((c.usedVolume / totalBlendVolume) * 100).toFixed(1) : 0}%
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={7}>
                                    <Form.Label>Забор из исходной партии</Form.Label>
                                    <ProgressBar style={{height: '2rem'}}>
                                        <ProgressBar
                                            now={(c.usedVolume / c.availableVolume) * 100}
                                            label={`${c.usedVolume.toFixed(2)}л`}
                                            animated
                                        />
                                    </ProgressBar>
                                </Col>
                            </Row>
                        </div>
                    ))}

                    <hr />

                    {/* Секция нового купажа */}
                    <Row>
                        <Col md={7}>
                            <h5>Новый купаж</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Название нового купажа</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={blendName}
                                    onChange={(e) => setBlendName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Примечания</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={blendNotes}
                                    onChange={(e) => setBlendNotes(e.target.value)}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5} className="bg-light p-3 rounded">
                            <h5>Итог</h5>
                            <h3>{totalBlendVolume.toFixed(2)} л</h3>
                            <hr/>
                            <Form.Check
                                type="switch"
                                id="save-recipe-switch"
                                label="Сохранить как рецепт"
                                checked={saveAsRecipe}
                                onChange={(e) => setSaveAsRecipe(e.target.checked)}
                                disabled={isLoading}
                            />
                            {saveAsRecipe && (
                                <Form.Group className="mt-2">
                                    <Form.Label>Название рецепта</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={recipeName}
                                        onChange={(e) => setRecipeName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </Form.Group>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                    Отмена
                </Button>
                <Button variant="success" type="submit" form="blend-lab-form" disabled={!isFormValid}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Создать купаж'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BlendLabModal;
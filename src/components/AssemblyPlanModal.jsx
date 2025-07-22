import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

function AssemblyPlanModal({ show, onClose, plan, onConfirm }) {
    // Состояние для хранения выбора пользователя: { grape_sort_id: selected_batch_id }
    const [selections, setSelections] = useState({});

    // Сбрасываем выбор при каждом открытии модального окна с новым планом
    useEffect(() => {
        if (show) {
            setSelections({});
        }
    }, [show, plan]);

    // Обработчик выбора радиокнопки
    const handleSelectionChange = (grapeSortId, batchId) => {
        setSelections(prev => ({
            ...prev,
            [grapeSortId]: batchId
        }));
    };

    // Проверяем, сделал ли пользователь выбор для всех "неоднозначных" ингредиентов
    const isSelectionComplete = plan?.required_ingredients.every(ing => {
        // Если у ингредиента больше одного источника, для него должен быть сделан выбор
        if (ing.sources.length > 1) {
            return !!selections[ing.grape_sort_id];
        }
        // Если источник один или их нет, условие выполнено
        return true;
    });

    // Финальное подтверждение и передача данных в Лабораторию
    const handleConfirm = () => {
        if (!isSelectionComplete) {
            toast.warn("Необходимо выбрать источник для всех компонентов, где это требуется.");
            return;
        }

        // Собираем финальный, однозначный список компонентов для Лаборатории
        const finalComponents = plan.required_ingredients.map(ing => {
            let sourceBatch;
            if (ing.sources.length === 1) {
                // Если источник всего один, берем его
                sourceBatch = ing.sources[0];
            } else {
                // Если источников несколько, находим тот, что выбрал пользователь
                const selectedBatchId = selections[ing.grape_sort_id];
                sourceBatch = ing.sources.find(s => s.id === selectedBatchId);
            }

            return {
                id: sourceBatch.id,
                name: sourceBatch.name,
                availableVolume: parseFloat(sourceBatch.current_volume),
                usedVolume: ing.required_volume,
            };
        });

        // Передаем в onConfirm объект с именем будущего купажа и списком компонентов
        onConfirm({
            name: plan.recipe_name,
            components: finalComponents
        });
    };

    // Рендер-заглушка на случай, если план еще не загрузился
    if (!plan) {
        return (
            <Modal show={show} onHide={onClose} centered>
                <Modal.Body className="text-center p-4">
                    <Spinner animation="border" />
                    <p className="mt-3 mb-0">Расчет плана сборки...</p>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onClose} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>План сборки для "{plan.recipe_name}"</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Система проанализировала ваш рецепт и подобрала подходящие партии для создания купажа объемом <strong>{plan.target_volume} л</strong>.</p>
                <ListGroup variant="flush">
                    {plan.required_ingredients.map(ingredient => (
                        <ListGroup.Item key={ingredient.grape_sort_id} className="mb-3 p-3 border rounded">
                            <Row className="align-items-center">
                                <Col md={4}>
                                    {/* Отображаем имя сорта, а не ID */}
                                    <h5 className="mb-2">{ingredient.grape_sort_name}</h5>
                                    <div>Нужно: <Badge bg="primary">{ingredient.required_volume.toFixed(2)} л</Badge></div>
                                    <div className="mt-1">Доступно: <Badge bg={ingredient.total_available >= ingredient.required_volume ? "success" : "danger"}>{ingredient.total_available.toFixed(2)} л</Badge></div>
                                </Col>
                                <Col md={8}>
                                    <h6>Источники:</h6>
                                    {ingredient.sources.length === 0 && <p className="text-danger mb-0">Подходящие моносортовые партии не найдены.</p>}

                                    {ingredient.sources.length === 1 && <p className="mb-0">Автоматически выбрана партия: <strong>{ingredient.sources[0].name}</strong> (объем: {ingredient.sources[0].current_volume} л)</p>}

                                    {ingredient.sources.length > 1 && (
                                        <Form>
                                            <p className="mb-2">Найдено несколько источников. Пожалуйста, выберите один:</p>
                                            {ingredient.sources.map(source => (
                                                <Form.Check
                                                    type="radio"
                                                    key={source.id}
                                                    // Уникальный ID для input
                                                    id={`radio-${ingredient.grape_sort_id}-${source.id}`}
                                                    // Группируем радиокнопки по ID сорта
                                                    name={`radio-group-${ingredient.grape_sort_id}`}
                                                    label={`${source.name} (объем: ${source.current_volume} л)`}
                                                    // При изменении сохраняем выбор
                                                    onChange={() => handleSelectionChange(ingredient.grape_sort_id, source.id)}
                                                />
                                            ))}
                                        </Form>
                                    )}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Отмена</Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    // Кнопка активна только если план выполним и пользователь сделал весь необходимый выбор
                    disabled={!plan.is_possible || !isSelectionComplete}
                >
                    Перейти в Лабораторию
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AssemblyPlanModal;
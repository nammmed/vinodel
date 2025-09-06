import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { getBottlingPlan, executeBottling } from '../services/api';
import { toast } from 'react-toastify';

function BottlingWizardModal({ show, onClose, batch, supplies, onSuccess }) {
    const [step, setStep] = useState(1);
    const [volume, setVolume] = useState(batch?.current_volume || 1);
    const [bottleId, setBottleId] = useState('');

    const [plan, setPlan] = useState(null);
    const [loadingPlan, setLoadingPlan] = useState(false);

    const [selections, setSelections] = useState({});
    const [notes, setNotes] = useState('');

    // Сброс состояния при закрытии
    useEffect(() => {
        if (!show) {
            setTimeout(() => { // С задержкой, чтобы не было видно сброса при анимации
                setStep(1);
                setVolume(batch?.current_volume || 1);
                setBottleId('');
                setPlan(null);
                setSelections({});
            }, 300);
        }
    }, [show, batch]);

    // Обработчик перехода к расчету плана
    const handleCalculatePlan = async () => {
        if (!bottleId || volume <= 0) {
            toast.warn("Выберите тип бутылки и укажите объем.");
            return;
        }
        setLoadingPlan(true);
        try {
            const response = await getBottlingPlan(batch.id, volume, bottleId);
            setPlan(response.data);
            setStep(2); // Переходим на шаг 2
        } catch (error) {
            toast.error(error.response?.data?.error || 'Ошибка при расчете плана.');
        } finally {
            setLoadingPlan(false);
        }
    };

    // Обработчик выбора расходника на шаге 2
    const handleSelectionChange = (category, supplyId) => {
        setSelections(prev => ({ ...prev, [category]: supplyId }));
    };

    // Финальное подтверждение
    const handleExecute = async () => {
        const supplies_used = plan.map(p => {
            const selectedId = selections[p.category] || p.selected_supply?.id;
            return {
                supply_id: selectedId,
                quantity: p.required_quantity
            }
        }).filter(s => s.supply_id); // Отправляем только те, что выбраны

        try {
            await executeBottling(batch.id, {
                volume_to_bottle: volume,
                supplies_used: supplies_used,
                notes: notes,
            });
            toast.success("Вино успешно розлито!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Ошибка при операции розлива.');
        }
    };

    const bottleOptions = supplies.filter(s => s.category === 'Бутылка');

    return (
        <Modal show={show} onHide={onClose} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Мастер Розлива: {batch?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 && (
                    <>
                        <h4>Шаг 1: Параметры розлива</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Объем для розлива (л)</Form.Label>
                            <Form.Control type="number" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} max={batch?.current_volume} min="0.1" step="0.1" />
                            <Form.Text>Доступно: {batch?.current_volume} л</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Тип бутылки</Form.Label>
                            <Form.Select value={bottleId} onChange={e => setBottleId(e.target.value)}>
                                <option value="">Выберите...</option>
                                {bottleOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                    </>
                )}
                {step === 2 && plan && (
                    <>
                        <h4>Шаг 2: Подбор расходников</h4>
                        <p>Для розлива <strong>{volume} л</strong> потребуется <strong>{plan[0].required_quantity}</strong> бутылок. Система подобрала расходники:</p>
                        <ListGroup>
                            {plan.map(p => {
                                const selectedId = selections[p.category] || p.selected_supply?.id;
                                const selected = p.available_supplies.find(s => s.id == selectedId);
                                const hasEnough = selected ? selected.quantity >= p.required_quantity : false;

                                return (
                                    <ListGroup.Item key={p.category}>
                                        <Row>
                                            <Col md={3}><strong>{p.category}</strong><br/><small>Нужно: {p.required_quantity} шт.</small></Col>
                                            <Col md={6}>
                                                <Form.Select size="sm" value={selectedId || ''} onChange={(e) => handleSelectionChange(p.category, e.target.value)}>
                                                    <option value="">Не использовать</option>
                                                    {p.available_supplies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </Form.Select>
                                            </Col>
                                            <Col md={3}>
                                                {selected && (
                                                    <Badge bg={hasEnough ? 'success' : 'danger'}>
                                                        На складе: {selected.quantity} шт.
                                                    </Badge>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        <Form.Group className="mt-3">
                            <Form.Label>Примечания к розливу</Form.Label>
                            <Form.Control as="textarea" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
                        </Form.Group>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                {step === 1 && (
                    <>
                        <Button variant="secondary" onClick={onClose}>Отмена</Button>
                        <Button variant="primary" onClick={handleCalculatePlan} disabled={loadingPlan}>
                            {loadingPlan ? <Spinner size="sm" /> : 'Рассчитать План'}
                        </Button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <Button variant="secondary" onClick={() => setStep(1)}>Назад</Button>
                        <Button variant="success" onClick={handleExecute}>Подтвердить Розлив</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default BottlingWizardModal;
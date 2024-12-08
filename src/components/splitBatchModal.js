import {Modal, Row, Col, Alert, Form, Button, ProgressBar} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {TrashFill} from 'react-bootstrap-icons'

function SplitBatchModal({batch, onClose, onSplit, error}) {
    const [newBatches, setNewBatches] = useState([]);
    const [localError, setLocalError] = useState('');
    const [processType, setProcessType] = useState('Разделение партии');
    const [customProcessType, setCustomProcessType] = useState('');

    const processTypes = [
        'Разделение партии',
        'Отбор пробы',
        'Отбор для дегустации',
        'Отбор для анализа',
        'Отделение части партии',
        'Отбор для купажирования',
        'Отбор для дальнейшей обработки',
        'Разделение партии на две части',
        'Значительное уменьшение объема',
        'Другое'
    ];

    const styles = {
        volumeInfo: {
            fontSize: '0.9rem',
            padding: '10px 15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            marginBottom: '1rem'
        },
        warningText: {
            color: '#dc3545'
        },
        successText: {
            color: '#198754'
        }
    };

// Вспомогательные функции
    const formatVolume = (volume) => {
        return parseFloat(volume).toFixed(2);
    };

    const validateVolumes = (newBatches, totalVolume) => {
        const sum = newBatches.reduce((acc, batch) => acc + (parseFloat(batch.volume) || 0), 0);
        return Math.abs(sum - totalVolume) < 0.001; // Учитываем погрешность вычислений с плавающей точкой
    };

// Обработчик изменений
    const handleChange = (index, field, value) => {
        if (field === 'processType') {
            setProcessType(value);
            if (value !== 'Другое') {
                setCustomProcessType('');
            }
        } else if (field === 'customProcessType') {
            setCustomProcessType(value);
        } else {
            const updatedBatches = [...newBatches];
            if (field === 'volume') {
                // Проверяем, чтобы новый объем не превышал доступный
                const otherVolumes = newBatches
                    .filter((_, i) => i !== index)
                    .reduce((sum, b) => sum + (parseFloat(b.volume) || 0), 0);
                const maxAvailable = batch.current_volume - otherVolumes;
                value = Math.min(Math.max(0, value), maxAvailable);
            }
            updatedBatches[index] = {
                ...updatedBatches[index],
                [field]: value
            };
            setNewBatches(updatedBatches);
        }
    };

// Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        const validationErrors = [];

        // Проверка названий
        for (const newBatch of newBatches) {
            if (!newBatch.name.trim()) {
                validationErrors.push('Название партии не может быть пустым');
            }
        }

        // Проверка объемов
        if (!validateVolumes(newBatches, batch.current_volume)) {
            validationErrors.push('Необходимо распределить весь доступный объем');
        }

        // Проверка типа процесса
        if (processType === 'Другое' && !customProcessType.trim()) {
            validationErrors.push('Введите название процесса');
        }

        if (validationErrors.length > 0) {
            setLocalError(validationErrors.join('\n'));
            return;
        }

        try {
            const dataToSend = {
                batchId: batch.id,
                newBatches,
                processType: processType === 'Другое' ? customProcessType : processType
            };
            await onSplit(dataToSend);
        } catch (error) {
            setLocalError(error.message);
        }
    };

    // Вычисление остатка
    const calculateRemaining = () => {
        const currentTotalVolume = newBatches.reduce((sum, b) => sum + (parseFloat(b.volume) || 0), 0);
        return Math.max(0, parseFloat(batch.current_volume) - currentTotalVolume).toFixed(2);
    };

    const generateBatchName = (index) => {
        const baseName = batch.name.replace(/\s*\(часть \d+\)$/, '');

        if (newBatches.length === 1) {
            return baseName;
        } else if (newBatches.length === 2) {
            return `${baseName} (${index === 0 ? 'основная' : 'дополнительная'})`;
        } else {
            return `${baseName} (часть ${index + 1})`;
        }
    };

    const handleAddBatch = () => {
        const remainingVolume = calculateRemaining();
        const newIndex = newBatches.length;

        setNewBatches(prevBatches => {
            const updatedBatches = [
                ...prevBatches,
                {
                    name: generateBatchName(newIndex, prevBatches.length + 1),
                    volume: remainingVolume > 0 ? parseFloat(remainingVolume) : 0,
                    notes: ''
                }
            ];
            return updatedBatches;
        });
    };

    const handleRemoveBatch = (indexToRemove) => {
        if (newBatches.length > 1) {
            setNewBatches(prevBatches => {
                const updatedBatches = prevBatches
                    .filter((_, index) => index !== indexToRemove)
                    .map((batch, index) => ({
                        ...batch,
                        name: generateBatchName(index, prevBatches.length - 1)
                    }));
                return updatedBatches;
            });
        }
    };

    useEffect(() => {
        setNewBatches([{
            name: generateBatchName(0, 1),
            volume: batch.current_volume,
            notes: ''
        }]);
    }, [batch]);

    useEffect(() => {
        if (newBatches.length > 0) {
            setNewBatches(prevBatches =>
                prevBatches.map((batch, index) => ({
                    ...batch,
                    name: generateBatchName(index, prevBatches.length)
                }))
            );
        }
    }, [newBatches.length]);

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Разделить партию {batch.name}
                </Modal.Title>
            </Modal.Header>

            {/* Информационная панель с остатком */}
            <div className="bg-light p-3 border-bottom" style={styles.volumeInfo}>
                <Row>
                    <Col>
                        <strong>Исходный объем:</strong> {formatVolume(batch.current_volume)} л
                    </Col>
                    <Col>
                        <strong>Распределено:</strong> {
                        formatVolume(batch.current_volume - calculateRemaining())
                    } л
                    </Col>
                    <Col>
                        <strong>Остаток:</strong>
                        <span style={calculateRemaining() > 0 ? styles.warningText : styles.successText}>
                            {' '}{formatVolume(calculateRemaining())} л
                        </span>
                    </Col>
                </Row>
            </div>

            <Modal.Body>
                {(error || localError) && (
                    <Alert variant="danger">
                        {error || localError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="processType" className="mb-3">
                        <Form.Label>Тип процесса</Form.Label>
                        <Form.Select
                            value={processType}
                            onChange={(e) => handleChange(null, 'processType', e.target.value)}
                        >
                            {processTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {processType === 'Другое' && (
                        <Form.Group controlId="customProcessType" className="mb-3">
                            <Form.Label>Введите название процесса</Form.Label>
                            <Form.Control
                                type="text"
                                value={customProcessType}
                                onChange={(e) => handleChange(null, 'customProcessType', e.target.value)}
                                required
                            />
                        </Form.Group>
                    )}

                    {/* Список партий */}
                    {newBatches.map((newBatch, index) => (
                        <div key={index} className="border rounded p-3 mb-3">
                            <Row className="mb-3">
                                <Col xs={12} md={6}>
                                    <Form.Group controlId={`name-${index}`}>
                                        <Form.Label>Название</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newBatch.name}
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId={`volume-${index}`}>
                                        <Form.Label>Объем (л)</Form.Label>
                                        <div className="d-flex">
                                            <Form.Control
                                                type="number"
                                                step="0.1"
                                                value={newBatch.volume}
                                                onChange={(e) => handleChange(index, 'volume', parseFloat(e.target.value))}
                                                required
                                                className="flex-grow-1"
                                            />
                                            {calculateRemaining() > 0 && (
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => {
                                                        const remaining = calculateRemaining();
                                                        handleChange(index, 'volume',
                                                            parseFloat(newBatch.volume) + parseFloat(remaining)
                                                        );
                                                    }}
                                                    className="ms-1"
                                                    style={{whiteSpace: 'nowrap'}}
                                                >
                                                    +{calculateRemaining()}л
                                                </Button>
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={2} className="d-flex align-items-end">
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemoveBatch(index)}
                                        disabled={newBatches.length === 1}
                                        className="w-100"
                                    >
                                        <TrashFill size={16}/>
                                    </Button>
                                </Col>
                            </Row>

                            <Form.Group controlId={`notes-${index}`}>
                                <Form.Label>Примечания</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={newBatch.notes}
                                    onChange={(e) => handleChange(index, 'notes', e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    ))}

                    {/* Прогресс-бар распределения объема */}
                    <div className="mb-3">
                        <small className="text-muted">Распределение объема:</small>
                        <ProgressBar style={{height: '2rem'}}> {/* Увеличиваем высоту для лучшей читаемости */}
                            {newBatches.map((newBatch, index) => {
                                const percentage = (parseFloat(newBatch.volume) / parseFloat(batch.current_volume)) * 100;
                                return (
                                    <ProgressBar
                                        key={index}
                                        variant={index % 2 ? "info" : "primary"}
                                        now={percentage}
                                        label={
                                            percentage > 10 ? // Показываем метку только если есть достаточно места
                                                `${parseFloat(newBatch.volume).toFixed(2)}л (${percentage.toFixed(1)}%)`
                                                : ''
                                        }
                                        style={{
                                            transition: 'width 0.3s ease',
                                            minWidth: percentage > 0 ? '2rem' : '0' // Минимальная ширина для маленьких значений
                                        }}
                                    />
                                );
                            })}
                        </ProgressBar>
                        {/* Добавляем легенду под прогресс-баром */}
                        <div className="mt-2 d-flex flex-wrap gap-3">
                            {newBatches.map((newBatch, index) => (
                                <small key={index} className="text-muted">
                                    Часть {index + 1}: {parseFloat(newBatch.volume).toFixed(2)}л
                                    ({((parseFloat(newBatch.volume) / parseFloat(batch.current_volume)) * 100).toFixed(1)}%)
                                </small>
                            ))}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={onClose}>
                            Отмена
                        </Button>
                        <div>
                            <Button
                                variant="primary"
                                onClick={handleAddBatch}
                                className="me-2"
                                disabled={calculateRemaining() <= 0}
                            >
                                Добавить партию
                            </Button>
                            <Button
                                variant="success"
                                type="submit"
                                disabled={calculateRemaining() > 0}
                            >
                                Разделить
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SplitBatchModal;
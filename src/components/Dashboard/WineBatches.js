// src/components/Dashboard/WineBatches.js
import React, { useState } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SplitBatchModal from '../splitBatchModal';
import {Alert} from "bootstrap"; // Импортируем компонент модального окна

function WineBatches({ batches, onSplitBatch, error, onSplitError  }) { // Добавляем error в props
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [batchToSplit, setBatchToSplit] = useState(null);
    const [splitModalError, setSplitModalError] = useState(null);

    const handleSplit = async (data) => {
        try {
            await onSplitBatch(data);
            setShowSplitModal(false);
            setBatchToSplit(null);
            setSplitModalError(null);
        } catch (err) {
            setSplitModalError(err.message);
        }
    };

    return (
        <Row className="mb-4">
            <Col>
                <Card>
                    <Card.Header>
                        <Row className="align-items-center">
                            <Col xs={12} md={6}>
                                <h5 className="mb-0">Партии вина в производстве</h5>
                            </Col>
                            <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                                <Button
                                    as={Link}
                                    to="/batches"
                                    variant="primary"
                                    className="me-2 d-none d-md-inline-block"
                                >
                                    Управление партиями
                                </Button>
                                <Button
                                    as={Link}
                                    to="/batches/new"
                                    variant="success"
                                    className="d-none d-md-inline-block"
                                >
                                    Добавить партию
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        {/* Выводим ошибку, если она есть */}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Table striped hover responsive>
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th className="d-none d-md-table-cell">Начальный объем (л)</th>
                                <th>Текущий объем (л)</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {batches.map((batch) => (
                                <tr key={batch.id}>
                                    <td>{batch.name}</td>
                                    <td className="d-none d-md-table-cell">{batch.initial_volume}</td>
                                    <td>{batch.current_volume}</td>
                                    <td>{batch.status}</td>
                                    <td>
                                        <Button onClick={() => {
                                            setBatchToSplit(batch);
                                            setShowSplitModal(true);
                                        }}>Разделить</Button>
                                    </td>
                                </tr>
                            )) || (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Нет данных о партиях
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>

                        {/* Модальное окно для разделения партий */}
                        {showSplitModal && (
                            <SplitBatchModal
                                batch={batchToSplit}
                                onClose={() => {
                                    setShowSplitModal(false);
                                    setBatchToSplit(null);
                                    setSplitModalError(null);
                                }}
                                onSplit={handleSplit}
                                error={splitModalError}
                            />
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default WineBatches;
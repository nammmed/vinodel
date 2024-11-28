// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';

function Dashboard() {
    const [batches, setBatches] = useState([]);
    const [grapes, setGrapes] = useState([]);

    useEffect(() => {
        // Используем существующие эндпоинты API
        const fetchData = async () => {
            try {
                const [batchesResponse, grapesResponse] = await Promise.all([
                    axios.get('/batches'),
                    axios.get('/grapes')
                ]);

                setBatches(batchesResponse.data);
                setGrapes(grapesResponse.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h2 className="mb-4">Винодельня</h2>

            {/* Партии вина */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Партии вина в производстве</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table striped hover>
                                <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Начальный объем (л)</th>
                                    <th>Текущий объем (л)</th>
                                    <th>Статус</th>
                                </tr>
                                </thead>
                                <tbody>
                                {batches.map(batch => (
                                    <tr key={batch.id}>
                                        <td>{batch.name}</td>
                                        <td>{batch.initial_volume}</td>
                                        <td>{batch.current_volume}</td>
                                        <td>{batch.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Виноград в наличии */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Виноград в наличии</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table striped hover>
                                <thead>
                                <tr>
                                    <th>Сорт</th>
                                    <th>Количество (кг)</th>
                                    <th>Дата закупки</th>
                                    <th>Поставщик</th>
                                </tr>
                                </thead>
                                <tbody>
                                {grapes.map(grape => (
                                    <tr key={grape.id}>
                                        <td>{grape.sort}</td>
                                        <td>{grape.quantity}</td>
                                        <td>{new Date(grape.date_purchased).toLocaleDateString()}</td>
                                        <td>{grape.supplier}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
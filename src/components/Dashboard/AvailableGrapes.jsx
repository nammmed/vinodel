// src/components/Dashboard/AvailableGrapes.js
import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AvailableGrapes({ grapes, onVinify, onShowAddGrapeModal }) {
    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header>
                        <Row className="align-items-center">
                            <Col xs={12} md={6}>
                                <h5 className="mb-0">Виноград в наличии</h5>
                            </Col>
                            <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                                <Button
                                    as={Link}
                                    to="/grapes"
                                    variant="primary"
                                    className="me-2 d-none d-md-inline-block"
                                >
                                    Управление виноградом
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={onShowAddGrapeModal} // Используем переданный обработчик
                                    className="d-none d-md-inline-block"
                                >
                                    Добавить виноград
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Table striped hover responsive>
                            <thead>
                            <tr>
                                <th>Сорт</th>
                                <th>Количество (кг)</th>
                                <th className="d-none d-md-table-cell">Дата закупки</th>
                                <th>Поставщик</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {grapes.map((grape) => (
                                <tr key={grape.id}>
                                    <td>{grape.sort_name}</td>
                                    <td>{grape.quantity}</td>
                                    <td className="d-none d-md-table-cell">
                                        {new Date(grape.date_purchased).toLocaleDateString()}
                                    </td>
                                    <td>{grape.supplier}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => onVinify(grape)}
                                        >
                                            Винифицировать
                                        </Button>
                                    </td>
                                </tr>
                            )) || (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Нет данных о винограде
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default AvailableGrapes;
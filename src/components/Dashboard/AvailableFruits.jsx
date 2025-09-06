import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AvailableFruits({ fruits, onStartProcessing, onShowAddFruitModal }) {
    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header>
                        <Row className="align-items-center">
                            <Col xs={12} md={6}>
                                <h5 className="mb-0">Запасы плодов 🍇</h5>
                            </Col>
                            <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                                <Button as={Link} to="/fruits" variant="primary" className="me-2">
                                    Все запасы
                                </Button>
                                <Button variant="success" onClick={onShowAddFruitModal}>
                                    Добавить плод
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Table striped hover responsive>
                            <thead>
                            <tr>
                                <th>Название (сорт)</th>
                                <th>Количество (кг)</th>
                                <th className="d-none d-md-table-cell">Дата поступления</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {fruits && fruits.length > 0 ? fruits.map((fruit) => (
                                <tr key={fruit.id}>
                                    <td>{fruit.sort_name}</td>
                                    <td>{fruit.quantity}</td>
                                    <td className="d-none d-md-table-cell">
                                        {new Date(fruit.date_purchased).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Button variant="primary" size="sm" onClick={() => onStartProcessing(fruit)}>
                                            Создать партию
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        Ваш погреб пуст. Время добавить плоды!
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

export default AvailableFruits;
import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Table, Modal, Form } from 'react-bootstrap';
import useSupplies from '../hooks/useSupplies';

// Компонент-форма для добавления расходников (можно вынести в отдельный файл)
const SupplyForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [volumeMl, setVolumeMl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, category, volume_ml: category === 'Бутылка' ? volumeMl : null });
        // Сброс формы
        setName(''); setCategory(''); setVolumeMl('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Бутылка Бордо 0.75л" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Категория</Form.Label>
                <Form.Select value={category} onChange={e => setCategory(e.target.value)} required>
                    <option value="">Выберите...</option>
                    <option value="Бутылка">Бутылка</option>
                    <option value="Пробка">Пробка</option>
                    <option value="Этикетка">Этикетка</option>
                    <option value="Колпачок">Колпачок</option>
                    <option value="Другое">Другое</option>
                </Form.Select>
            </Form.Group>
            {category === 'Бутылка' && (
                <Form.Group className="mb-3">
                    <Form.Label>Объем (мл)</Form.Label>
                    <Form.Control type="number" value={volumeMl} onChange={e => setVolumeMl(e.target.value)} placeholder="750" required />
                </Form.Group>
            )}
            <Button type="submit">Создать</Button>
        </Form>
    );
}

// Основной компонент страницы
function SuppliesPage() {
    const { supplies, loading, handleCreateSupply, handleAddStock } = useSupplies();
    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [selectedSupply, setSelectedSupply] = useState(null);
    const [addQuantity, setAddQuantity] = useState(1);

    const handleAddStockClick = (supply) => {
        setSelectedSupply(supply);
        setShowAddStockModal(true);
    };

    const handleAddStockSubmit = () => {
        if (addQuantity > 0) {
            handleAddStock(selectedSupply.id, { quantity: addQuantity });
        }
        setShowAddStockModal(false);
        setAddQuantity(1);
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h2>Склад расходников</h2>
                    <Table striped bordered hover>
                        <thead>
                        <tr><th>Название</th><th>Категория</th><th>Остаток</th><th>Действия</th></tr>
                        </thead>
                        <tbody>
                        {supplies.map(s => (
                            <tr key={s.id}>
                                <td>{s.name} {s.volume_ml && `(${s.volume_ml} мл)`}</td>
                                <td>{s.category}</td>
                                <td>{s.quantity} шт.</td>
                                <td>
                                    <Button size="sm" onClick={() => handleAddStockClick(s)}>Приход</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header>Добавить новый расходник</Card.Header>
                        <Card.Body>
                            <SupplyForm onSubmit={handleCreateSupply} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Модальное окно для пополнения запаса */}
            <Modal show={showAddStockModal} onHide={() => setShowAddStockModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Приход: {selectedSupply?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Количество</Form.Label>
                        <Form.Control type="number" value={addQuantity} onChange={e => setAddQuantity(parseInt(e.target.value))} min="1" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddStockModal(false)}>Отмена</Button>
                    <Button variant="primary" onClick={handleAddStockSubmit}>Добавить</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SuppliesPage;
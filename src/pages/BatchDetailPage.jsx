import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, ListGroup, Badge } from 'react-bootstrap';
import { getBatchDetails } from '../services/api';
import useSupplies from '../hooks/useSupplies';
import BottlingWizardModal from '../components/BottlingWizardModal';

// Маленький компонент для отображения состава
const CompositionList = ({ composition }) => (
    <ListGroup variant="flush">
        {composition.map(c => (
            <ListGroup.Item key={c.sort_name} className="d-flex justify-content-between align-items-center">
                {c.sort_name}
                <Badge bg="info">{c.percentage.toFixed(2)}%</Badge>
            </ListGroup.Item>
        ))}
    </ListGroup>
);

// Маленький компонент для отображения замеров
const MeasurementList = ({ measurements }) => (
    <div className="mt-2">
        {measurements.map(m => (
            <small key={m.id} className="text-muted d-block">
                - {m.type}: <strong>{m.value} {m.unit}</strong> ({new Date(m.date).toLocaleDateString()})
            </small>
        ))}
    </div>
);

function BatchDetailPage() {
    const { batchId } = useParams(); // Получаем ID из URL
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояния для модальных окон
    const [showBottlingWizard, setShowBottlingWizard] = useState(false);

    const { supplies } = useSupplies(); // Получаем расходники для Мастера Розлива

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await getBatchDetails(batchId);
            setDetails(response.data);
        } catch (err) {
            setError('Не удалось загрузить данные о партии.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [batchId]);

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
    if (!details) return null;

    const { batch_info, composition, process_logs } = details;

    return (
        <Container>
            <Row>
                {/* Левая колонка с основной информацией и действиями */}
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Header>
                            <Card.Title className="mb-0">Паспорт партии 🛂</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <h3>{batch_info.name}</h3>
                            <p><strong>Статус:</strong> {batch_info.status || 'В работе'}</p>
                            <p><strong>Текущий объем:</strong> {batch_info.current_volume} л</p>
                            <p><strong>Дата создания:</strong> {new Date(batch_info.created_at).toLocaleDateString()}</p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>Состав</Card.Header>
                        <CompositionList composition={composition} />
                    </Card>

                    <Card>
                        <Card.Header>Действия</Card.Header>
                        <Card.Body>
                            <Button variant="primary" className="w-100 mb-2" onClick={() => setShowBottlingWizard(true)}>
                                Разлить по бутылкам 🍾
                            </Button>
                            <Button variant="outline-secondary" className="w-100">Добавить процесс ➕</Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Правая колонка с историей процессов */}
                <Col md={8}>
                    <h3>История партии  Timeline</h3>
                    {process_logs.map(log => (
                        <Card key={log.id} className="mb-3">
                            <Card.Header className="d-flex justify-content-between">
                                <strong>{log.process_name}</strong>
                                <span>{new Date(log.start_date).toLocaleDateString()}</span>
                            </Card.Header>
                            <Card.Body>
                                {log.notes && <Card.Text>{log.notes}</Card.Text>}
                                {log.measurements.length > 0 && <MeasurementList measurements={log.measurements} />}
                                <Button variant="link" size="sm" className="mt-2">Добавить замер</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>

            {/* Модальное окно Мастера Розлива */}
            <BottlingWizardModal
                show={showBottlingWizard}
                onClose={() => setShowBottlingWizard(false)}
                batch={batch_info}
                supplies={supplies}
                onSuccess={fetchDetails} // После успешного розлива обновляем всю страницу
            />
        </Container>
    );
}

export default BatchDetailPage;
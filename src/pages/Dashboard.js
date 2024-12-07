import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, { createGrape, createBatchFromGrape } from '../services/api';
import { useMediaQuery } from 'react-responsive';
import GrapeForm from '../components/GrapeForm';
import VinifyForm from '../components/VinifyForm';

function Dashboard() {
    const [batches, setBatches] = useState([]);
    const [grapes, setGrapes] = useState([]);
    const [showGrapeModal, setShowGrapeModal] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [showVinifyModal, setShowVinifyModal] = useState(false);
    const [selectedGrape, setSelectedGrape] = useState(null);

    const handleShowGrapeModal = () => {
        setShowGrapeModal(true);
    };

    const handleCloseGrapeModal = () => {
        setShowGrapeModal(false);
    };

    const handleAddGrape = async (grapeData) => {
        try {
            await createGrape(grapeData);
            handleCloseGrapeModal();
            // Обновляем данные винограда
            fetchGrapes();
        } catch (err) {
            setError('Ошибка при добавлении винограда');
        }
    };

    const fetchGrapes = async () => {
        try {
            const grapesResponse = await api.get('/grapes');
            setGrapes(grapesResponse.data);
        } catch (error) {
            console.error('Ошибка загрузки данных о винограде:', error);
        }
    };

    const fetchBatches = async () => {
        try {
            const batchesResponse = await api.get('/batches');
            setBatches(batchesResponse.data);
        } catch (error) {
            console.error('Ошибка загрузки данных о партиях:', error);
        }
    };

    const handleVinify = (grape) => {
        setSelectedGrape(grape);
        setShowVinifyModal(true);
    };

    const handleVinifySubmit = async (formData) => {
        try {
            await createBatchFromGrape(selectedGrape.id, formData);
            setShowVinifyModal(false);
            // Обновляем данные о винограде и партиях
            fetchGrapes();
            fetchBatches();
        } catch (error) {
            console.error('Ошибка при создании партии', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchBatches();
                await fetchGrapes();
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setLoading(false);
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
                            {isMobile ? (
                                batches.length > 0 ? (
                                    batches.map((batch) => (
                                        <Card key={batch.id} className="mb-2">
                                            <Card.Body>
                                                <Card.Title>{batch.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>Текущий объем (л):</strong> {batch.current_volume}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Статус:</strong> {batch.status}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center">Нет данных о партиях</div>
                                )
                            ) : (
                                <Table striped hover responsive>
                                    <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th className="d-none d-md-table-cell">Начальный объем (л)</th>
                                        <th>Текущий объем (л)</th>
                                        <th>Статус</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Array.isArray(batches) && batches.length > 0 ? (
                                        batches.map((batch) => (
                                            <tr key={batch.id}>
                                                <td>{batch.name}</td>
                                                <td className="d-none d-md-table-cell">{batch.initial_volume}</td>
                                                <td>{batch.current_volume}</td>
                                                <td>{batch.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                Нет данных о партиях
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Виноград в наличии */}
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
                                        onClick={handleShowGrapeModal}
                                        className="d-none d-md-inline-block"
                                    >
                                        Добавить виноград
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            {isMobile ? (
                                grapes.length > 0 ? (
                                    grapes.map((grape) => (
                                        <Card key={grape.id} className="mb-2">
                                            <Card.Body>
                                                <Card.Title>{grape.sort}</Card.Title>
                                                <Card.Text>
                                                    <strong>Количество (кг):</strong> {grape.quantity}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Поставщик:</strong> {grape.supplier}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center">Нет данных о винограде</div>
                                )
                            ) : (
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
                                    {Array.isArray(grapes) && grapes.length > 0 ? (
                                        grapes.map((grape) => (
                                            <tr key={grape.id}>
                                                <td>{grape.sort}</td>
                                                <td>{grape.quantity}</td>
                                                <td className="d-none d-md-table-cell">
                                                    {new Date(grape.date_purchased).toLocaleDateString()}
                                                </td>
                                                <td>{grape.supplier}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleVinify(grape)}
                                                    >
                                                        Винифицировать
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                Нет данных о винограде
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Модальное окно для добавления винограда */}
            <Modal show={showGrapeModal} onHide={handleCloseGrapeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление винограда</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GrapeForm
                        initialData={null}
                        onSubmit={handleAddGrape}
                        onClose={handleCloseGrapeModal}
                    />
                </Modal.Body>
            </Modal>

            {/* Модальное окно для винификации винограда */}
            <Modal show={showVinifyModal} onHide={() => setShowVinifyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Винификация винограда {selectedGrape?.sort}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <VinifyForm
                        grape={selectedGrape}
                        onSubmit={handleVinifySubmit}
                        onClose={() => setShowVinifyModal(false)}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Dashboard;
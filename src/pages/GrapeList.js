// src/pages/GrapeList.js

import React, {useState, useEffect} from 'react';
import {Table, Card, Button, ButtonGroup, Alert, Modal} from 'react-bootstrap';
import {getGrapes, createGrape, updateGrape, deleteGrape} from '../services/api';
import GrapeForm from '../components/GrapeForm';

function GrapeList() {
    const [grapes, setGrapes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    // Состояния для модальных окон
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add' или 'edit'
    const [currentGrape, setCurrentGrape] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [grapeToDelete, setGrapeToDelete] = useState(null);

    useEffect(() => {
        loadGrapes();
    }, []);

    const loadGrapes = async () => {
        try {
            const response = await getGrapes();
            setGrapes(response.data);
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке данных о винограде');
            setLoading(false);
        }
    };

    // Функции для открытия и закрытия модальных окон
    const handleShowModal = (type, grape = null) => {
        setModalType(type);
        setCurrentGrape(grape);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentGrape(null);
    };

    // Обработчик для добавления нового винограда
    const handleAddGrape = async (grapeData) => {
        await createGrape(grapeData);
        loadGrapes();
    };

    // Обработчик для обновления существующего винограда
    const handleUpdateGrape = async (grapeData) => {
        await updateGrape(currentGrape.id, grapeData);
        loadGrapes();
    };

    // Обработчики удаления
    const handleShowDeleteModal = (grape) => {
        setGrapeToDelete(grape);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setGrapeToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            await deleteGrape(grapeToDelete.id);
            setGrapes(grapes.filter((g) => g.id !== grapeToDelete.id));
            handleCloseDeleteModal();
        } catch (err) {
            setError('Ошибка при удалении винограда');
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Виноград в наличии</h2>
                <Button variant="success" onClick={() => handleShowModal('add')}>
                    Добавить виноград
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table striped hover responsive className="table-fixed">
                        <thead>
                        <tr>
                            <th>Сорт</th>
                            <th>Количество (кг)</th>
                            <th>Дата закупки</th>
                            <th>Стоимость</th>
                            <th>Поставщик</th>
                            <th>Примечания</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {grapes.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    Нет данных о винограде
                                </td>
                            </tr>
                        ) : (
                            grapes.map((grape) => (
                                <tr key={grape.id}>
                                    <td>{grape.sort}</td>
                                    <td>{grape.quantity}</td>
                                    <td>{new Date(grape.date_purchased).toLocaleDateString()}</td>
                                    <td>{grape.cost ? `${grape.cost} ₽` : '-'}</td>
                                    <td>{grape.supplier || '-'}</td>
                                    <td>{grape.notes || '-'}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleShowModal('edit', grape)}
                                            >
                                                Изменить
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleShowDeleteModal(grape)}
                                            >
                                                Удалить
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Модальное окно для добавления и редактирования винограда */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Добавление винограда' : 'Редактирование винограда'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GrapeForm
                        initialData={modalType === 'edit' ? currentGrape : null}
                        onSubmit={modalType === 'add' ? handleAddGrape : handleUpdateGrape}
                        onClose={handleCloseModal}
                    />
                </Modal.Body>
            </Modal>

            {/* Модальное окно подтверждения удаления */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {grapeToDelete && (
                        <p>
                            Вы действительно хотите удалить запись о винограде сорта "
                            {grapeToDelete.sort}"?
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default GrapeList;
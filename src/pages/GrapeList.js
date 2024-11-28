// src/pages/GrapeList.js

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Alert, Modal } from 'react-bootstrap'; // добавляем Modal
import { Link } from 'react-router-dom';
import { getGrapes, deleteGrape } from '../services/api';

function GrapeList() {
    const [grapes, setGrapes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    // Состояния для модального окна подтверждения удаления
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

    // Функция для открытия модального окна подтверждения удаления
    const handleShowDeleteModal = (grape) => {
        setGrapeToDelete(grape);
        setShowDeleteModal(true);
    };

    // Функция для закрытия модального окна
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setGrapeToDelete(null);
    };

    // Функция удаления
    const handleDelete = async () => {
        try {
            await deleteGrape(grapeToDelete.id);
            setGrapes(grapes.filter(g => g.id !== grapeToDelete.id));
            handleCloseDeleteModal();
        } catch (err) {
            setError('Ошибка при удалении винограда');
        }
    };


    // Функция редактирования
    const handleEdit = (grape) => {
        // Пока просто перенаправляем на страницу редактирования
        // Позже можно сделать модальное окно или отдельную страницу
        window.location.href = `/grapes/${grape.id}/edit`;
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Виноград в наличии</h2>
                <Button
                    as={Link}
                    to="/grapes/new"
                    variant="success"
                >
                    Добавить виноград
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table striped hover responsive>
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
                            grapes.map(grape => (
                                <tr key={grape.id}>
                                    <td>{grape.sort}</td>
                                    <td>{grape.quantity}</td>
                                    <td>{new Date(grape.date_purchased).toLocaleDateString()}</td>
                                    <td>{grape.cost ? `${grape.cost} ₽` : '-'}</td>
                                    <td>{grape.supplier || '-'}</td>
                                    <td>{grape.notes || '-'}</td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEdit(grape)}
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
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Модальное окно подтверждения удаления */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {grapeToDelete && (
                        <p>Вы действительно хотите удалить запись о винограде сорта "{grapeToDelete.sort}"?</p>
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
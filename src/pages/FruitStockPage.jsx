import React, { useState } from 'react';
import { Table, Card, Button, ButtonGroup, Alert, Modal, Spinner } from 'react-bootstrap';
import { deleteGrape, createBatchFromGrape } from '../services/api';
import FruitStockForm from '../components/FruitStockForm';
import NewBatchForm from "../components/NewBatchForm";
import useFruitStock from '../hooks/useFruitStock';
import { toast } from "react-toastify";

function FruitStockPage() {
    const { fruits, loading, error, handleAddFruit, handleUpdateFruit, fetchFruits } = useFruitStock();

    const [modalType, setModalType] = useState(''); // 'add' или 'edit'
    const [showFormModal, setShowFormModal] = useState(false);
    const [showNewBatchModal, setShowNewBatchModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [currentFruit, setCurrentFruit] = useState(null);
    const [fruitToDelete, setFruitToDelete] = useState(null);

    // --- Обработчики модальных окон ---
    const handleShowFormModal = (type, fruit = null) => {
        setModalType(type);
        setCurrentFruit(fruit);
        setShowFormModal(true);
    };

    const handleCloseModals = () => {
        setShowFormModal(false);
        setShowNewBatchModal(false);
        setShowDeleteModal(false);
        setCurrentFruit(null);
        setFruitToDelete(null);
    };

    const handleShowDeleteModal = (fruit) => {
        setFruitToDelete(fruit);
        setShowDeleteModal(true);
    };

    const handleShowNewBatchModal = (fruit) => {
        setCurrentFruit(fruit);
        setShowNewBatchModal(true);
    }

    // --- Обработчики действий ---
    const handleSubmitForm = async (fruitData) => {
        const success = modalType === 'add'
            ? await handleAddFruit(fruitData)
            : await handleUpdateFruit(currentFruit.id, fruitData);

        if (success) {
            handleCloseModals();
        }
    };

    const handleDelete = async () => {
        try {
            await deleteGrape(fruitToDelete.id);
            toast.success(`Запись о "${fruitToDelete.sort_name}" успешно удалена.`);
            fetchFruits(); // Обновляем список
            handleCloseModals();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ошибка при удалении');
        }
    };

    const handleNewBatchSubmit = async (formData) => {
        try {
            await createBatchFromGrape(currentFruit.id, formData);
            toast.success(`Партия "${formData.batch_name}" успешно создана!`);
            fetchFruits(); // Обновляем и список плодов, т.к. количество уменьшилось
            handleCloseModals();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Ошибка при создании партии');
        }
    };

    // --- Динамические заголовки ---
    const getFormModalTitle = () => {
        if (modalType === 'add') return 'Новый плод в погреб 🍇';
        if (currentFruit) {
            const term = currentFruit.category === 'Виноград' ? 'винограда' : 'плода';
            return `Карточка ${term}: ${currentFruit.sort_name} ✏️`;
        }
        return '';
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Запасы плодов и ягод 🍇</h2>
                <Button variant="success" onClick={() => handleShowFormModal('add')}>
                    Добавить плод
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table striped hover responsive>
                        <thead>
                        <tr>
                            <th>Название (сорт)</th>
                            <th>Количество (кг)</th>
                            <th>Дата поступления</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fruits.length > 0 ? (
                            fruits.map((fruit) => (
                                <tr key={fruit.id}>
                                    <td>{fruit.sort_name}</td>
                                    <td>{fruit.quantity}</td>
                                    <td>{new Date(fruit.date_purchased).toLocaleDateString()}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button size="sm" onClick={() => handleShowNewBatchModal(fruit)}>
                                                Создать партию
                                            </Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleShowFormModal('edit', fruit)}>
                                                Изменить
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleShowDeleteModal(fruit)}>
                                                Удалить
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center">Ваш погреб пуст.</td></tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Модальное окно для добавления/редактирования */}
            <Modal show={showFormModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>{getFormModalTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FruitStockForm
                        initialData={currentFruit}
                        onSubmit={handleSubmitForm}
                        onClose={handleCloseModals}
                    />
                </Modal.Body>
            </Modal>

            {/* Модальное окно для создания партии */}
            <Modal show={showNewBatchModal} onHide={handleCloseModals}>
                <NewBatchForm
                    ingredient={currentFruit}
                    onSubmit={handleNewBatchSubmit}
                    onClose={handleCloseModals}
                />
            </Modal>

            {/* Модальное окно подтверждения удаления */}
            <Modal show={showDeleteModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fruitToDelete && <p>Вы уверены, что хотите удалить запись о: "{fruitToDelete.sort_name}"?</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>Отмена</Button>
                    <Button variant="danger" onClick={handleDelete}>Удалить</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FruitStockPage;
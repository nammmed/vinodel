import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { getRecipes, getAssemblyPlan } from '../services/api';
import useBatches from '../hooks/useBatches';
import BlendLabModal from '../components/BlendLabModal.jsx'; // Лаборатория купажей
import AssemblyPlanModal from "../components/AssemblyPlanModal"; // План сборки купажа
import { toast } from 'react-toastify';

function RecipeList() {
    // Состояния страницы
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояния для управления модальными окнами
    const [showVolumeModal, setShowVolumeModal] = useState(false);
    const [showAssemblyPlanModal, setShowAssemblyPlanModal] = useState(false);
    const [showBlendLab, setShowBlendLab] = useState(false);

    // Данные для передачи между окнами
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [targetVolume, setTargetVolume] = useState(10);
    const [assemblyPlan, setAssemblyPlan] = useState(null);
    const [blendLabData, setBlendLabData] = useState(null);

    const { fetchBatches } = useBatches();

    // Загрузка рецептов при монтировании
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await getRecipes();
                setRecipes(response.data);
            } catch (err) {
                setError('Не удалось загрузить список рецептов.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    // Шаг 1: Пользователь нажимает "Создать купаж", открываем модалку для ввода объема
    const handleCreateBlendClick = (recipe) => {
        setSelectedRecipe(recipe);
        setShowVolumeModal(true);
    };

    // Шаг 2: Пользователь ввел объем и нажал "Продолжить"
    const handleVolumeSubmit = async () => {
        if (!selectedRecipe || targetVolume <= 0) return;

        setShowVolumeModal(false);
        setLoading(true); // Показываем индикатор загрузки на всю страницу

        try {
            const { data: plan } = await getAssemblyPlan(selectedRecipe.id, targetVolume);
            setAssemblyPlan(plan);
            setShowAssemblyPlanModal(true); // Открываем модалку с планом
        } catch (err) {
            toast.error(err.response?.data?.error || "Не удалось рассчитать план сборки.");
        } finally {
            setLoading(false);
        }
    };

    // Шаг 3: Пользователь подтвердил план -> открываем Лабораторию
    const handlePlanConfirm = (data) => {
        setBlendLabData(data); // `data` содержит {name, components}
        setShowAssemblyPlanModal(false);
        setShowBlendLab(true);
    };

    // Шаг 4: Успешное создание купажа в Лаборатории
    const handleBlendSuccess = (data) => {
        toast.success(`Купаж "${data.message.split("'")[1]}" успешно создан!`);
        fetchBatches();
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h2 className="mb-4">Мои рецепты</h2>
            <Row>
                {recipes.length > 0 ? recipes.map(recipe => (
                    <Col md={6} lg={4} key={recipe.id} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{recipe.name}</Card.Title>
                                <Card.Text>{recipe.description || 'Нет описания'}</Card.Text>
                                <Button onClick={() => handleCreateBlendClick(recipe)}>Создать купаж по рецепту</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : <p>У вас пока нет сохраненных рецептов.</p>}
            </Row>

            {/* Модальное окно для ввода объема */}
            <Modal show={showVolumeModal} onHide={() => setShowVolumeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создание купажа "{selectedRecipe?.name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Введите желаемый итоговый объем (л)</Form.Label>
                        <Form.Control
                            type="number"
                            value={targetVolume}
                            onChange={(e) => setTargetVolume(parseFloat(e.target.value))}
                            min="0.1"
                            step="0.1"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowVolumeModal(false)}>Отмена</Button>
                    <Button variant="primary" onClick={handleVolumeSubmit}>Продолжить</Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно с планом сборки */}
            <AssemblyPlanModal
                show={showAssemblyPlanModal}
                onClose={() => setShowAssemblyPlanModal(false)}
                plan={assemblyPlan}
                onConfirm={handlePlanConfirm}
            />

            {/* Наша Лаборатория */}
            <BlendLabModal
                show={showBlendLab}
                onClose={() => setShowBlendLab(false)}
                batches={blendLabData} // Передаем рассчитанные данные
                onSuccess={handleBlendSuccess}
            />
        </Container>
    );
}

export default RecipeList;
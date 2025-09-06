import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import useBatches from '../hooks/useBatches';
import useFruitStock from '../hooks/useFruitStock';
import FruitStockForm from '../components/FruitStockForm';
import NewBatchForm from '../components/NewBatchForm';
import { createBatchFromGrape } from '../services/api';
import WineBatches from "../components/Dashboard/WineBatches";
import AvailableFruits from "../components/Dashboard/AvailableFruits";
import BlendLabModal from "../components/BlendLabModal";
import { toast } from "react-toastify";

function Dashboard() {
    const { batches, loading: batchesLoading, error: batchesError, handleSplitBatch, fetchBatches } = useBatches();
    const { fruits, loading: fruitsLoading, error: fruitsError, handleAddFruit, fetchFruits } = useFruitStock();

    const [showAddFruitModal, setShowAddFruitModal] = useState(false);
    const [showNewBatchModal, setShowNewBatchModal] = useState(false);
    const [fruitToProcess, setFruitToProcess] = useState(null);
    const [selectedBatches, setSelectedBatches] = useState(new Set());
    const [showBlendLab, setShowBlendLab] = useState(false);

    useEffect(() => {
        const availableBatchIds = new Set(batches.map(b => b.id));
        if (selectedBatches.size > 0) {
            const newSelection = new Set();
            for (const id of selectedBatches) {
                if (availableBatchIds.has(id)) {
                    newSelection.add(id);
                }
            }
            if (newSelection.size !== selectedBatches.size) {
                setSelectedBatches(newSelection);
            }
        }
    }, [batches, selectedBatches]);

    const handleAddFruitSubmit = async (fruitData) => {
        const success = await handleAddFruit(fruitData);
        if (success) {
            setShowAddFruitModal(false);
        }
    };

    const handleStartProcessing = (fruit) => {
        setFruitToProcess(fruit);
        setShowNewBatchModal(true);
    };

    const handleNewBatchSubmit = async (formData) => {
        try {
            await createBatchFromGrape(fruitToProcess.id, formData);
            toast.success(`Партия "${formData.batch_name}" успешно создана!`);
            setShowNewBatchModal(false);
            fetchBatches();
            fetchFruits();
        } catch (error) { // Убран лишний '=>'
            toast.error(error.response?.data?.error || 'Ошибка при создании партии');
        }
    };

    const handleBatchSelect = (batchId) => {
        const newSelection = new Set(selectedBatches);
        if (newSelection.has(batchId)) {
            newSelection.delete(batchId);
        } else {
            newSelection.add(batchId);
        }
        setSelectedBatches(newSelection);
    };

    const handleOpenBlendLab = () => {
        if (selectedBatches.size > 0) {
            setShowBlendLab(true);
        }
    };

    const handleBlendSuccess = (data) => {
        fetchBatches();
        setSelectedBatches(new Set());
        toast.success(`Купаж "${data.message.split("'")[1]}" успешно создан!`);
    };

    if (batchesLoading || fruitsLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="dashboard">
            <h2 className="mb-4">Дашборд 🍇</h2>

            <WineBatches
                batches={batches}
                onSplitBatch={handleSplitBatch}
                error={batchesError}
                selectedBatches={selectedBatches}
                onBatchSelect={handleBatchSelect}
                onOpenBlendLab={handleOpenBlendLab}
            />

            <AvailableFruits
                fruits={fruits}
                onStartProcessing={handleStartProcessing}
                onShowAddFruitModal={() => setShowAddFruitModal(true)}
            />

            {/* Модальное окно для добавления плодов */}
            <Modal show={showAddFruitModal} onHide={() => setShowAddFruitModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Новый плод в погреб 🍇</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FruitStockForm
                        initialData={null}
                        onSubmit={handleAddFruitSubmit}
                        onClose={() => setShowAddFruitModal(false)}
                    />
                </Modal.Body>
            </Modal>

            {/* Модальное окно для создания новой партии */}
            <Modal show={showNewBatchModal} onHide={() => setShowNewBatchModal(false)}>
                <NewBatchForm
                    ingredient={fruitToProcess}
                    onSubmit={handleNewBatchSubmit}
                    onClose={() => setShowNewBatchModal(false)}
                />
            </Modal>

            {/* Лаборатория купажирования */}
            <BlendLabModal
                show={showBlendLab}
                onClose={() => setShowBlendLab(false)}
                initialData={{ components: batches.filter(b => selectedBatches.has(b.id)) }}
                onSuccess={handleBlendSuccess}
            />
        </div>
    );
}

export default Dashboard;
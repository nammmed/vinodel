// src/pages/Dashboard.js
import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import useBatches from '../hooks/useBatches';
import useGrapes from '../hooks/useGrapes';
import GrapeForm from '../components/GrapeForm';
import VinifyForm from '../components/VinifyForm';
import {createBatchFromGrape} from '../services/api';
import WineBatches from "../components/Dashboard/WineBatches";
import AvailableGrapes from "../components/Dashboard/AvailableGrapes";
import BlendLabModal from "../components/BlendLabModal";
import {toast} from "react-toastify";

function Dashboard() {
    const {
        batches,
        loading: batchesLoading,
        error: batchesError,
        handleSplitBatch,
        fetchBatches
    } = useBatches();
    const {grapes, loading: grapesLoading, error: grapesError, handleAddGrape, showAddModal, setShowAddModal} = useGrapes();
    const [showVinifyModal, setShowVinifyModal] = useState(false);
    const [grapeToVinify, setGrapeToVinify] = useState(null);

    const [selectedBatches, setSelectedBatches] = useState(new Set());
    const [showBlendLab, setShowBlendLab] = useState(false);

    const handleVinify = (grape) => {
        setGrapeToVinify(grape);
        setShowVinifyModal(true);
    };

    const handleVinifySubmit = async (formData) => {
        try {
            await createBatchFromGrape(grapeToVinify.id, formData);
            setShowVinifyModal(false);
        } catch (error) {
            console.error('Ошибка при создании партии', error);
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
        console.log('Купаж успешно создан:', data);
        fetchBatches();
        setSelectedBatches(new Set());
        toast.success(`Купаж "${data.message.split("'")[1]}" успешно создан!`);
    }

    if (batchesLoading || grapesLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="dashboard">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Винодельня</h2>
                <Button
                    variant="primary"
                    size="lg"
                    disabled={selectedBatches.size === 0}
                    onClick={handleOpenBlendLab}
                >
                    Создать купаж ({selectedBatches.size})
                </Button>
            </div>

            {/* Партии вина */}
            <WineBatches
                batches={batches}
                onSplitBatch={handleSplitBatch}
                error={batchesError}
                selectedBatches={selectedBatches}
                onBatchSelect={handleBatchSelect}
            />

            {/* Виноград в наличии */}
            <AvailableGrapes grapes={grapes} onVinify={handleVinify} onShowAddGrapeModal={() => setShowAddModal(true)}/>

            {/* Модальное окно для добавления винограда */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление винограда</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GrapeForm
                        initialData={null}
                        onSubmit={handleAddGrape}
                        onClose={() => setShowAddModal(false)}
                    />
                </Modal.Body>
            </Modal>

            {/* Модальное окно для винификации винограда */}
            <Modal show={showVinifyModal} onHide={() => setShowVinifyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Винификация винограда {grapeToVinify?.sort}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {grapeToVinify && (
                        <VinifyForm
                            grape={grapeToVinify}
                            onSubmit={handleVinifySubmit}
                            onClose={() => setShowVinifyModal(false)}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* Модальное окно для купажирования */}
            <BlendLabModal
                show={showBlendLab}
                onClose={() => setShowBlendLab(false)}
                batches={batches.filter(b => selectedBatches.has(b.id))}
                onSuccess={handleBlendSuccess}
            />
        </div>
    );
}

export default Dashboard;
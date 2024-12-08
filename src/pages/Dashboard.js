// src/pages/Dashboard.js
import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import useBatches from '../hooks/useBatches';
import useGrapes from '../hooks/useGrapes';
import GrapeForm from '../components/GrapeForm';
import VinifyForm from '../components/VinifyForm';
import {createBatchFromGrape} from '../services/api';
import WineBatches from "../components/Dashboard/WineBatches";
import AvailableGrapes from "../components/Dashboard/AvailableGrapes";

function Dashboard() {
    const {
        batches,
        loading: batchesLoading,
        error: batchesError,
        handleSplitBatch
    } = useBatches();
    const {grapes, loading: grapesLoading, error: grapesError, handleAddGrape, showAddModal, setShowAddModal} = useGrapes();
    const [showVinifyModal, setShowVinifyModal] = useState(false);
    const [grapeToVinify, setGrapeToVinify] = useState(null);

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

    if (batchesLoading || grapesLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="dashboard">
            <h2 className="mb-4">Винодельня</h2>

            {/* Партии вина */}
            <WineBatches
                batches={batches}
                onSplitBatch={handleSplitBatch}
                error={batchesError}
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
        </div>
    );
}

export default Dashboard;
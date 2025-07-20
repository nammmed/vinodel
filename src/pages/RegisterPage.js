// src/pages/RegisterPage.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/api';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        register(name, email, password)
            .then(() => {
                setAuthenticated(true);
                navigate('/');
            })
            .catch((err) => {
                toast.error(err.response?.data?.error || 'Ошибка при регистрации');
            });
    };

    return (
        <div className="d-flex justify-content-center">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <Card.Title>Регистрация</Card.Title>
                    <Form onSubmit={handleRegister}>
                        <Form.Group controlId="formName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите ваше имя"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Введите email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-4" style={{ width: '100%' }}>
                            Зарегистрироваться
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
}

export default RegisterPage;
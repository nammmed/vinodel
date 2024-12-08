// src/pages/LoginPage.js

import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {login} from '../services/api';
import {Form, Button, Card, Alert} from 'react-bootstrap';
import {Link} from "react-router";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        login(email, password)
            .then(() => {
                setAuthenticated(true);
                navigate('/');
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'Ошибка при входе');
            });
    };

    return (
        <div className="d-flex justify-content-center">
            <Card style={{width: '400px'}}>
                <Card.Body>
                    <Card.Title>Вход</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formEmail">
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

                        <Button variant="primary" type="submit" className="mt-4" style={{width: '100%'}}>
                            Войти
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
}

export default LoginPage;
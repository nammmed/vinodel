// src/components/NavigationBar.js

import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/api';

function NavigationBar() {
    const { authenticated, setAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        logout().then(() => {
            setAuthenticated(false);
        });
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>Винодел</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="navbar" />
                <Navbar.Collapse id="navbar">
                    {authenticated && (
                        <Nav className="me-auto">
                            <LinkContainer to="/">
                                <Nav.Link>Главная</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/batches">
                                <Nav.Link>Партии</Nav.Link>
                            </LinkContainer>
                            {/* Добавьте другие ссылки */}
                        </Nav>
                    )}
                    <Nav>
                        {authenticated ? (
                            <Button variant="outline-light" onClick={handleLogout}>
                                Выйти
                            </Button>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Button variant="outline-light" className="me-2">
                                        Войти
                                    </Button>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Button variant="light">
                                        Регистрация
                                    </Button>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
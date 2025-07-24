import React, {useContext} from 'react';
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {logout} from "../services/api";

function NavigationBar() {
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
            .then(() => {
                setAuthenticated(false);
                navigate('/login'); // Перенаправляем на страницу входа
            })
            .catch((err) => {
                console.error('Ошибка при выходе:', err);
            });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Винодел</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    {authenticated ? (
                        <>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Дашборд</Nav.Link>

                                <Nav.Link as={Link} to="/grapes/">Виноград</Nav.Link>

                                <NavDropdown title="Партии" id="batch-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/batches">
                                        Все партии
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/batches/new">
                                        Создать партию
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item as={Link} to="/recipes">
                                        Мои рецепты
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/blends/new">
                                        Создать купаж
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <Nav.Link as={Link} to="/supplies">Склад</Nav.Link>
                            </Nav>

                            <Nav>
                                <Nav.Link onClick={handleLogout}>Выйти</Nav.Link>
                            </Nav>
                        </>
                    ) : (
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/login">Войти</Nav.Link>
                            <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
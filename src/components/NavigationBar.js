import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function NavigationBar() {
    const { authenticated, setAuthenticated } = useContext(AuthContext);

    const handleLogout = async () => {
        setAuthenticated(false);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Винодел</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {authenticated ? (
                        <>
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Дашборд</Nav.Link>

                                <NavDropdown title="Виноград" id="grape-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/grapes">
                                        Весь виноград
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/grapes/new">
                                        Добавить виноград
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Партии" id="batch-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/batches">
                                        Все партии
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/batches/new">
                                        Создать партию
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/blends">
                                        Купажи
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/blends/new">
                                        Создать купаж
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Процессы" id="process-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/processes">
                                        Все процессы
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/measurements">
                                        Измерения
                                    </NavDropdown.Item>
                                </NavDropdown>
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, ListGroup, Alert, Image, Card, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async () => {
        if (newTask.trim() === '') {
            setError('Task cannot be empty!');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/tasks',
                { description: newTask, due_date: dueDate.toISOString().split('T')[0] },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNewTask('');
            setDueDate(new Date());
            setError('');
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const toggleTaskCompletion = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = status === 'completed' ? 'pending' : 'completed';
            await axios.put(
                `http://localhost:5000/api/tasks/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div
            style={{
                backgroundImage: 'url(./images/wave-bg.gif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container className="mt-5 justify-content-center">
                {/* todo Header with Image */}
                <div className="d-flex align-items-center justify-content-center mb-4">
                    <img
                        src="./images/todo.gif"
                        alt="todoIcon"
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    <h2 style={{ color: '#6a11cb', margin: 0 }}>TO-DO</h2>
                </div>

                {/* Single Card for Add Task Form and Task List */}
                <Container className="mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Card
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light transparency
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow
                        border: 'none', // Remove default border
                        width: '600px', // Fixed width
                        height: '700px', // Fixed height
                        overflowY: 'auto', // Add scroll if content overflows
                    }}
                >
                    <Card.Body>
                        {/* Add Task Form */}
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addTask();
                            }}
                        >
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Add a new task"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex justify-content-center">
                                <DatePicker
                                    selected={dueDate}
                                    onChange={(date) => setDueDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Add Task
                            </Button>
                        </Form>

                        {/* Error Message */}
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                        {/* Task List in Separate Cards */}
                        <Row className="mt-4">
                            {tasks.map((task) => (
                                <Col key={task.id} md={4} className="mb-3">
                                    <Card>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Button
                                                        variant={task.status === 'completed' ? 'success' : 'outline-secondary'}
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => toggleTaskCompletion(task.id, task.status)}
                                                    >
                                                        {task.status === 'completed' ? '✓' : ''}
                                                    </Button>
                                                    <span
                                                        style={{
                                                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                            color: task.status === 'completed' ? '#6c757d' : 'inherit',
                                                        }}
                                                    >
                                                        {task.description} (Due: {task.due_date || 'No due date'})
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => deleteTask(task.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            </Container>
        </div>
    );
};

export default Tasks;
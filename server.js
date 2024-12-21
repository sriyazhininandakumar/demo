const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// In-memory todo list (instead of MongoDB)
let todos = [];

// POST route to add a new todo
app.post('/todos', (req, res) => {
    const { todolist } = req.body;
    try {
        const newTodo = {
            todolist,
            isComplete: false,
            id: new Date().toISOString(), // Use a string as an ID (e.g., timestamp)
        };
        todos.push(newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// GET route to retrieve all todos
app.get('/todos', (req, res) => {
    try {
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// PUT route to update a todo
app.put('/todos/:id', (req, res) => {
    try {
        const { todolist, isComplete } = req.body;
        const { id } = req.params;

        let updatedTodo = todos.find((todo) => todo.id === id);

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        updatedTodo.todolist = todolist !== undefined ? todolist : updatedTodo.todolist;
        updatedTodo.isComplete = isComplete !== undefined ? isComplete : updatedTodo.isComplete;

        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE route to remove a todo
app.delete('/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const todoIndex = todos.findIndex((todo) => todo.id === id);

        if (todoIndex === -1) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todos.splice(todoIndex, 1);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

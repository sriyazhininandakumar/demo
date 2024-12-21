const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose
    .connect('mongodb://localhost:27017/mern-app')
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => {
        console.log(err);
    });



const todoSchema = new mongoose.Schema({
    todolist: {
        required: true,
        type: String,
    },
    isComplete: {
        type: Boolean,
        default: false,
    },
    id: {        
        type: Date,
        default: Date.now,
    }
});


const todoModel = mongoose.model('Todo', todoSchema);

app.post('/todos', async (req, res) => {
    const { todolist } = req.body;
    try {
        const newTodo = new todoModel({ todolist });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { todolist, isComplete } = req.body;
        const id = req.params.id;

        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { todolist, isComplete },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTodo = await todoModel.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

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

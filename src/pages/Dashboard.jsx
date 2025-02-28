import { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const API_BASE = 'http://localhost:5000/tasks';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", category: "To-Do" });
    const [showForm, setShowForm] = useState(false);
    const [editTask, setEditTask] = useState(null);

    const categories = ["To-Do", "In Progress", "Done"];

    // Fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const res = await axios.get(API_BASE);
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add or Update Task
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return alert("Title is required");

        try {
            if (editTask) {
                await axios.put(`${API_BASE}/${editTask._id}`, formData);
            } else {
                await axios.post(API_BASE, formData);
            }
            fetchTasks();
            resetForm();
        } catch (err) {
            console.error("Failed to save task:", err);
        }
    };

    // Delete Task
    const deleteTask = async (id) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchTasks();
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    // Drag & Drop Logic
    const handleDragEnd = async (result) => {
        if (!result.destination) return; // If there's no destination, do nothing.
    
        const { source, destination, draggableId } = result;
    
        // If the item is dropped in the same category, do nothing.
        if (source.droppableId === destination.droppableId) return;
    
        // Find the task based on its _id.
        const task = tasks.find(t => t._id === draggableId);
    
        // Update the task's category, but do not modify the _id.
        const updatedTask = { ...task, category: destination.droppableId };
    
        try {
            // Send the updated task back to the backend, excluding the _id.
            await axios.put(`${API_BASE}/${draggableId}`, updatedTask);
            fetchTasks(); // Refresh tasks after the update.
        } catch (error) {
            console.error("Task move/update failed:", error);
        }
    };
    

    // Start Editing
    const startEdit = (task) => {
        setFormData({ title: task.title, description: task.description, category: task.category });
        setEditTask(task);
        setShowForm(true);
    };

    // Reset Form
    const resetForm = () => {
        setFormData({ title: "", description: "", category: "To-Do" });
        setEditTask(null);
        setShowForm(false);
    };

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-4">Task Management System</h1>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}
            >
                Add New Task
            </button>

            {/* Form for Add/Edit Task */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4 border p-4 bg-white rounded shadow">
                    <input
                        type="text"
                        placeholder="Task Title"
                        className="border p-2 w-full mb-2"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="border p-2 w-full mb-2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2">
                        {editTask ? "Update Task" : "Add Task"}
                    </button>
                    <button
                        type="button"
                        className="ml-2 bg-gray-500 text-white px-4 py-2"
                        onClick={() => setShowForm(false)}
                    >
                        Cancel
                    </button>
                </form>
            )}

            {/* Task Board with Drag & Drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-3 gap-4">
                    {categories.map(category => (
                        <Droppable droppableId={category} key={category}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="p-4 border rounded min-h-[200px] bg-gray-100"
                                >
                                    <h2 className="text-xl font-semibold mb-2">{category}</h2>

                                    {tasks.filter(task => task.category === category).map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-3 mb-2 rounded shadow flex justify-between items-start"
                                                >
                                                    <div>
                                                        <h3 className="font-bold">{task.title}</h3>
                                                        <p className="text-sm">{task.description}</p>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <button
                                                            className="text-blue-500 text-sm"
                                                            onClick={() => startEdit(task)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="text-red-500 text-sm"
                                                            onClick={() => deleteTask(task._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

export default Dashboard;

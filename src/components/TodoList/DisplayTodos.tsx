import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabaseCLIENT } from '../../lib/supabaseClient'; // Adjust the import path as needed
import AddEditForm from './AddEditForm'; // Import the AddEditForm component
import ConfirmationPopover from '../UI/ConfirmationPopover';
import { BiEdit } from "react-icons/bi"; // Import the edit icon

interface Todo {
    user_id: string;
    todo_id: string;
    title: string;
    description: string | null;
    due_date: string | null;
}

const DisplayTodos: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewOnlyMyTodos, setViewOnlyMyTodos] = useState<boolean>(true); // State for toggling view
    const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set()); // Track expanded todos
    const [isEditing, setIsEditing] = useState<boolean>(false); // State for showing the edit form
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null); // Track the selected todo for editing
    const [isProcessingDelete, setIsProcessingDelete] = useState<string | null>(null); // Track delete processing state

    useEffect(() => {
        const fetchTodos = async () => {
            setLoading(true);
            setError(null);

            const { data: userData, error: userError } = await supabaseCLIENT.auth.getUser();

            if (userError || !userData?.user) {
                setError('User not logged in or error fetching user.');
                setLoading(false);
                return;
            }

            const userId = userData.user.id;

            const query = supabaseCLIENT
                .from('todos')
                .select('user_id,todo_id, title, description, due_date')
                .order('display_order', { ascending: true });

            if (viewOnlyMyTodos) {
                query.eq('user_id', userId); // Filter for only the current user's todos
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                setError('Error fetching todos.');
                console.error(fetchError);
            } else {
                setTodos(data || []);
            }

            setLoading(false);
        };

        fetchTodos();
    }, [viewOnlyMyTodos]); // Re-fetch todos when the toggle changes

    const toggleExpand = (todoId: string) => {
        setExpandedTodos((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(todoId)) {
                newSet.delete(todoId);
            } else {
                newSet.add(todoId);
            }
            return newSet;
        });
    };

    const handleEditClick = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsEditing(true);
    };

    const handleFormClose = () => {
        setIsEditing(false);
        setSelectedTodo(null);
        // Optionally, refetch todos after editing
        const fetchTodos = async () => {
            const { data, error } = await supabaseCLIENT
                .from('todos')
                .select('user_id,todo_id, title, description, due_date')
                .order('display_order', { ascending: true });

            if (!error) {
                setTodos(data || []);
            }
        };
        fetchTodos();
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const reorderedTodos = Array.from(todos);
        const [movedTodo] = reorderedTodos.splice(result.source.index, 1);
        reorderedTodos.splice(result.destination.index, 0, movedTodo);

        setTodos(reorderedTodos);

        // Update the database with the new display order
        try {
            for (let index = 0; index < reorderedTodos.length; index++) {
                const todo = reorderedTodos[index];
                const { error: updateError } = await supabaseCLIENT
                    .from('todos')
                    .update({ display_order: index + 1 }) // Only update display_order
                    .eq('todo_id', todo.todo_id); // Match the specific todo by ID

                if (updateError) {
                    console.error('Error updating display order:', updateError);
                    setError('Failed to update display order.');
                    return;
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred.');
        }
    };

    const handleDelete = async (todoId: string) => {
        setIsProcessingDelete(todoId); // Set the processing state for the specific todo
        try {
            const { error } = await supabaseCLIENT
                .from('todos')
                .delete()
                .eq('todo_id', todoId);

            if (error) {
                console.error('Error deleting todo:', error);
                setError('Failed to delete todo.');
            } else {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.todo_id !== todoId));
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setIsProcessingDelete(null); // Clear the processing state
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Todos</h2>

            <div className="mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={viewOnlyMyTodos}
                        onChange={() => setViewOnlyMyTodos((prev) => !prev)}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                        View only my todos
                    </span>
                </label>
            </div>

            {todos.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No todos found.</p>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="todos">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                            >
                                {todos.map((todo, index) => (
                                    <Draggable key={todo.todo_id} draggableId={todo.todo_id} index={index}>
                                        {(provided) => (
                                            <li
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow"
                                            >
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{todo.title}</h3>
                                                {todo.description && (
                                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                                        {expandedTodos.has(todo.todo_id)
                                                            ? todo.description
                                                            : `${todo.description.slice(0, 50)}...`}
                                                        {todo.description.length > 50 && (
                                                            <button
                                                                onClick={() => toggleExpand(todo.todo_id)}
                                                                className="ml-2 text-indigo-600 dark:text-indigo-400 underline"
                                                            >
                                                                {expandedTodos.has(todo.todo_id) ? 'Collapse' : 'Expand'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {todo.due_date && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Due: {new Date(todo.due_date).toLocaleString()}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleEditClick(todo)}
                                                        className="bg-blue-600 mb-1 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-2"
                                                    >
                                                        <BiEdit className="w-4 h-4" /> 
                                                    </button>
                                                    <ConfirmationPopover
                                                        onConfirm={() => handleDelete(todo.todo_id)}
                                                        onCancel={() => console.log('Delete canceled')}
                                                        isProcessing={isProcessingDelete === todo.todo_id}
                                                    >
                                                        <p className="text-xs text-white">Are you sure you want to delete this todo?</p>
                                                    </ConfirmationPopover>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            {isEditing && selectedTodo && (
                <div className="mt-6">
                    <AddEditForm
                        existingTodo={selectedTodo}
                        onTodoUpdated={handleFormClose}
                        onClose={() => {
                            setIsEditing(false); // Close the form
                            setSelectedTodo(null); // Clear the selected todo
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DisplayTodos;
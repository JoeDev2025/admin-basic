import React, { useEffect, useState } from 'react';
import { supabaseCLIENT } from '../../lib/supabaseClient'; // Adjust the import path as needed

interface Todo {
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
                .select('todo_id, title, description, due_date')
                .order('due_date', { ascending: true });

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
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li key={todo.todo_id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DisplayTodos;
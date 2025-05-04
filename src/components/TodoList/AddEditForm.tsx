import React, { useState, useEffect, FormEvent } from 'react';
import { supabaseCLIENT } from '../../lib/supabaseClient'; // Adjust the import path as needed

interface Todo {
  todo_id: string;
  title: string;
  description?: string;
  due_date?: string;
  is_important: boolean;
  tags?: string[];
  repeat_frequency?: string;
}

interface AddEditFormProps {
  onTodoAdded?: () => void; // Optional callback after adding a todo
  onTodoUpdated?: () => void; // Optional callback after updating a todo
  existingTodo?: Todo; // Optional existing todo for editing
  onClose?: () => void; // Callback to close the form
}

const AddEditForm: React.FC<AddEditFormProps> = ({ onTodoAdded, onTodoUpdated, existingTodo, onClose }) => {
  const [title, setTitle] = useState<string>(existingTodo?.title || '');
  const [description, setDescription] = useState<string>(existingTodo?.description || '');
  const [dueDate, setDueDate] = useState<string>(existingTodo?.due_date || '');
  const [isImportant, setIsImportant] = useState<boolean>(existingTodo?.is_important || false);
  const [tags, setTags] = useState<string>(existingTodo?.tags?.join(', ') || '');
  const [repeatFrequency, setRepeatFrequency] = useState<string>(existingTodo?.repeat_frequency || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title || '');
      setDescription(existingTodo.description || '');
      setDueDate(existingTodo.due_date || '');
      setIsImportant(existingTodo.is_important || false);
      setTags(existingTodo.tags?.join(', ') || '');
      setRepeatFrequency(existingTodo.repeat_frequency || '');
    }
  }, [existingTodo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!title.trim()) {
      setError('Title is required.');
      setIsLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabaseCLIENT.auth.getUser();

    if (userError || !userData?.user) {
      setError('User not logged in or error fetching user.');
      setIsLoading(false);
      console.error('User fetch error:', userError);
      return;
    }

    const userId = userData.user.id;

    const todoData = {
      user_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      is_important: isImportant,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      repeat_frequency: repeatFrequency.trim() || null,
    };

    try {
      if (existingTodo) {
        // Update existing todo
        const { error: updateError } = await supabaseCLIENT
          .from('todos')
          .update(todoData)
          .eq('todo_id', existingTodo.todo_id); // Use todo_id instead of id

        if (updateError) {
          throw updateError;
        }

        setSuccessMessage('Todo updated successfully!');
        if (onTodoUpdated) {
          onTodoUpdated();
        }
      } else {
        // Add new todo
        const { data: maxOrderData, error: maxOrderError } = await supabaseCLIENT
          .from('todos')
          .select('display_order')
          .eq('user_id', userId)
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (maxOrderError) {
          throw maxOrderError;
        }

        const nextDisplayOrder = maxOrderData ? maxOrderData.display_order + 1 : 1;

        const { error: insertError } = await supabaseCLIENT
          .from('todos')
          .insert([{ ...todoData, display_order: nextDisplayOrder, is_complete: false }]);

        if (insertError) {
          throw insertError;
        }

        setSuccessMessage('Todo added successfully!');
        if (onTodoAdded) {
          onTodoAdded();
        }
      }

      // Clear the form if adding a new todo
      if (!existingTodo) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setIsImportant(false);
        setTags('');
        setRepeatFrequency('');
      }
    } catch (err: any) {
      console.error('Error saving todo:', err);
      setError(`Failed to save todo: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        {existingTodo ? 'Edit Todo' : 'Add New Todo'}
      </h2>

      {error && <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">{error}</div>}
      {successMessage && <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded">{successMessage}</div>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="e.g., Buy groceries"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Optional details about the task"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="e.g., work, urgent, personal"
        />
      </div>

      <div>
        <label htmlFor="repeatFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Repeat Frequency
        </label>
        <select
          id="repeatFrequency"
          value={repeatFrequency}
          onChange={(e) => setRepeatFrequency(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
        >
          <option value="">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          id="isImportant"
          type="checkbox"
          checked={isImportant}
          onChange={(e) => setIsImportant(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:focus:ring-offset-gray-800"
        />
        <label htmlFor="isImportant" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Mark as important
        </label>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-700"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading ? (existingTodo ? 'Updating...' : 'Adding...') : (existingTodo ? 'Update Todo' : 'Add Todo')}
        </button>
      </div>
    </form>
  );
};

export default AddEditForm;
import React, { useState, FormEvent } from 'react';
import { supabaseCLIENT } from '../../lib/supabaseClient'; // Adjust the import path as needed

interface AddTodoFormProps {
  onTodoAdded?: () => void; // Optional callback after adding a todo
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onTodoAdded }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(''); // Store as string for input type="datetime-local"
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [tags, setTags] = useState<string>(''); // Comma-separated tags
  const [repeatFrequency, setRepeatFrequency] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0); // Default display order

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    if (isNaN(displayOrder)) {
      setError('Display Order must be a number.');
      setIsLoading(false);
      return;
    }

    const user = await supabaseCLIENT.auth.getUser()

    if (!user.data?.user) {
      throw new Error('User not logged in')
    }


    const todoData = {
      user_id: user.data.user.id,
      title: title.trim(),
      description: description.trim() || null, // Use null if empty
      is_complete: false, // Default value
      display_order: displayOrder,
      is_important: isImportant,
      due_date: dueDate ? new Date(dueDate).toISOString() : null, // Convert to ISO string or null
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Split, trim, and remove empty tags
      repeat_frequency: repeatFrequency.trim() || null,
      // created_at and updated_at are handled by the database
    };

    try {
      const { error: insertError } = await supabaseCLIENT
        .from('todos')
        .insert([todoData]);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage('Todo added successfully!');
      // Clear the form
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsImportant(false);
      setTags('');
      setRepeatFrequency('');
      setDisplayOrder(0);


      // Call the callback if provided
      if (onTodoAdded) {
        onTodoAdded();
      }

    } catch (err: any) {
      console.error('Error adding todo:', err);
      setError(`Failed to add todo: ${err.message || err.error_description || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      // Optionally clear success/error messages after a delay
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Add New Todo</h2>

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
        <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Display Order <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="displayOrder"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)} // Ensure it's a number
          required
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading
            ? 'bg-indigo-400 dark:bg-indigo-700 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
            }`}
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;

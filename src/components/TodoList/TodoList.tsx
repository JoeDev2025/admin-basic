'use client';

import React, { useState } from 'react';
import AddTodoForm from "./AddTodoForm";
import DisplayTodos from "./DisplayTodos";

export default function TodoList() {
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  const toggleAddTodoForm = () => {
    setShowAddTodoForm((prev) => !prev);
  };

  return (
    <>
      <DisplayTodos />

      <div className="mt-4 text-center">
        <button
          onClick={toggleAddTodoForm}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {showAddTodoForm ? 'Close Add Todo Form' : 'Add New Todo'}
        </button>
      </div>

      {showAddTodoForm && (
        <div className="mt-4">
          <AddTodoForm />
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState } from 'react';
import AddEditForm from "./AddEditForm";
import DisplayTodos from "./DisplayTodos";

export default function TodoList() {
  const [showAddEditForm, setShowAddEditForm] = useState(false);

  const toggleAddEditForm = () => {
    setShowAddEditForm((prev) => !prev);
  };

  return (
    <>
      <DisplayTodos />

      <div className="mt-4 text-center">
        <button
          onClick={toggleAddEditForm}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {showAddEditForm ? 'Close Add Todo Form' : 'Add New Todo'}
        </button>
      </div>

      {showAddEditForm && (
        <div className="mt-4">
          <AddEditForm />
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useOptimistic } from "react";
import DataSet from "./DataSet";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [optimisticData, setOptimisticData] = useOptimistic(
    data,
    (currentData, newData) => newData
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setOptimisticData(json);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "body", header: "Body" },
  ];

  const renderItem = (item, column, index, onChange) => {
    if (editingRow === index) {
      return (
        <input
          type="text"
          value={item[column.key]}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
    return item[column.key];
  };

  const renderHeader = (column) => column.header;

  const handleAdd = () => {
    const newItem = {
      id: Math.max(...data.map((item) => item.id)) + 1,
      name: "New Name",
      email: "new.email@example.com",
      body: "New comment body",
    };

    setOptimisticData([...optimisticData, newItem]);
    setData([...data, newItem]);

    fetch("https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      body: JSON.stringify(newItem),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item");
        }
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        setOptimisticData(data); // Откат изменений
      });
  };

  const handleDelete = () => {
    const selectedItems = selectedRows.map((index) => optimisticData[index]);
    const updatedData = optimisticData.filter(
      (_, index) => !selectedRows.includes(index)
    );

    setOptimisticData(updatedData);
    setData(updatedData);

    selectedItems.forEach((item) => {
      fetch(`https://jsonplaceholder.typicode.com/comments/${item.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete item with id ${item.id}`);
          }
        })
        .catch((error) => {
          console.error(`Error deleting item with id ${item.id}:`, error);
          setOptimisticData(data); // Откат изменений
        });
    });

    setSelectedRows([]);
  };

  const handleUpdate = (index, updatedItem) => {
    const updatedData = optimisticData.map((item, i) =>
      i === index ? updatedItem : item
    );

    setOptimisticData(updatedData);
    setData(updatedData);

    fetch(`https://jsonplaceholder.typicode.com/comments/${updatedItem.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedItem),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update item with id ${updatedItem.id}`);
        }
      })
      .catch((error) => {
        console.error(`Error updating item with id ${updatedItem.id}:`, error);
        setOptimisticData(data); // Откат изменений
      });

    setEditingRow(null);
  };

  const handleEdit = (index) => {
    setEditingRow(index);
  };

  const handleItemChange = (index, columnKey, value) => {
    const updatedData = optimisticData.map((item, i) =>
      i === index ? { ...item, [columnKey]: value } : item
    );
    setOptimisticData(updatedData);
  };

  return (
    <div className="app-container">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <button className="add-button" onClick={handleAdd}>
        Add
      </button>
      <button
        className="delete-button"
        onClick={handleDelete}
        disabled={selectedRows.length === 0}
      >
        Delete
      </button>
      <DataSet
        data={optimisticData}
        columns={columns}
        renderItem={renderItem}
        renderHeader={renderHeader}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onItemChange={handleItemChange}
        editingRow={editingRow}
      />
    </div>
  );
}

export default App;

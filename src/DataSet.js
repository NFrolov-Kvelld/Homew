import React, { useCallback, useState } from "react";

function DataSet({
  data,
  columns,
  renderItem,
  renderHeader,
  selectedRows,
  setSelectedRows,
  onEdit,
  onUpdate,
  onItemChange,
  editingRow,
}) {
  const [editedItems, setEditedItems] = useState({});

  const handleRowClick = useCallback(
    (index, event) => {
      if (event.ctrlKey) {
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.includes(index)
            ? prevSelectedRows.filter((i) => i !== index)
            : [...prevSelectedRows, index]
        );
      } else {
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.includes(index) ? [] : [index]
        );
      }
    },
    [setSelectedRows]
  );

  const isRowSelected = useCallback(
    (index) => selectedRows.includes(index),
    [selectedRows]
  );

  const handleItemChangeLocal = (index, columnKey, value) => {
    setEditedItems((prevEditedItems) => ({
      ...prevEditedItems,
      [index]: {
        ...prevEditedItems[index],
        [columnKey]: value,
      },
    }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map((column, index) => (
            <th key={index}>{renderHeader(column)}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.id}
            onClick={(event) => handleRowClick(index, event)}
            style={{
              backgroundColor: isRowSelected(index) ? "lightblue" : "white",
            }}
          >
            <td>
              <input
                type="checkbox"
                checked={isRowSelected(index)}
                onChange={() => {}}
              />
            </td>
            {columns.map((column, columnIndex) => (
              <td key={columnIndex}>
                {renderItem(
                  editedItems[index] ? editedItems[index] : item,
                  column,
                  index,
                  (value) => handleItemChangeLocal(index, column.key, value)
                )}
              </td>
            ))}
            <td>
              {editingRow === index ? (
                <button
                  onClick={() => onUpdate(index, editedItems[index] || item)}
                >
                  Save
                </button>
              ) : (
                <button onClick={() => onEdit(index)}>Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataSet;

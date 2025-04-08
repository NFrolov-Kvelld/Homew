import React, { useCallback } from "react";

function DataSet({
  data,
  columns,
  renderItem,
  renderHeader,
  selectedRows,
  setSelectedRows,
}) {
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

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map((column, index) => (
            <th key={index}>{renderHeader(column)}</th>
          ))}
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
              <td key={columnIndex}>{renderItem(item, column)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataSet;

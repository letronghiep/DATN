import React from "react";

function FilterSection({ title, filterQueries, setFilterValue }) {
  console.log(filterQueries);
  const handleFilterValue = (event) => {
    const filterValue = event.target.value;
    setFilterValue((prevValue) => [...prevValue, filterValue]);
  };
  return (
    <div className="w-full">
      <p className="font-semibold">{title}</p>
      <div className="mt-2 flex flex-col gap-y-1">
        {filterQueries.map((filter, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={filter.id}
              onChange={(value) => handleFilterValue}
            />{" "}
            {filter.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterSection;

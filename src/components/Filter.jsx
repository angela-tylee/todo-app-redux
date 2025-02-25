const Filter = ({ filter, setFilter }) => {
  return (
      <ul>
        <li
          id="filter-all"
          className={`${filter === 'all' ? 'selected' : ''}`}
          onClick={() => {
            setFilter('all');
          }}
        >
          All
        </li>
        <li
          id="filter-active"
          className={`${filter === 'false' ? 'selected' : ''}`}
          onClick={() => {
            setFilter('false');
          }}
        >
          Active
        </li>
        <li
          id="filter-completed"
          className={`${filter === 'true' ? 'selected' : ''}`}
          onClick={() => {
            setFilter('true');
          }}
        >
          Completed
        </li>
      </ul>
  );
};

export default Filter;

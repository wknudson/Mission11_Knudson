import { useEffect, useState } from 'react';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://bookstore-knudson-backend.azurewebsites.net/api/book/GetBookCategories');        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updated = selectedCategories.includes(target.value)
      ? selectedCategories.filter(c => c !== target.value)
      : [...selectedCategories, target.value];
    setSelectedCategories(updated);
  }

  return (
    /* Bootstrap card component for filter panel - clean sidebar layout */
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white fw-semibold">
        Filter by Category
      </div>
      <div className="card-body p-2">
        {categories.length === 0 ? (
          <p className="text-muted small mb-0 px-2">Loading categories…</p>
        ) : (
          <ul className="list-group list-group-flush">
            {categories.map((category, index) => (
              <li key={index} className="list-group-item px-2 py-1">
                {/* Bootstrap form-check for styled checkboxes */}
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cat-${index}`}
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label small" htmlFor={`cat-${index}`}>
                    {category}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
        {selectedCategories.length > 0 && (
          <div className="px-2 pt-2">
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => setSelectedCategories([])}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;

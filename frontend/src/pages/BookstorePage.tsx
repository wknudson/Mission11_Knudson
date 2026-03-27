import { useState } from 'react';
import WelcomeBand from '../components/WelcomeBand';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';
import CartSummary from '../components/CartSummary';

function BookstorePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container my-4">
      <CartSummary />
      <WelcomeBand />
      {/* Bootstrap Grid: sidebar + main content */}
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="col-12 col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default BookstorePage;

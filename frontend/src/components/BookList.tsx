import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  const { addToCart } = useCart();

  // Reset to page 1 whenever categories change
  useEffect(() => {
    setPageNumber(1);
  }, [selectedCategories]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const categoryParams = selectedCategories
        .map(c => `bookCategories=${encodeURIComponent(c)}`) 
        .join('&');

      const response = await fetch(
  `https://bookstore-knudson-backend.azurewebsites.net/api/book/AllBooks?pageNumber=${pageNumber}&pageSize=${pageSize}&sortAsc=${sortAsc}${selectedCategories.length ? `&${categoryParams}` : ''}`
);
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalBooks / pageSize));
      setLoading(false);
    };

    fetchBooks();
  }, [pageSize, pageNumber, sortAsc, selectedCategories]);

  function handleAddToCart(book: Book) {
    addToCart({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: 1,
    });
    setAddedIds(prev => new Set(prev).add(book.bookId));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(book.bookId);
        return next;
      });
    }, 1500);
  }

  return (
    <>
      {/* Controls row */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => { setSortAsc(!sortAsc); setPageNumber(1); }}
        >
          Sort by Title {sortAsc ? '▲' : '▼'}
        </button>
        <label className="d-flex align-items-center gap-2 mb-0 small">
          Results per page:
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </label>
      </div>

      {/* Spinner or book cards */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-4">
          {books.map((book) => (
            <div className="col" key={book.bookId}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <span className="badge text-bg-info mb-2 align-self-start">{book.category}</span>
                  <ul className="list-unstyled mb-3 small flex-grow-1">
                    <li><strong>Author:</strong> {book.author}</li>
                    <li><strong>Publisher:</strong> {book.publisher}</li>
                    <li><strong>ISBN:</strong> {book.isbn}</li>
                    <li><strong>Classification:</strong> {book.classification}</li>
                    <li><strong>Pages:</strong> {book.pageCount}</li>
                  </ul>
                  <div className="d-flex align-items-center justify-content-between mt-auto">
                    <span className="fs-5 fw-bold text-success">${book.price.toFixed(2)}</span>
                    <button
                      className={`btn btn-sm ${addedIds.has(book.bookId) ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => handleAddToCart(book)}
                    >
                      {addedIds.has(book.bookId) ? '✓ Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center flex-wrap">
          <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNumber(pageNumber - 1)}>
              Previous
            </button>
          </li>
          {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${pageNumber === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPageNumber(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${pageNumber === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNumber(pageNumber + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default BookList;
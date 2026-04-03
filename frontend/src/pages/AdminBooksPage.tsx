import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { fetchBooksAdmin, DeleteBook } from '../api/BooksAPI';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';
import { useNavigate } from 'react-router-dom';

const AdminBooksPage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Pagination state
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    
    // Form rendering state
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    
    const navigate = useNavigate();

    const loadBooks = async () => {
        setLoading(true);
        try {
            const data = await fetchBooksAdmin(pageNumber, pageSize);
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalBooks / pageSize));
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, [pageSize, pageNumber]);

    const handleDelete = async (bookId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (!confirmDelete) return;

        try {
            await DeleteBook(bookId);
            setBooks(prev => prev.filter(b => b.bookId !== bookId));
        } catch (err) {
            alert('Failed to delete book: ' + (err as Error).message);
        }
    };

    if (loading && books.length === 0) return <div className="container mt-5"><p>Loading admin dashboard...</p></div>;
    if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>;

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold m-0">Admin Dashboard</h1>
                <button className="btn btn-outline-primary" onClick={() => navigate('/books')}>Go to Storefront</button>
            </div>

            {!showForm && !editingBook && (
                <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
                    + Add New Book
                </button>
            )}

            {showForm && (
                <NewBookForm
                    onSuccess={() => { setShowForm(false); loadBooks(); }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingBook && (
                <EditBookForm
                    book={editingBook}
                    onSuccess={() => { setEditingBook(null); loadBooks(); }}
                    onCancel={() => setEditingBook(null)}
                />
            )}

            <div className="table-responsive shadow-sm">
                <table className="table table-bordered table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Pages</th>
                            <th>Price</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.bookId}>
                                <td>{book.bookId}</td>
                                <td className="fw-semibold">{book.title}</td>
                                <td>{book.author}</td>
                                <td><span className="badge bg-secondary">{book.category}</span></td>
                                <td>{book.pageCount}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td className="text-center">
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button className="btn btn-warning btn-sm" onClick={() => { setEditingBook(book); setShowForm(false); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.bookId)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <label className="d-flex align-items-center gap-2 small">
                    Results per page:
                    <select className="form-select form-select-sm w-auto" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                </label>

                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPageNumber(pageNumber - 1)}>Previous</button>
                        </li>
                        {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${pageNumber === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPageNumber(index + 1)}>{index + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${pageNumber === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AdminBooksPage;
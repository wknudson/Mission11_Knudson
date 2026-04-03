import { useState } from 'react';
import type { Book } from '../types/Book';
import { AddBook } from '../api/BooksAPI';

interface NewBookFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
    const [formData, setFormData] = useState<Book>({
        bookId: 0,
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        classification: '',
        category: '',
        pageCount: 0,
        price: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AddBook(formData);
            onSuccess();
        } catch (error) {
            alert('Failed to add book. Please try again.');
        }
    };

    return (
        <div className="card mb-4 shadow-sm border-primary">
            <div className="card-header bg-primary text-white fw-bold">Add New Book</div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Author</label>
                        <input type="text" className="form-control" name="author" value={formData.author} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Publisher</label>
                        <input type="text" className="form-control" name="publisher" value={formData.publisher} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">ISBN</label>
                        <input type="text" className="form-control" name="isbn" value={formData.isbn} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Classification</label>
                        <input type="text" className="form-control" name="classification" value={formData.classification} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Page Count</label>
                        <input type="number" className="form-control" name="pageCount" value={formData.pageCount || ''} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Price ($)</label>
                        <input type="number" step="0.01" className="form-control" name="price" value={formData.price || ''} onChange={handleChange} required />
                    </div>
                    <div className="col-12 mt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-success">Add Book</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewBookForm;
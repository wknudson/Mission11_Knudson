import type { Book } from '../types/Book';

const API_BASE_URL = 'https://localhost:5000/api/book';

// Reusable fetch for the admin page
export const fetchBooksAdmin = async (pageNumber: number, pageSize: number): Promise<{ books: Book[], totalBooks: number }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/AllBooks?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const AddBook = async (newBook: Omit<Book, 'bookId'>): Promise<Book> => {
    try {
        const response = await fetch(`${API_BASE_URL}/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });
        if (!response.ok) {
            throw new Error(`Failed to add book: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

export const UpdateBook = async (bookId: number, updatedBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_BASE_URL}/UpdateBook/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });
        if (!response.ok) {
            throw new Error(`Failed to update book: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

export const DeleteBook = async (bookId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/DeleteBook/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete book: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};
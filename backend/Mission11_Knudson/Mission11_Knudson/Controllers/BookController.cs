using BookstoreProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mission11_Knudson.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookstoreDbContext _context;

        public BookController(BookstoreDbContext context)
        {
            _context = context;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetAllBooks(int pageNumber = 1, int pageSize = 10, bool sortAsc = true, [FromQuery] List<string>? bookCategories = null)
        {
            var query = _context.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            query = sortAsc ? query.OrderBy(b => b.Title) : query.OrderByDescending(b => b.Title);

            var totalBooks = query.Count();
            var books = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new { TotalBooks = totalBooks, PageNumber = pageNumber, PageSize = pageSize, Books = books });
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var categories = _context.Books.Select(b => b.Category).Distinct().ToList();
            return Ok(categories);
        }

        // 1. ADD BOOK (POST)
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _context.Books.Add(newBook);
            _context.SaveChanges();
            return Ok(newBook);
        }

        // 2. UPDATE BOOK (PUT)
        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _context.Books.Find(bookId);
            if (existingBook == null)
            {
                return NotFound();
            }

            // Update all the editable fields
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _context.Books.Update(existingBook);
            _context.SaveChanges();
            return Ok(existingBook);
        }

        // 3. DELETE BOOK (DELETE)
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var existingBook = _context.Books.Find(bookId);
            if (existingBook == null)
            {
                return NotFound();
            }

            _context.Books.Remove(existingBook);
            _context.SaveChanges();
            return NoContent();
        }

        // Note: You might want to remove this unless you actually have books categorized as "Functional"
        // This looks like a copy-paste artifact from the WaterProject's functionality statuses!
        [HttpGet("FunctionalBooks")]
        public IEnumerable<Book> GetFunctionalBooks()
        {
            return _context.Books.Where(b => b.Category == "Functional").ToList();
        }
    }
}
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

        [HttpGet("FunctionalBooks")]
        public IEnumerable<Book> GetFunctionalBooks()
        {
            return _context.Books.Where(b => b.Category == "Functional").ToList();
        }
    }
}
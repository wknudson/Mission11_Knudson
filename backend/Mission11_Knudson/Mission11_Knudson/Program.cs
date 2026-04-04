using Microsoft.EntityFrameworkCore;
using BookstoreProject.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS service
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
// We move these OUTSIDE the if-statement so we can see Swagger in Azure (Production)
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    // Development-specific settings can go here if needed
}

// Updated CORS to allow any origin so Azure doesn't block your requests
app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
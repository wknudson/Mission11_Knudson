using Microsoft.EntityFrameworkCore;
using Mission11_Knudson.Data; // Updated to match your actual namespace

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1. Define the CORS policy name
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000", 
                "https://jolly-ocean-020087e1e.1.azurestaticapps.net"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    // Development-specific settings
}

// 2. Use the specific policy instead of AllowAnyOrigin
app.UseCors("AllowSpecificOrigins");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
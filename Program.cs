using Microsoft.EntityFrameworkCore;
using DUGUNMETE.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


string connectionString = $"Server=31.169.72.164;Database=fotokabin;User Id=samet; Password=Samet2020;TrustServerCertificate=True;";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable static files (CSS, JS, images, etc.)
app.UseStaticFiles();

// Enable CORS
app.UseCors("AllowAll");

// Enable routing
app.UseRouting();
app.UseAuthorization();

// Map API controllers
app.MapControllers();



app.Run();
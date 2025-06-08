using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using StoreWebApp.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("StoreWebAppDBCon")
    ?? throw new Exception("There is no connection string named StoreWebAppDBCon.");

builder.Services.AddDbContext<StoreWebAppContext>(options =>
    options.UseSqlite(connectionString));


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.Run();
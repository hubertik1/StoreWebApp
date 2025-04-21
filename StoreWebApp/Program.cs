using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using StoreWebApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Pobierz connection string z appsettings.json
var connectionString = builder.Configuration.GetConnectionString("StoreWebAppDBCon");

// Pobierz zmienną środowiskową DB_PASSWORD
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
if (string.IsNullOrEmpty(dbPassword))
{
    throw new Exception("Zmienna środowiskowa DB_PASSWORD nie została ustawiona.");
}

// Zamień token w connection stringu na rzeczywiste hasło
connectionString = connectionString.Replace("%DB_PASSWORD%", dbPassword);

// Konfiguracja Entity Framework Core
builder.Services.AddDbContext<StoreWebAppContext>(options =>
    options.UseSqlServer(connectionString)
);

// Dodanie kontrolerów wraz z konfiguracją JSON
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

// Konfiguracja Swaggera
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable CORS
app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

// Konfiguracja potoku żądań HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.Run();
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using StoreWebApp.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("StoreWebAppDBCon");
if (connectionString == null)
{
    throw new Exception("There is no connection string named StoreWebAppDBCon.");
}

var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
if (string.IsNullOrEmpty(dbPassword))
{
    throw new Exception("There is no environmental var named DB_PASSWORD");
}

connectionString = connectionString.Replace("%DB_PASSWORD%", dbPassword);

builder.Services.AddDbContext<StoreWebAppContext>(options =>
    options.UseSqlServer(connectionString)
);

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

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
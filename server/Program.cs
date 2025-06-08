using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StoreWebApp.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? $"Data Source={Path.Combine(builder.Environment.ContentRootPath, "StoreWebApp.db")}";

builder.Services.AddDbContext<StoreDbContext>(opt =>
    opt.UseSqlite(connectionString));

builder.Services
       .AddControllers()
       .AddNewtonsoftJson(o =>
           o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<StoreDbContext>();
    ctx.Database.Migrate();
    SeedData.Initialize(ctx);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();
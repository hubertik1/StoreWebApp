using System;
using System.Linq;
using System.Collections.Generic;
using StoreWebApp.Models;
using StoreWebApp.Data;
using Microsoft.AspNetCore.Identity;

namespace StoreWebApp.Data
{
    public static class SeedData
    {
        public static void Initialize(StoreDbContext context)
        {
            var adminUser = context.Users.FirstOrDefault(u => u.Username == "admin");
            if (adminUser == null)
            {
                var hasher = new PasswordHasher<User>();
                adminUser = new User { Username = "admin", Role = "Admin" };
                adminUser.PasswordHash = hasher.HashPassword(adminUser, "admin");
                context.Users.Add(adminUser);
                context.SaveChanges();
            }

            if (context.Products.Any())
                return;

            var categoryVehicles = new Category { Name = "Vehicles", IsDeleted = false };
            var categoryTools    = new Category { Name = "Tools", IsDeleted = false };
            var categoryToys     = new Category { Name = "Toys", IsDeleted = false };
            var categoryFood     = new Category { Name = "Food", IsDeleted = false };

            context.Set<Category>().AddRange(categoryVehicles, categoryTools, categoryToys, categoryFood);
            context.SaveChanges();

            var products = new Product[]
            {
                new Product
                {
                    Title = "SPAWARKA 330A INWERTOROWA MMA Elektrodowa TigLift Pulse",
                    Description = "Profesjonalna spawarka inwertorowa o mocy 200 A, idealna do prac warsztatowych i domowych.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    CreatorUserId = adminUser.Id,
                    ImageUrl = "images/spawarka.jpg",
                    Categories = new List<Category> { categoryTools }
                },
                new Product
                {
                    Title = "Little Tikes Lt Piaskownica Żółw",
                    Description = "Oto Twój niezwykły kącik zabaw - zamykana piaskownica Żółw od renomowanej marki Little Tikes, lidera wśród dostawców placów zabaw i zabawek ogrodowych.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    CreatorUserId = adminUser.Id,
                    ImageUrl = "images/piaskownica.webp",
                    Categories = new List<Category> { categoryToys }
                },
                new Product
                {
                    Title = "Pomidory Warzywo",
                    Description = "Pomidor charakteryzuje się słodkim smakiem, jędrną czerwoną skórką i soczystym miąższem.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    CreatorUserId = adminUser.Id,
                    ImageUrl = "images/pomidor.jpg",
                    Categories = new List<Category> { categoryFood }
                },
                new Product
                {
                    Title = "Pizza Gastro-Net",
                    Description = "Pizza z Gastro-Netu to grube, niedopieczone ciasto z cienką warstwą sera i kawałkami szynki. Tekstura jest gumowata, składniki niskiej jakości, a wygląd mało zachęcający. Całość wydaje się mało staranna i niezbyt smaczna.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    CreatorUserId = adminUser.Id,
                    ImageUrl = "images/pizza.jpeg",
                    Categories = new List<Category> { categoryFood },
                    Comments = new List<Comment>
                    {
                        new Comment
                        {
                            Description = "Kupiłem tę pizzę z Gastro-Netu i muszę przyznać, że jestem mocno rozczarowany. Ciasto było za grube i lekko niedopieczone, ser praktycznie bez smaku, a dodatki bardzo skąpe. Raczej nie spróbuję jej ponownie i nie polecam innym studentom.",
                            IsDeleted = false,
                            CreationDate = DateTime.Now
                        }
                    }
                },
                new Product
                {
                    Title = "Fiat Seicento Sporting",
                    Description = "Dzień dobry, mamy do sprzedania seicento 1.1 2001. Stan techniczny dobry, syn jeździł cały rok.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    CreatorUserId = adminUser.Id,
                    ImageUrl = "images/seicento.webp",
                    Categories = new List<Category> { categoryVehicles },
                    Comments = new List<Comment>
                    {
                        new Comment
                        {
                            Description = "Siedzenia zostały wymienione na dobre ale w innym kolorze.",
                            CreationDate = DateTime.Now,
                            IsDeleted = false,
                            CreatorUserId = adminUser.Id,
                        },
                        new Comment
                        {
                            Description = "Radio sprawne, gra, centralny zamek z kluczyka sprawny.",
                            CreationDate = DateTime.Now,
                            IsDeleted = false,
                            CreatorUserId = adminUser.Id,
                        }
                    }
                },
                new Product
                {
                    Title = "Eko Mak Makaron Babuni Świderek",
                    Description = "Eko Mak Makaron Babuni świderek 45 1kg. Makarony Babuni to najwyższej jakości wyroby, które swoim niepowtarzalnym smakiem trafiają do grona smakoszy.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    CreatorUserId = adminUser.Id,
                    ImageUrl = "images/swiderki.png",                
                    Categories = new List<Category> { categoryFood }
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
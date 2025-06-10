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

            context.Categories.AddRange(categoryVehicles, categoryTools, categoryToys, categoryFood);
            context.SaveChanges();

            var products = new Product[]
            {
                new Product
                {
                    Title = "SPAWARKA 330A INWERTOROWA MMA Elektrodowa TigLift Pulse",
                    Description = "Profesjonalna spawarka inwertorowa o mocy 200 A, idealna do prac warsztatowych i domowych.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    ImageUrl = "images/spawarka.jpg",
                    CreatorUserId = adminUser.Id,
                    Categories = new List<Category> { categoryTools }
                },
                new Product
                {
                    Title = "Little Tikes Lt Piaskownica Żółw",
                    Description = "Oto Twój niezwykły kącik zabaw – zamykana piaskownica Żółw od renomowanej marki Little Tikes, lidera wśród dostawców placów zabaw i zabawek ogrodowych.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    ImageUrl = "images/piaskownica.webp",
                    CreatorUserId = adminUser.Id,
                    Categories = new List<Category> { categoryToys }
                },
                new Product
                {
                    Title = "Pomidory Warzywo",
                    Description = "Pomidor charakteryzuje się słodkim smakiem, jędrną czerwoną skórką i soczystym miąższem.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    ImageUrl = "images/pomidor.jpg",
                    CreatorUserId = adminUser.Id,
                    Categories = new List<Category> { categoryFood }
                },
                new Product
                {
                    Title = "Pizza Gastro-Net",
                    Description = "Pizza z Gastro-Netu – grube, niedopieczone ciasto, niskiej jakości składniki i mało apetyczny wygląd.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    ImageUrl = "images/pizza.jpeg",
                    CreatorUserId = adminUser.Id,
                    Categories = new List<Category> { categoryFood },
                    Comments = new List<Comment>
                    {
                        new Comment
                        {
                            Description = "Kupiłem tę pizzę i jestem rozczarowany. Ciasto za grube i niedopieczone, ser niemal bez smaku.",
                            IsDeleted = false,
                            CreationDate = DateTime.Now,
                            CreatorUserId = adminUser.Id
                        }
                    }
                },
                new Product
                {
                    Title = "Fiat Seicento Sporting",
                    Description = "Dzień dobry, mamy do sprzedania seicento 1.1 2001. Stan techniczny dobry, syn jeździł cały rok.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    ImageUrl = "images/seicento.webp",
                    CreatorUserId = adminUser.Id,
                    Categories = new List<Category> { categoryVehicles },
                    Comments = new List<Comment>
                    {
                        new Comment
                        {
                            Description = "Siedzenia zostały wymienione, ale w innym kolorze.",
                            IsDeleted = false,
                            CreationDate = DateTime.Now,
                            CreatorUserId = adminUser.Id
                        },
                        new Comment
                        {
                            Description = "Radio sprawne, centralny zamek działa poprawnie.",
                            IsDeleted = false,
                            CreationDate = DateTime.Now,
                            CreatorUserId = adminUser.Id
                        }
                    }
                },
                new Product
                {
                    Title = "Eko Mak Makaron Babuni Świderek",
                    Description = "Makarony Babuni – najwyższej jakości wyroby z unikalnym smakiem trafiające do grona smakoszy.",
                    IsDeleted = false,
                    CreationDate = DateTime.Now,
                    ImageUrl = "images/swiderki.png",
                    CreatorUserId = adminUser.Id,
                    Categories = new List<Category> { categoryFood }
                }
            };


            foreach (var product in products)
            {
                if (product.Comments != null)
                {
                    foreach (var comment in product.Comments)
                    {
                        comment.Product = product;
                    }
                }
            }

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
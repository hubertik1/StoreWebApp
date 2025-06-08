using StoreWebApp.Models;
using System.Linq;

namespace StoreWebApp.Data
{
    public static class SeedData
    {
        public static void Initialize(StoreWebAppContext context)
        {
            if (context.Products.Any())
                return;

            context.Products.AddRange(
                new Product {
                    Title = "SPAWARKA 330A INWERTOROWA MMA Elektrodowa TigLift Pulse",
                    Description = "Profesjonalna spawarka inwertorowa o mocy 200 A, idealna do prac warsztatowych i domowych.",
                    ImageUrl = "images/spawarka.jpg",
                    IsDeleted = false
                },
                new Product {
                    Title = "Little Tikes Lt Piaskownica Żółw",
                    Description = "Oto Twój niezwykły kącik zabaw - zamykana piaskownica Żółw od renomowanej marki Little Tikes, lidera wśród dostawców placów zabaw i zabawek ogrodowych.",
                    ImageUrl = "images/piaskownica.webp",
                    IsDeleted = false
                },
                new Product {
                    Title = "Pomidory Warzywo",
                    Description = "Pomidor charakteryzuje się słodkim smakiem, jędrną czerwoną skórką i soczystym miąższem. To niezwykle popularne warzywo, które pojawiło się w Europie w XVI w.",
                    ImageUrl = "images/pomidor.jpg",
                    IsDeleted = false
                },
                new Product {
                    Title = "Fiat Seicento Sporting",
                    Description = "Dzień dobry mamy do sprzedania seicento 1.1 2001 Stan techniczny dobry syn jeździł cały rok po otrzymaniu prawa jazdy. Wizualne średnio nie opłacił się malować progów i klapy.",
                    ImageUrl = "images/seicento.webp",
                    IsDeleted = false
                },
                new Product {
                    Title = "Eko Mak Makaron Babuni Świderek",
                    Description = "Eko Mak Makaron Babuni świderek 45 1kg Makarony Babuni to najwyższej jakości wyroby, które, swoim wyśmienitym i niepowtarzalnym smakiem trafiają do coraz liczniejszego grona smakoszy.",
                    ImageUrl = "images/swiderki.png",
                    IsDeleted = false
                }
            );

            context.SaveChanges();
        }
    }
}

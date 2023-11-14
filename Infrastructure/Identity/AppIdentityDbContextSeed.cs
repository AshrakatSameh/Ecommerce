using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Ahmed",
                    Email = "Ahmed@test.com",
                    UserName = "Ahmed@test.com",
                    Address = new Address
                    {
                        FirstName = "Ahmed",
                        LastName = "Mokhtar",
                        Street = "18 Street",
                        City = "Minia",
                        State = "Minia",
                        ZipCode = "1234"
                    },
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
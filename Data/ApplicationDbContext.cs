using Microsoft.EntityFrameworkCore;
using DUGUNMETE.Models;

namespace DUGUNMETE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Memory> Memories { get; set; }
        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Memory>()
                .HasMany(m => m.Images)
                .WithOne(i => i.Memory)
                .HasForeignKey(i => i.MemoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

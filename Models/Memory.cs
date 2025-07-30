using System.ComponentModel.DataAnnotations;

namespace DUGUNMETE.Models
{
    public class Memory
    {
        [Key]
        public int Id { get; set; }

        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Bu alan doğru olmalı:
        public List<Image> Images { get; set; } = new();
    }
}

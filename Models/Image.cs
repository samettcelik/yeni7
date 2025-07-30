using System.ComponentModel.DataAnnotations;

namespace DUGUNMETE.Models
{
    public class Image
    {
        [Key]
        public int Id { get; set; }

        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Bu alan eksikti:
        public int MemoryId { get; set; }
        public Memory Memory { get; set; } = null!;
    }
}

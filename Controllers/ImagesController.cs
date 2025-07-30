using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using DUGUNMETE.Data;
using DUGUNMETE.Models;

namespace DUGUNMETE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors]
    public class ImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string message = "")
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Dosya seçilmedi");

                // Maksimum 50MB
                const int maxFileSize = 50 * 1024 * 1024;
                if (file.Length > maxFileSize)
                    return BadRequest("Dosya boyutu 50MB'dan büyük olamaz");

                // Sadece resim türlerine izin ver
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                    return BadRequest("Sadece resim dosyaları yüklenebilir");

                // Görseli byte dizisine çevir
                byte[] imageData;
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    imageData = ms.ToArray();
                }

                // Veritabanına kaydet
                var image = new Image
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Data = imageData,
                    Memory = new Memory
                    {
                        Message = string.IsNullOrWhiteSpace(message) ? "Bugün en güzel gün..." : message
                    },
                    UploadedAt = DateTime.UtcNow
                };

                _context.Images.Add(image);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = image.Id,
                    fileName = image.FileName,
                    contentType = image.ContentType,
                    uploadedAt = image.UploadedAt,
                    message = image.Memory?.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hata: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null) return NotFound();

            return File(image.Data, image.ContentType, image.FileName);
        }

        [HttpGet]
        public async Task<IActionResult> GetImages()
        {
            var images = await _context.Images
                .OrderByDescending(i => i.UploadedAt)
                .Select(i => new
                {
                    i.Id,
                    i.FileName,
                    i.ContentType,
                    i.UploadedAt,
                    i.Memory.Message
                }).ToListAsync();

            return Ok(images);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null) return NotFound();

            _context.Images.Remove(image);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Silindi", deletedId = id });
        }
    }
}

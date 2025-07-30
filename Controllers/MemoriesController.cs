using DUGUNMETE.Data;
using DUGUNMETE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DUGUNMETE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MemoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Memories
        [HttpPost]
        public async Task<IActionResult> CreateMemory([FromForm] string message, [FromForm] List<IFormFile> images)
        {
            Console.WriteLine($"Received POST request - Message: {message}, Images count: {images?.Count ?? 0}");
            foreach (var img in images ?? new List<IFormFile>())
            {
                Console.WriteLine($"Image: {img?.FileName}, Size: {img?.Length} bytes");
            }
            // En az 1 mesaj ve 1 görsel zorunlu
            if (string.IsNullOrWhiteSpace(message))
                return BadRequest("Mesaj zorunludur.");
                
            if (images == null || images.Count == 0)
                return BadRequest("En az 1 görsel zorunludur.");

            // Maksimum 4 görsel
            if (images.Count > 4)
                return BadRequest("En fazla 4 görsel yükleyebilirsiniz.");

            var memory = new Memory
            {
                Message = message,
                CreatedAt = DateTime.UtcNow,
                Images = new List<Image>()
            };

            foreach (var file in images)
            {
                // Dosya kontrolleri
                if (file == null || file.Length == 0)
                    continue;

                // Maksimum 50MB per dosya
                const int maxFileSize = 50 * 1024 * 1024;
                if (file.Length > maxFileSize)
                    return BadRequest($"Dosya '{file.FileName}' boyutu 50MB'dan büyük olamaz.");

                // Sadece resim türlerine izin ver
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                    return BadRequest($"'{file.FileName}' sadece resim dosyaları yüklenebilir.");

                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                var imageData = ms.ToArray();

                var image = new Image
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Data = imageData,
                    UploadedAt = DateTime.UtcNow
                };

                memory.Images.Add(image);
            }

            if (memory.Images.Count == 0)
                return BadRequest("Geçerli görsel dosyası bulunamadı.");

            _context.Memories.Add(memory);
            await _context.SaveChangesAsync();

            return Ok(new { 
                memory.Id, 
                memory.Message, 
                memory.CreatedAt,
                imageCount = memory.Images.Count,
                images = memory.Images.Select(img => new {
                    img.Id,
                    img.FileName,
                    img.ContentType,
                    img.UploadedAt
                }).ToList()
            });
        }

        // GET: api/Memories
        [HttpGet]
        public async Task<IActionResult> GetAllMemories()
        {
            var memories = await _context.Memories
                .Include(m => m.Images)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            var response = memories.Select(m => new
            {
                m.Id,
                m.Message,
                m.CreatedAt,
                Images = m.Images.Select(img => new
                {
                    img.Id,
                    img.FileName,
                    img.ContentType,
                    img.UploadedAt
                }).ToList()
            });

            return Ok(response);
        }

        // GET: api/Memories/story
        [HttpGet("story")]
        public async Task<IActionResult> GetStoryMemories()
        {
            var storyMemories = await _context.Memories
                .Include(m => m.Images)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Message,
                    m.CreatedAt,
                    Images = m.Images.OrderBy(i => i.Id).Select(img => new
                    {
                        img.Id,
                        img.FileName,
                        img.ContentType
                    }).ToList(),
                    FirstImage = m.Images.OrderBy(i => i.Id).Select(img => new
                    {
                        img.Id,
                        img.FileName,
                        img.ContentType
                    }).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(storyMemories);
        }

        // GET: api/Memories/5/image/2
        [HttpGet("{memoryId}/image/{imageId}")]
        public async Task<IActionResult> GetImage(int memoryId, int imageId)
        {
            var image = await _context.Images
                .FirstOrDefaultAsync(i => i.Id == imageId && i.MemoryId == memoryId);

            if (image == null) return NotFound();

            return File(image.Data, image.ContentType, image.FileName);
        }

        // DELETE: api/Memories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMemory(int id)
        {
            var memory = await _context.Memories
                .Include(m => m.Images)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (memory == null)
                return NotFound();

            _context.Memories.Remove(memory);
            await _context.SaveChangesAsync();

            return Ok(new { deleted = id });
        }
    }
}

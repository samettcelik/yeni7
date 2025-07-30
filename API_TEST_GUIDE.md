# 🔧 API Test Rehberi - Sünnet Düğünü Anı Uygulaması

## ✅ Düzeltilen Sorunlar

### 🎯 **Ana Sorun**: Frontend yanlış API endpoints kullanıyordu
- ❌ **Eski**: `fetch('/api/memories')` (küçük harf)
- ✅ **Yeni**: `fetch('/api/Memories')` (büyük harf)

### 🔄 **Güncellenmiş Endpoint'ler**

| Önceki | Yeni | Açıklama |
|--------|------|----------|
| `/api/memories` | `/api/Memories` | Tüm anıları getir |
| `/api/memories/story` | `/api/Memories/story` | Hikaye için son 10 anı |
| `/api/memories` (POST) | `/api/Memories` (POST) | Yeni anı oluştur |
| `/api/memories/{id}/image/{imageId}` | `/api/Memories/{id}/image/{imageId}` | Fotoğraf getir |

## 🧪 Test Komutları

### 1. ✅ Anı Oluşturma (POST)
```bash
curl -X 'POST' \
  'http://localhost:5151/api/Memories' \
  -H 'accept: */*' \
  -H 'Content-Type: multipart/form-data' \
  -F 'message=Test mesajı' \
  -F 'images=@foto1.jpg' \
  -F 'images=@foto2.png'
```

### 2. ✅ Tüm Anıları Getir (GET)
```bash
curl -X 'GET' \
  'http://localhost:5151/api/Memories' \
  -H 'accept: application/json'
```

### 3. ✅ Hikaye Anıları (GET)
```bash
curl -X 'GET' \
  'http://localhost:5151/api/Memories/story' \
  -H 'accept: application/json'
```

### 4. ✅ Fotoğraf Getir (GET)
```bash
curl -X 'GET' \
  'http://localhost:5151/api/Memories/1/image/1' \
  -H 'accept: image/*'
```

## 🎯 Frontend Güncellemeleri

### JavaScript API Calls
```javascript
// ✅ Doğru endpoint'ler
const apiBase = 'http://localhost:5151/api';

// Anıları yükle
fetch(`${apiBase}/Memories`)

// Hikaye yükle  
fetch(`${apiBase}/Memories/story`)

// Anı oluştur
fetch(`${apiBase}/Memories`, {
    method: 'POST',
    body: formData
})

// Fotoğraf URL'i
`${apiBase}/Memories/${memoryId}/image/${imageId}`
```

## 🚀 Uygulama Kullanımı

### Tarayıcıda Test Et:
1. **Ana Sayfa**: `http://localhost:5151`
2. **Swagger API**: `http://localhost:5151/swagger`

### ✅ Çalışması Gereken Özellikler:
- [x] **Anı Ekleme**: 1-4 fotoğraf + mesaj
- [x] **Anı Listesi**: Tüm anılar grid'de görünür
- [x] **Hikaye**: Son 10 anı sürekli döner
- [x] **Fotoğraf Görüntüleme**: Anılarda fotoğraflar görünür
- [x] **Detay Modal**: Anıya tıklayınca detay açılır
- [x] **Dark/Light Mode**: Tema değiştirme çalışır

## 🐛 Debug Adımları

### Browser Console'da Test:
```javascript
// API bağlantısını test et
fetch('http://localhost:5151/api/Memories')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Hikaye test et
fetch('http://localhost:5151/api/Memories/story')
  .then(r => r.json())
  .then(console.log);
```

### Beklenilen Yanıtlar:

#### 1. GET /api/Memories
```json
[
  {
    "id": 1,
    "message": "Test mesajı",
    "createdAt": "2025-07-30T12:27:12.7042376Z",
    "images": [
      {
        "id": 1,
        "fileName": "foto.jpg",
        "contentType": "image/jpeg",
        "uploadedAt": "2025-07-30T12:27:12.7042376Z"
      }
    ]
  }
]
```

#### 2. GET /api/Memories/story
```json
[
  {
    "id": 1,
    "message": "Test mesajı",
    "createdAt": "2025-07-30T12:27:12.7042376Z",
    "firstImage": {
      "id": 1,
      "fileName": "foto.jpg",
      "contentType": "image/jpeg"
    }
  }
]
```

## 🎉 Başarılı Test Senaryosu

1. **Uygulama Başlat**: `dotnet run`
2. **Tarayıcı Aç**: `http://localhost:5151`
3. **Anı Ekle**: Butona tıkla → 1-4 fotoğraf seç → Mesaj yaz → Paylaş
4. **Sonuç Kontrol**: 
   - ✅ Teşekkür modalı açılır
   - ✅ Anı listesinde görünür  
   - ✅ Hikayede döner
   - ✅ Fotoğraflar yüklenir

## 🔧 Port Ayarları

### Program.cs'de:
```csharp
// Port 5151'e sabitleendi
app.Urls.Add("http://localhost:5151");
```

### JavaScript'te:
```javascript
// API base URL
this.apiBase = 'http://localhost:5151/api';
```

Artık tüm API endpoint'leri doğru şekilde eşleşiyor! 🎊
# 🧪 4 Fotoğraf Yükleme Test Rehberi

## ✅ **Yapılan Düzeltmeler:**

### 🔧 **Backend (C#)**
```csharp
[HttpPost]
public async Task<IActionResult> CreateMemory([FromForm] string message, [FromForm] List<IFormFile> images)
```
- ✅ `List<IFormFile> images` parametresi - Birden fazla dosya alır
- ✅ Maksimum 4 dosya kontrolü var
- ✅ Her dosya için boyut kontrolü (Max 50MB)
- ✅ Dosya türü kontrolü (JPEG, PNG, GIF, WebP)

### 🎯 **Frontend (JavaScript)**
```javascript
// Form verisini doğru şekilde oluşturma
const properFormData = new FormData();
properFormData.append('message', message);

// Tüm dosyaları ekle
for (let i = 0; i < files.length; i++) {
    properFormData.append('images', files[i]);
}
```
- ✅ HTML file input'u `multiple` attribute'u var
- ✅ FormData'ya tüm dosyalar ekleniyor
- ✅ Ön izleme 1-4 dosya gösteriyor
- ✅ Drag & drop da 4 dosya sınırı var

## 🧪 **Test Adımları:**

### 1. **Tarayıcı Console'u Açın**
- F12 tuşuna basın
- "Console" sekmesine gidin
- Debug mesajlarını göreceksiniz

### 2. **1 Fotoğraf Testi**
1. ✅ "Anı Ekle" butonuna tıklayın
2. ✅ 1 adet fotoğraf seçin
3. ✅ Mesaj yazın
4. ✅ "Anıyı Paylaş" butonuna basın
5. ✅ Console'da: `Adding 1 files to form data` görmelisiniz

### 3. **2 Fotoğraf Testi**
1. ✅ "Anı Ekle" butonuna tıklayın
2. ✅ 2 adet fotoğraf seçin (Ctrl+Click)
3. ✅ Mesaj yazın
4. ✅ "Anıyı Paylaş" butonuna basın
5. ✅ Console'da: `Adding 2 files to form data` görmelisiniz

### 4. **3 Fotoğraf Testi**
1. ✅ "Anı Ekle" butonuna tıklayın
2. ✅ 3 adet fotoğraf seçin
3. ✅ Mesaj yazın
4. ✅ "Anıyı Paylaş" butonuna basın
5. ✅ Console'da: `Adding 3 files to form data` görmelisiniz

### 5. **4 Fotoğraf Testi (MAXIMUM)**
1. ✅ "Anı Ekle" butonuna tıklayın
2. ✅ 4 adet fotoğraf seçin
3. ✅ Mesaj yazın
4. ✅ "Anıyı Paylaş" butonuna basın
5. ✅ Console'da: `Adding 4 files to form data` görmelisiniz

### 6. **5+ Fotoğraf Testi (HATA KONTROLÜ)**
1. ✅ "Anı Ekle" butonuna tıklayın
2. ✅ 5+ adet fotoğraf seçin
3. ✅ **Uyarı mesajı** çıkmalı: "Maksimum 4 fotoğraf yükleyebilirsiniz"

## 🔍 **Debug Kontrolleri:**

### Browser Console'da Görecekleriniz:
```javascript
// Fotoğraf seçimi
Displaying 3 image previews

// Form gönderimi
Adding 3 files to form data
Adding file 1: photo1.jpg, Size: 2048576 bytes
Adding file 2: photo2.png, Size: 1536432 bytes
Adding file 3: photo3.jpeg, Size: 3072648 bytes
```

### Backend Console'da Görecekleriniz:
```
Received POST request - Message: Test mesajı, Images count: 3
Image: photo1.jpg, Size: 2048576 bytes
Image: photo2.png, Size: 1536432 bytes
Image: photo3.jpeg, Size: 3072648 bytes
```

## 🎯 **Beklenen Sonuçlar:**

### ✅ **Başarılı Durumlar:**
- 1-4 fotoğraf seçimi çalışır
- Ön izleme doğru gösterir
- Form gönderimi başarılı
- Teşekkür modalı açılır
- Hikayede gönderinin ilk fotosu görünür
- Slideshow'da tüm fotoğraflar görünür

### ❌ **Hata Durumları:**
- 5+ fotoğraf seçimi uyarı verir
- 50MB+ dosya uyarı verir
- Video/PDF dosyası uyarı verir
- Mesaj boş bırakılırsa uyarı verir

## 🚀 **Test Sonucu:**

Her test sonrasında kontrol edin:
1. ✅ **Anı listesinde** gönderiniz görünür mü?
2. ✅ **Hikayede** ilk fotoğrafınız görünür mü?
3. ✅ **Hikayeye tıklayınca** slideshow açılır mı?
4. ✅ **Slideshow'da** tüm fotoğraflarınız var mı?
5. ✅ **Sol/sağ oklar** ile geçiş yapılır mı?

## 📱 **Mobil Test:**
- Telefon/tablet'te aynı testleri yapın
- Fotoğraf galerisiсinden seçim yapın
- Kamera ile çekim yapın

Tüm testler başarılıysa 4 fotoğraf yükleme özelliği mükemmel çalışıyor demektir! 🎉
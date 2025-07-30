# 🎉 Sünnet Düğünü Anı Uygulaması

Modern, profesyonel ve kullanıcı dostu bir sünnet düğünü anı paylaşım uygulaması.

## ✨ Özellikler

### 🎨 Tasarım & Tema
- **Erkeksi Mavi Tema**: Sünnet düğününe uygun mavi tonları
- **Dark Mode**: Göz yormayan koyu tema (varsayılan)
- **Light Mode**: Aydınlık tema seçeneği
- **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm
- **Progressive Web App (PWA)**: Mobil uygulama gibi deneyim

### 📸 Anı Paylaşımı
- **1-4 Fotoğraf**: Her anıda en fazla 4 fotoğraf
- **Zorunlu Mesaj**: Her anı için mesaj gerekli
- **Sürükle & Bırak**: Kolay fotoğraf yükleme
- **Önizleme**: Yüklemeden önce fotoğrafları görme
- **Dosya Doğrulama**: Güvenli dosya türleri (JPEG, PNG, GIF, WebP)

### 🎯 Hikaye Özelliği
- **Son 10 Anı**: Otomatik dönen hikaye carousel'ı
- **Dikdörtgen Format**: Modern Instagram benzeri hikaye görünümü
- **Sürekli Döngü**: Hikayelerin sürekli dönmesi
- **Tıklanabilir**: Hikayeye tıklayarak detay görme

### 💫 Kullanıcı Deneyimi
- **Teşekkür Mesajları**: Anı eklendikten sonra teşekkür modalı
- **Konfeti Efekti**: Başarılı işlemler için görsel geri bildirim
- **Yükleme Animasyonları**: Akıcı geçişler ve animasyonlar
- **Toast Bildirimleri**: Hata ve başarı mesajları
- **Karakter Sayacı**: Mesaj uzunluğu takibi (500 karakter)

### 🔧 Teknik Özellikler
- **ASP.NET Core 9.0**: Modern backend
- **Entity Framework**: Veritabanı yönetimi
- **Responsive Design**: Tüm ekran boyutları için uyumlu
- **Service Worker**: Offline çalışma desteği
- **CORS Desteği**: API erişimi için
- **Modern JavaScript**: ES6+ özellikler

## 🚀 Kullanım

### Backend (API)
```bash
cd DUGUNMETE
dotnet run
```

### Frontend
Uygulama çalıştığında otomatik olarak `https://localhost:7XXX` adresinde erişilebilir.

## 📱 API Endpoints

### Anılar
- `GET /api/memories` - Tüm anıları getir
- `GET /api/memories/story` - Hikaye için son 10 anıyı getir
- `POST /api/memories` - Yeni anı oluştur
- `GET /api/memories/{id}/image/{imageId}` - Fotoğraf getir
- `DELETE /api/memories/{id}` - Anı sil

### Özellikler
- **Dosya Boyutu**: Maksimum 50MB per fotoğraf
- **Dosya Türleri**: image/jpeg, image/jpg, image/png, image/gif, image/webp
- **Anı Limiti**: 1-4 fotoğraf per anı
- **Mesaj Limiti**: 500 karakter

## 🎯 Öne Çıkan Özellikler

### 1. Hoş Geldin Mesajı
```
Ben Mete :)
Sünnet düğünümüze hoş geldin! Bu özel günde sizden çekildiğiniz 
fotoğrafları anı albüme eklemenizi istiyorum. Birlikte güzel 
anılar biriktirmeye devam edelim.
```

### 2. Başarı Mesajları
- **Teşekkür Ederim!** - Anı eklendikten sonra
- **Anı biriktirmeye devam edelim** - Devam butonu
- **Rica Ederim** - Teşekkür butonu

### 3. Hikaye Carousel
- Sürekli dönen anı hikayeleri
- Modern dikdörtgen format
- Son 10 anının otomatik gösterimi
- Tıklanabilir detay görünümü

### 4. Responsive Tasarım
- **Desktop**: Geniş grid layout
- **Tablet**: Orta boyut düzeni
- **Mobile**: Tek sütun düzeni
- **iOS Uyumlu**: Apple cihazlar için optimize

## 🎨 Renk Paleti

### Light Mode
- Primary: `#2563eb` (Mavi)
- Secondary: `#0891b2` (Teal)
- Accent: `#3b82f6` (Açık Mavi)

### Dark Mode
- Background: `#0f172a` (Koyu Lacivert)
- Surface: `#1e293b` (Gri-Mavi)
- Primary: `#3b82f6` (Parlak Mavi)
- Secondary: `#06b6d4` (Cyan)

## 🚀 Kurulum

1. **Projeyi Klonlayın**
```bash
git clone [repo-url]
cd dugunmete2
```

2. **Veritabanını Güncelleyin**
```bash
cd DUGUNMETE
dotnet ef database update
```

3. **Uygulamayı Çalıştırın**
```bash
dotnet run
```

4. **Tarayıcıda Açın**
```
https://localhost:7XXX
```

## 📱 PWA Özellikleri

- **Install Prompt**: Uygulamayı ana ekrana ekleme
- **Offline Support**: Service Worker ile cache
- **App Icon**: Mavi tema uygun ikonlar
- **Splash Screen**: Yüklenme ekranı
- **Fullscreen**: Mobil uygulama deneyimi

## 🎉 Kutlama Efektleri

- **Konfeti**: Başarılı anı ekleme sonrası
- **Smooth Animations**: Tüm geçişlerde akıcı animasyonlar
- **Loading States**: Yükleme durumu gösterimi
- **Hover Effects**: Etkileşimli hover efektleri

Sünnet düğününüzün en güzel anılarını paylaşın ve biriktirin! 🎊
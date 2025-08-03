# Discord Kayıt Sistemi - Discord.js v14

**Proje Linki:** [https://github.com/jokerizm3169/kayit-sistemi-v14](https://github.com/jokerizm3169/kayit-sistemi-v14)

Modern ve kapsamlı Discord kayıt sistemi botuna hoş geldiniz! Bu bot, Discord.js v14 kullanılarak geliştirilmiş olup sunucunuzda üye kayıtlarını kolayca yönetmenizi sağlar.

## 🚀 Özellikler

### 📝 Temel Kayıt İşlemleri
- **Form ile Kayıt**: Modal form kullanarak detaylı kayıt
- **Hızlı Kayıt**: Komut parametreleri ile anında kayıt
- **Otomatik İsim Düzenleme**: Kayıt sonrası otomatik nickname ayarlama
- **Rol Yönetimi**: Otomatik rol verme/alma işlemleri

### 🔧 Sistem Yönetimi
- **Tek Seferde Kurulum**: `/kayıt kur` komutu ile tüm sistem kurulumu
- **Esnek Yapılandırma**: Rolleri ve kanalları ayrı ayrı güncelleme
- **Yedekleme Sistemi**: Tüm verilerin JSON formatında yedeği
- **Sistem Sıfırlama**: Güvenli veri temizleme

### 🛡️ Güvenlik
- **Kara Liste**: İstenmeyen kullanıcıların kayıt engellemesi
- **Yaş Kontrolü**: Minimum yaş sınırı belirleme
- **Yeni Hesap Kontrolü**: Hesap yaşı kontrolü
- **Çoklu Hesap Koruması**: Gelişmiş güvenlik önlemleri

### 📊 İstatistik ve Raporlama
- **Yetkili İstatistikleri**: Kayıt yapan yetkilerin performansı
- **Top Lista**: En çok kayıt yapanlar sıralaması
- **Kayıt Geçmişi**: Detaylı kayıt geçmişi takibi
- **Log Sistemi**: Tüm işlemlerin otomatik kaydı

### 🎨 Özelleştirme
- **Embed Renkleri**: Özel renk ayarları
- **Özel Mesajlar**: Hoşgeldin, onay ve DM mesajları
- **Form Alanları**: Dinamik form oluşturma
- **Otomatik İşlemler**: İsim düzenleme ve rol temizleme

## 📋 Komut Listesi

### 🔧 Sistem Kurulumu
```
/kayıt kur erkek-rol:@rol kadın-rol:@rol kayıtsız-rol:@rol yetkili-rol:@rol kayıt-kanal:#kanal log-kanal:#kanal hoşgeldin-kanal:#kanal
/kayıt kapat
/kayıt ayarlar
/kayıt sıfırla
/kayıt yedek
```

### 👤 Üye Kayıt İşlemleri
```
/kayıt üye @kullanıcı
/kayıt hızlı @kullanıcı isim:Mahmut yaş:18 cinsiyet:Erkek
/kayıt düzenle @kullanıcı
/kayıt iptal @kullanıcı sebep:metin
/kayıt bilgi @kullanıcı
/kayıt geçmiş @kullanıcı
```

### 📊 İstatistikler
```
/kayıt istatistik @yetkili
/kayıt top
/kayıt son sayı:10
```

### 🎨 Özelleştirme
```
/kayıt mesaj-ayarla tip:hoşgeldin metin:...
/kayıt embed-renk #ff0000
```

### 🛡️ Güvenlik
```
/kayıt güvenlik yaş-sınırı:16 yeni-hesap:7 çoklu-hesap:aktif
```

### 🚫 Kara Liste
```
/kayıt karaliste ekle @kullanıcı sebep:...
/kayıt karaliste kaldır @kullanıcı
/kayıt karaliste göster
```

### 🔄 Güncelleme
```
/kayıt güncelle tip:erkek-rol değer:@rol
/kayıt güncelle tip:kayıt-kanal değer:#kanal
/kayıt tag-ayarla tag:"• Kayıtsız"
```

## 📦 Kurulum

### 1. Gereksinimleri Yükleyin
```bash
npm install
```

### 2. Konfigürasyon
`config.js` dosyasını düzenleyin:
```javascript
module.exports = {
    token: "BOT_TOKEN_BURAYA",
    clientId: "BOT_CLIENT_ID_BURAYA",
    // Diğer ayarlar...
};
```

### 3. Bot İzinleri
Botunuzun aşağıdaki izinlere sahip olduğundan emin olun:
- ✅ Rolleri Yönet
- ✅ Kullanıcı İsimlerini Yönet
- ✅ Mesaj Gönder
- ✅ Mesaj Geçmişini Oku
- ✅ Embed Bağlantıları
- ✅ Dosya Ekle
- ✅ Slash Komutları Kullan

### 4. Botu Başlatın
```bash
npm start
```

## 🏗️ İlk Kurulum

1. **Rolleri Oluşturun**: Erkek, Kadın, Kayıtsız ve Yetkili rolleri oluşturun
2. **Kanalları Oluşturun**: Kayıt, Log ve Hoşgeldin kanalları oluşturun
3. **Sistemi Kurun**: `/kayıt kur` komutunu kullanarak sistemi tek seferde kurun
4. **Ayarları Kontrol Edin**: `/kayıt ayarlar` ile kurulumu doğrulayın

## 📁 Dosya Yapısı
```
📦 kayıt-sistemi/
├── 📄 index.js          # Ana bot dosyası
├── 📄 config.js         # Konfigürasyon dosyası
├── 📄 package.json      # Paket bilgileri
├── 📁 komutlar/         # Komut dosyaları
│   └── 📄 kayıt.js      # Ana kayıt komutu
├── 📁 data/             # Sunucu verileri (otomatik oluşur)
│   └── 📄 {guildId}.json
└── 📄 README.md         # Bu dosya
```

## 🔧 Geliştirme

### Yeni Komut Eklemek
`komutlar/` klasörüne yeni `.js` dosyası ekleyin:
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('komut-adi')
        .setDescription('Komut açıklaması'),
    async execute(interaction) {
        // Komut kodu
    },
};
```

### Veri Yapısı
Her sunucu için `data/{guildId}.json` dosyasında şu veriler saklanır:
```json
{
  "enabled": true,
  "roles": {
    "male": "123456789",
    "female": "987654321",
    "unregistered": "456789123",
    "staff": "789123456"
  },
  "channels": {
    "register": "123456789",
    "log": "987654321",
    "welcome": "456789123"
  },
  "stats": {},
  "blacklist": [],
  "registrations": []
}
```

## ❗ Önemli Notlar

- **Node.js v16.9.0** veya üzeri gereklidir
- **Discord.js v14** kullanılmaktadır
- Veriler JSON dosyalarında saklanır (büyük sunucular için veritabanı önerilir)
- Bot sürekli online olmalıdır
- Yetki seviyeleri Discord izinlerine dayanır

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. README dosyasını tekrar okuyun
2. Konsol çıktılarını kontrol edin
3. Bot izinlerini doğrulayın
4. Discord.js v14 dökümanlarına bakın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu bot eğitim amaçlı geliştirilmiştir. Ticari kullanım için uygun değildir.

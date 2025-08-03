const { Client, GatewayIntentBits, Collection, REST, Routes, ActivityType } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const path = require('path');

// Bot oluşturma
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// Komut koleksiyonu
client.commands = new Collection();

// Veritabanı dosyaları
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Komutları yükleme
const commandsPath = path.join(__dirname, 'komutlar');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[UYARI] ${filePath} komutunda "data" veya "execute" özelliği eksik.`);
    }
}

// Eventleri yükleme
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Bot hazır olduğunda
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
    
    // Bot durumunu ayarla
    const activityType = ActivityType[config.status.type] || ActivityType.Playing;
    client.user.setPresence({
        activities: [{ name: config.status.name, type: activityType }],
        status: 'online',
    });
    
    // Komutları kaydet
    await registerCommands();
});

// Komutları Discord'a kaydetme
async function registerCommands() {
    const commands = [];
    
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }
    
    const rest = new REST({ version: '10' }).setToken(config.token);
    
    try {
        console.log(`🔄 ${commands.length} adet slash komut yükleniyor...`);
        
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
        
        console.log(`✅ ${commands.length} adet slash komut başarıyla yüklendi!`);
    } catch (error) {
        console.error('❌ Komutlar yüklenirken hata oluştu:', error);
    }
}


// Sunucu verilerini yükleme
function loadGuildData(guildId) {
    const filePath = `./data/${guildId}.json`;
    
    if (!fs.existsSync(filePath)) {
        const defaultData = {
            enabled: false,
            roles: {
                male: null,
                female: null,
                unregistered: null,
                registerStaff: null,
                seniorStaff: null
            },
            channels: {
                register: null,
                log: null,
                welcome: null
            },
            embedColor: config.embedColor,
            security: config.security,
            automation: config.automation,
            customMessages: {
                welcome: null,
                approval: null,
                dm: null
            },
            blacklist: [],
            stats: {},
            formFields: [
                { name: 'isim', type: 'text', required: true },
                { name: 'yaş', type: 'number', required: true },
                { name: 'cinsiyet', type: 'select', required: true, options: ['Erkek', 'Kadın'] }
            ]
        };
        
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Sunucu verilerini kaydetme
function saveGuildData(guildId, data) {
    const filePath = `./data/${guildId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// İsim formatlama fonksiyonu
function formatName(name) {
    // İlk harfi büyük, diğerleri küçük yap
    return name.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Global fonksiyonlar
global.loadGuildData = loadGuildData;
global.saveGuildData = saveGuildData;
global.formatName = formatName;

// Hata yakalama
process.on('unhandledRejection', error => {
    console.error('❌ Yakalanmamış Promise Reddi:', error);
});

process.on('uncaughtException', error => {
    console.error('❌ Yakalanmamış İstisna:', error);
    process.exit(1);
});

// Bot giriş
client.login(config.token);

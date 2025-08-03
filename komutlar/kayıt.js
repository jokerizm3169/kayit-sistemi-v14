const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt')
        .setDescription('Kayıt sistemi komutları')
        .addSubcommand(subcommand =>
            subcommand
                .setName('kur')
                .setDescription('Kayıt sistemini kur')
                .addRoleOption(option =>
                    option.setName('erkek-rol')
                        .setDescription('Erkek rolü')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('kadın-rol')
                        .setDescription('Kadın rolü')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('kayıtsız-rol')
                        .setDescription('Kayıtsız rolü')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('kayıt-sorumlusu-rol')
                        .setDescription('Kayıt yapacak rol')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('üst-kayıt-sorumlusu-rol')
                        .setDescription('Botun yönetim komutlarını kullanacak rol')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('kayıt-kanal')
                        .setDescription('Kayıt kanalı')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('log-kanal')
                        .setDescription('Log kanalı')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('hoşgeldin-kanal')
                        .setDescription('Hoşgeldin kanalı')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kapat')
                .setDescription('Kayıt sistemini kapat'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ayarlar')
                .setDescription('Mevcut ayarları görüntüle'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('sıfırla')
                .setDescription('Tüm verileri sıfırla'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('yedek')
                .setDescription('Sistem yedeği al'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('üye')
                .setDescription('Üye kayıt et (form ile)')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Kayıt edilecek kullanıcı')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('hızlı')
                .setDescription('Hızlı kayıt (form olmadan)')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Kayıt edilecek kullanıcı')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('isim')
                        .setDescription('Kullanıcının ismi')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('yaş')
                        .setDescription('Kullanıcının yaşı')
                        .setRequired(true)
                        .setMinValue(13)
                        .setMaxValue(99))
                .addStringOption(option =>
                    option.setName('cinsiyet')
                        .setDescription('Kullanıcının cinsiyeti')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Erkek', value: 'erkek' },
                            { name: 'Kadın', value: 'kadın' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('düzenle')
                .setDescription('Mevcut kaydı düzenle')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Düzenlenecek kullanıcı')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('iptal')
                .setDescription('Kaydı iptal et')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Kaydı iptal edilecek kullanıcı')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('sebep')
                        .setDescription('İptal sebebi')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bilgi')
                .setDescription('Kullanıcının kayıt bilgilerini göster')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Bilgileri görüntülenecek kullanıcı')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('geçmiş')
                .setDescription('Kullanıcının kayıt geçmişini göster')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('Geçmişi görüntülenecek kullanıcı')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('istatistik')
                .setDescription('Yetkili istatistikleri')
                .addUserOption(option =>
                    option.setName('yetkili')
                        .setDescription('İstatistikleri görüntülenecek yetkili')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('top')
                .setDescription('En çok kayıt yapanlar'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('son')
                .setDescription('Son kayıtlar')
                .addIntegerOption(option =>
                    option.setName('sayı')
                        .setDescription('Gösterilecek kayıt sayısı')
                        .setRequired(false)
                        .setMinValue(1)
                        .setMaxValue(20)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mesaj-ayarla')
                .setDescription('Mesajları özelleştir')
                .addStringOption(option =>
                    option.setName('tip')
                        .setDescription('Mesaj tipi')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Hoşgeldin Mesajı', value: 'hoşgeldin' },
                            { name: 'Onay Mesajı', value: 'onay' },
                            { name: 'DM Mesajı', value: 'dm' }
                        ))
                .addStringOption(option =>
                    option.setName('metin')
                        .setDescription('Mesaj metni')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('embed-renk')
                .setDescription('Embed rengi ayarla')
                .addStringOption(option =>
                    option.setName('renk')
                        .setDescription('Hex renk kodu (#ff0000)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('güvenlik')
                .setDescription('Güvenlik ayarları')
                .addIntegerOption(option =>
                    option.setName('yaş-sınırı')
                        .setDescription('Minimum yaş sınırı')
                        .setRequired(false)
                        .setMinValue(13)
                        .setMaxValue(25))
                .addIntegerOption(option =>
                    option.setName('yeni-hesap')
                        .setDescription('Yeni hesap kontrolü (gün)')
                        .setRequired(false)
                        .setMinValue(0)
                        .setMaxValue(30))
                .addStringOption(option =>
                    option.setName('çoklu-hesap')
                        .setDescription('Çoklu hesap kontrolü')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Aktif', value: 'aktif' },
                            { name: 'Pasif', value: 'pasif' }
                        )))
        .addSubcommandGroup(group =>
            group
                .setName('karaliste')
                .setDescription('Kara liste işlemleri')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('ekle')
                        .setDescription('Kullanıcıyı kara listeye ekle')
                        .addUserOption(option =>
                            option.setName('kullanıcı')
                                .setDescription('Kara listeye eklenecek kullanıcı')
                                .setRequired(true))
                        .addStringOption(option =>
                            option.setName('sebep')
                                .setDescription('Kara listeye ekleme sebebi')
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('kaldır')
                        .setDescription('Kullanıcıyı kara listeden çıkar')
                        .addUserOption(option =>
                            option.setName('kullanıcı')
                                .setDescription('Kara listeden çıkarılacak kullanıcı')
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('göster')
                        .setDescription('Kara listeyi görüntüle')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('oto-ayar')
                .setDescription('Otomatik işlemler')
                .addStringOption(option =>
                    option.setName('isim-düzenleme')
                        .setDescription('İsim düzenleme')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Aktif', value: 'aktif' },
                            { name: 'Pasif', value: 'pasif' }
                        ))
                .addStringOption(option =>
                    option.setName('rol-temizleme')
                        .setDescription('Rol temizleme')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Aktif', value: 'aktif' },
                            { name: 'Pasif', value: 'pasif' }
                        )))
        .addSubcommandGroup(group =>
            group
                .setName('form-alan')
                .setDescription('Form alanı işlemleri')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('ekle')
                        .setDescription('Form alanı ekle')
                        .addStringOption(option =>
                            option.setName('isim')
                                .setDescription('Alan ismi')
                                .setRequired(true))
                        .addStringOption(option =>
                            option.setName('tip')
                                .setDescription('Alan tipi')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Metin', value: 'metin' },
                                    { name: 'Sayı', value: 'sayı' },
                                    { name: 'Seçim', value: 'seçim' }
                                ))
                        .addStringOption(option =>
                            option.setName('zorunlu')
                                .setDescription('Zorunlu alan mı?')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Evet', value: 'evet' },
                                    { name: 'Hayır', value: 'hayır' }
                                )))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('kaldır')
                        .setDescription('Form alanı kaldır')
                        .addStringOption(option =>
                            option.setName('isim')
                                .setDescription('Kaldırılacak alan ismi')
                                .setRequired(true))))
        .addSubcommand(subcommand =>
            subcommand
                .setName('form-görüntüle')
                .setDescription('Mevcut form yapısını göster'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('güncelle')
                .setDescription('Ayarları güncelle')
                .addStringOption(option =>
                    option.setName('tip')
                        .setDescription('Güncellenecek ayar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Erkek Rol', value: 'erkek-rol' },
                            { name: 'Kadın Rol', value: 'kadın-rol' },
                            { name: 'Kayıtsız Rol', value: 'kayıtsız-rol' },
                            { name: 'Yetkili Rol', value: 'yetkili-rol' },
                            { name: 'Kayıt Kanal', value: 'kayıt-kanal' },
                            { name: 'Log Kanal', value: 'log-kanal' },
                            { name: 'Hoşgeldin Kanal', value: 'hoşgeldin-kanal' }
                        ))
                .addStringOption(option =>
                    option.setName('değer')
                        .setDescription('Yeni değer (rol/kanal ID)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('tag-ayarla')
                .setDescription('Kayıtsız kullanıcılar için tag ayarla')
                .addStringOption(option =>
                    option.setName('tag')
                        .setDescription('Kayıtsız tag (örn: • Kayıtsız)')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const guildData = loadGuildData(interaction.guild.id);

        // Yetki kontrolü
        const isOwner = interaction.member.id === interaction.guild.ownerId;
        const hasSeniorPerm = guildData.roles.seniorStaff && interaction.member.roles.cache.has(guildData.roles.seniorStaff);

        if (!isOwner && !hasSeniorPerm) {
            const hasRegisterPerm = guildData.roles.registerStaff && interaction.member.roles.cache.has(guildData.roles.registerStaff);
            const allowedCommandsForRegisterStaff = ['üye', 'bilgi', 'geçmiş', 'hızlı'];

            if (!hasRegisterPerm || !allowedCommandsForRegisterStaff.includes(subcommand)) {
                return await interaction.reply({
                    content: '❌ Bu komutu kullanmak için yetkiniz bulunmuyor!',
                    ephemeral: true
                });
            }
        }

        try {
            if (subcommandGroup === 'karaliste') {
                await handleBlacklistCommands(interaction, subcommand, guildData);
            } else if (subcommandGroup === 'form-alan') {
                await handleFormFieldCommands(interaction, subcommand, guildData);
            } else {
                switch (subcommand) {
                    case 'kur':
                        await handleSetupCommand(interaction, guildData);
                        break;
                    case 'kapat':
                        await handleCloseCommand(interaction, guildData);
                        break;
                    case 'ayarlar':
                        await handleSettingsCommand(interaction, guildData);
                        break;
                    case 'sıfırla':
                        await handleResetCommand(interaction, guildData);
                        break;
                    case 'yedek':
                        await handleBackupCommand(interaction, guildData);
                        break;
                    case 'üye':
                        await handleMemberCommand(interaction, guildData);
                        break;
                    case 'hızlı':
                        await handleQuickRegisterCommand(interaction, guildData);
                        break;
                    case 'düzenle':
                        await handleEditCommand(interaction, guildData);
                        break;
                    case 'iptal':
                        await handleCancelCommand(interaction, guildData);
                        break;
                    case 'bilgi':
                        await handleInfoCommand(interaction, guildData);
                        break;
                    case 'geçmiş':
                        await handleHistoryCommand(interaction, guildData);
                        break;
                    case 'istatistik':
                        await handleStatsCommand(interaction, guildData);
                        break;
                    case 'top':
                        await handleTopCommand(interaction, guildData);
                        break;
                    case 'son':
                        await handleRecentCommand(interaction, guildData);
                        break;
                    case 'mesaj-ayarla':
                        await handleMessageCommand(interaction, guildData);
                        break;
                    case 'embed-renk':
                        await handleColorCommand(interaction, guildData);
                        break;
                    case 'güvenlik':
                        await handleSecurityCommand(interaction, guildData);
                        break;
                    case 'oto-ayar':
                        await handleAutoCommand(interaction, guildData);
                        break;
                    case 'form-görüntüle':
                        await handleFormDisplayCommand(interaction, guildData);
                        break;
                    case 'güncelle':
                        await handleUpdateCommand(interaction, guildData);
                        break;
                    case 'tag-ayarla':
                        await handleTagSetCommand(interaction, guildData);
                        break;
                    default:
                        await interaction.reply({
                            content: '❌ Bilinmeyen komut!',
                            ephemeral: true
                        });
                }
            }
        } catch (error) {
            console.error('Komut hatası:', error);
            const errorMessage = '❌ Komut çalıştırılırken bir hata oluştu!';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
};

// Sistem kurulum komutu
async function handleSetupCommand(interaction, guildData) {
    const maleRole = interaction.options.getRole('erkek-rol');
    const femaleRole = interaction.options.getRole('kadın-rol');
    const unregisteredRole = interaction.options.getRole('kayıtsız-rol');
    const registerStaffRole = interaction.options.getRole('kayıt-sorumlusu-rol');
    const seniorStaffRole = interaction.options.getRole('üst-kayıt-sorumlusu-rol');
    const registerChannel = interaction.options.getChannel('kayıt-kanal');
    const logChannel = interaction.options.getChannel('log-kanal');
    const welcomeChannel = interaction.options.getChannel('hoşgeldin-kanal');

    guildData.enabled = true;
    guildData.roles.male = maleRole.id;
    guildData.roles.female = femaleRole.id;
    guildData.roles.unregistered = unregisteredRole.id;
    guildData.roles.registerStaff = registerStaffRole.id;
    guildData.roles.seniorStaff = seniorStaffRole.id;
    guildData.channels.register = registerChannel.id;
    guildData.channels.log = logChannel.id;
    guildData.channels.welcome = welcomeChannel.id;

    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('✅ Kayıt Sistemi Kuruldu!')
        .setDescription('Kayıt sistemi başarıyla kuruldu ve aktif hale getirildi.')
        .addFields(
            { name: '👨 Erkek Rol', value: `${maleRole}`, inline: true },
            { name: '👩 Kadın Rol', value: `${femaleRole}`, inline: true },
            { name: '❓ Kayıtsız Rol', value: `${unregisteredRole}`, inline: true },
            { name: '👮 Kayıt Sorumlusu', value: `${registerStaffRole}`, inline: true },
            { name: '👑 Üst Kayıt Sorumlusu', value: `${seniorStaffRole}`, inline: true },
            { name: '📝 Kayıt Kanal', value: `${registerChannel}`, inline: true },
            { name: '📋 Log Kanal', value: `${logChannel}`, inline: true },
            { name: '👋 Hoşgeldin Kanal', value: `${welcomeChannel}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    await interaction.reply({ embeds: [embed] });
}

// Sistem kapatma komutu
async function handleCloseCommand(interaction, guildData) {
    if (!guildData.enabled) {
        return await interaction.reply({
            content: '❌ Kayıt sistemi zaten kapalı!',
            ephemeral: true
        });
    }

    guildData.enabled = false;
    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔒 Kayıt Sistemi Kapatıldı')
        .setDescription('Kayıt sistemi devre dışı bırakıldı.')
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

// Ayarları görüntüleme komutu
async function handleSettingsCommand(interaction, guildData) {
    const guild = interaction.guild;
    
    const maleRole = guildData.roles.male ? guild.roles.cache.get(guildData.roles.male) : null;
    const femaleRole = guildData.roles.female ? guild.roles.cache.get(guildData.roles.female) : null;
    const unregisteredRole = guildData.roles.unregistered ? guild.roles.cache.get(guildData.roles.unregistered) : null;
    const registerStaffRole = guildData.roles.registerStaff ? guild.roles.cache.get(guildData.roles.registerStaff) : null;
    const seniorStaffRole = guildData.roles.seniorStaff ? guild.roles.cache.get(guildData.roles.seniorStaff) : null;
    
    const registerChannel = guildData.channels.register ? guild.channels.cache.get(guildData.channels.register) : null;
    const logChannel = guildData.channels.log ? guild.channels.cache.get(guildData.channels.log) : null;
    const welcomeChannel = guildData.channels.welcome ? guild.channels.cache.get(guildData.channels.welcome) : null;

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('⚙️ Kayıt Sistemi Ayarları')
        .setDescription(`**Durum:** ${guildData.enabled ? '🟢 Aktif' : '🔴 Pasif'}`)
        .addFields(
            { name: '👨 Erkek Rol', value: maleRole ? `${maleRole}` : '❌ Ayarlanmamış', inline: true },
            { name: '👩 Kadın Rol', value: femaleRole ? `${femaleRole}` : '❌ Ayarlanmamış', inline: true },
            { name: '❓ Kayıtsız Rol', value: unregisteredRole ? `${unregisteredRole}` : '❌ Ayarlanmamış', inline: true },
            { name: '👮 Kayıt Sorumlusu', value: registerStaffRole ? `${registerStaffRole}` : '❌ Ayarlanmamış', inline: true },
            { name: '👑 Üst Kayıt Sorumlusu', value: seniorStaffRole ? `${seniorStaffRole}` : '❌ Ayarlanmamış', inline: true },
            { name: '📝 Kayıt Kanal', value: registerChannel ? `${registerChannel}` : '❌ Ayarlanmamış', inline: true },
            { name: '📋 Log Kanal', value: logChannel ? `${logChannel}` : '❌ Ayarlanmamış', inline: true },
            { name: '👋 Hoşgeldin Kanal', value: welcomeChannel ? `${welcomeChannel}` : '❌ Ayarlanmamış', inline: true },
            { name: '🎨 Embed Rengi', value: guildData.embedColor, inline: true },
            { name: '🔒 Minimum Yaş', value: `${guildData.security.minAge}`, inline: true },
            { name: '📅 Yeni Hesap Kontrolü', value: `${guildData.security.newAccountDays} gün`, inline: true },
            { name: '🛡️ Çoklu Hesap Kontrolü', value: guildData.security.multipleAccountCheck ? '✅ Aktif' : '❌ Pasif', inline: true },
            { name: '🤖 İsim Düzenleme', value: guildData.automation.nameEdit ? '✅ Aktif' : '❌ Pasif', inline: true },
            { name: '🧹 Rol Temizleme', value: guildData.automation.roleCleanup ? '✅ Aktif' : '❌ Pasif', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    await interaction.reply({ embeds: [embed] });
}

// Sistem sıfırlama komutu
async function handleResetCommand(interaction, guildData) {
    const confirmEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('⚠️ Dikkat!')
        .setDescription('Bu işlem tüm kayıt verilerini siler ve geri alınamaz!\n\n**Silinecek veriler:**\n• Tüm kayıt geçmişi\n• İstatistikler\n• Kara liste\n• Özel ayarlar\n\nDevam etmek istediğinizden emin misiniz?');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_reset')
                .setLabel('Evet, Sıfırla')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('cancel_reset')
                .setLabel('İptal')
                .setStyle(ButtonStyle.Secondary)
        );

    await interaction.reply({ embeds: [confirmEmbed], components: [row], ephemeral: true });

    try {
        const confirmation = await interaction.followUp({
            content: 'Onay bekleniyor...',
            ephemeral: true
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_reset') {
                // Sunucu verilerini sıfırla
                const defaultData = {
                    enabled: false,
                    roles: { male: null, female: null, unregistered: null, staff: null },
                    channels: { register: null, log: null, welcome: null },
                    embedColor: '#00ff00',
                    security: { minAge: 13, newAccountDays: 7, multipleAccountCheck: true },
                    automation: { nameEdit: true, roleCleanup: true },
                    customMessages: { welcome: null, approval: null, dm: null },
                    blacklist: [],
                    stats: {},
                    formFields: [
                        { name: 'isim', type: 'text', required: true },
                        { name: 'yaş', type: 'number', required: true },
                        { name: 'cinsiyet', type: 'select', required: true, options: ['Erkek', 'Kadın'] }
                    ]
                };

                saveGuildData(interaction.guild.id, defaultData);

                const resetEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('🗑️ Sistem Sıfırlandı')
                    .setDescription('Tüm kayıt verileri başarıyla sıfırlandı.')
                    .setTimestamp();

                await i.update({ embeds: [resetEmbed], components: [] });
            } else {
                await i.update({ content: '❌ İşlem iptal edildi.', embeds: [], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: '⏰ Zaman aşımı! İşlem iptal edildi.', embeds: [], components: [] });
            }
        });
    } catch (error) {
        console.error('Sıfırlama hatası:', error);
    }
}

// Yedek alma komutu
async function handleBackupCommand(interaction, guildData) {
    const backupData = {
        guildId: interaction.guild.id,
        guildName: interaction.guild.name,
        backupDate: new Date().toISOString(),
        data: guildData
    };

    const backupJson = JSON.stringify(backupData, null, 2);
    const buffer = Buffer.from(backupJson, 'utf8');

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('💾 Sistem Yedeği')
        .setDescription('Kayıt sistemi yedeği başarıyla oluşturuldu.')
        .addFields(
            { name: '📅 Yedek Tarihi', value: new Date().toLocaleString('tr-TR'), inline: true },
            { name: '📊 Sunucu', value: interaction.guild.name, inline: true }
        )
        .setTimestamp();

    await interaction.reply({
        embeds: [embed],
        files: [{
            attachment: buffer,
            name: `kayit-yedek-${interaction.guild.id}-${Date.now()}.json`
        }]
    });
}

// Üye kayıt komutu (form ile)
async function handleMemberCommand(interaction, guildData) {
    if (!guildData.enabled) {
        return await interaction.reply({
            content: '❌ Kayıt sistemi kapalı!',
            ephemeral: true
        });
    }

    const user = interaction.options.getUser('kullanıcı');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        return await interaction.reply({
            content: '❌ Kullanıcı bu sunucuda bulunamadı!',
            ephemeral: true
        });
    }

    // Kara liste kontrolü
    const blacklistEntry = guildData.blacklist.find(entry => entry.userId === user.id);
    if (blacklistEntry) {
        return await interaction.reply({
            content: `❌ Bu kullanıcı kara listede! Sebep: ${blacklistEntry.reason}`,
            ephemeral: true
        });
    }

    // Güvenlik kontrolleri
    const accountAge = Date.now() - user.createdTimestamp;
    const daysDiff = Math.floor(accountAge / (1000 * 60 * 60 * 24));

    if (daysDiff < guildData.security.newAccountDays) {
        return await interaction.reply({
            content: `❌ Bu hesap çok yeni! Minimum ${guildData.security.newAccountDays} gün gerekli.`,
            ephemeral: true
        });
    }

    // Form modalı oluştur
    const modal = new ModalBuilder()
        .setCustomId(`register_form_${user.id}`)
        .setTitle('Kayıt Formu');

    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('İsim')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Gerçek isminizi yazın');

    const ageInput = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('Yaş')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('18');

    const nameRow = new ActionRowBuilder().addComponents(nameInput);
    const ageRow = new ActionRowBuilder().addComponents(ageInput);

    modal.addComponents(nameRow, ageRow);

    await interaction.showModal(modal);
}

// Hızlı kayıt komutu
async function handleQuickRegisterCommand(interaction, guildData) {
    if (!guildData.enabled) {
        return await interaction.reply({
            content: '❌ Kayıt sistemi kapalı!',
            ephemeral: true
        });
    }

    const user = interaction.options.getUser('kullanıcı');
    const name = interaction.options.getString('isim');
    const age = interaction.options.getInteger('yaş');
    const gender = interaction.options.getString('cinsiyet');
    
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        return await interaction.reply({
            content: '❌ Kullanıcı bu sunucuda bulunamadı!',
            ephemeral: true
        });
    }

    // Kara liste kontrolü
    const blacklistEntry = guildData.blacklist.find(entry => entry.userId === user.id);
    if (blacklistEntry) {
        return await interaction.reply({
            content: `❌ Bu kullanıcı kara listede! Sebep: ${blacklistEntry.reason}`,
            ephemeral: true
        });
    }

    // Güvenlik kontrolleri
    if (age < guildData.security.minAge) {
        return await interaction.reply({
            content: `❌ Yaş minimum ${guildData.security.minAge} olmalıdır!`,
            ephemeral: true
        });
    }

    const accountAge = Date.now() - user.createdTimestamp;
    const daysDiff = Math.floor(accountAge / (1000 * 60 * 60 * 24));

    if (daysDiff < guildData.security.newAccountDays) {
        return await interaction.reply({
            content: `❌ Bu hesap çok yeni! Minimum ${guildData.security.newAccountDays} gün gerekli.`,
            ephemeral: true
        });
    }

    await registerUser(interaction, member, { name, age, gender }, guildData);
}

// Kullanıcı kayıt fonksiyonu
async function registerUser(interaction, member, data, guildData) {
    try {
        let { name, age, gender } = data;
        
        // İsmi formatla (ilk harfi büyük)
        name = formatName(name);
        
        // Rolleri ayarla
        const rolesToRemove = [guildData.roles.unregistered].filter(Boolean);
        const roleToAdd = gender === 'erkek' ? guildData.roles.male : guildData.roles.female;

        if (guildData.automation.roleCleanup && rolesToRemove.length > 0) {
            await member.roles.remove(rolesToRemove);
        }

        if (roleToAdd) {
            await member.roles.add(roleToAdd);
        }

        // İsim değiştir
        if (guildData.automation.nameEdit) {
            const tag = guildData.unregisteredTag ? `${guildData.unregisteredTag} ` : '';
            const newNickname = `${tag}${name} | ${age}`;
            try {
                if (newNickname.length <= 32) {
                    await member.setNickname(newNickname);
                } else {
                    await member.setNickname(`${name} | ${age}`); // Fallback if tag makes it too long
                }
            } catch (error) {
                console.log('İsim değiştirilemedi:', error.message);
            }
        }

        // Kayıt verisini kaydet
        const registrationData = {
            userId: member.id,
            username: member.user.username,
            name: name,
            age: age,
            gender: gender,
            registeredBy: interaction.user.id,
            registeredAt: new Date().toISOString(),
            type: 'register'
        };

        // İstatistikleri güncelle
        if (!guildData.stats[interaction.user.id]) {
            guildData.stats[interaction.user.id] = { total: 0, male: 0, female: 0 };
        }
        guildData.stats[interaction.user.id].total++;
        if (gender === 'erkek') {
            guildData.stats[interaction.user.id].male++;
        } else if (gender === 'kadın') {
            guildData.stats[interaction.user.id].female++;
        }

        // Kayıt geçmişini kaydet
        if (!guildData.registrations) guildData.registrations = [];
        guildData.registrations.push(registrationData);

        saveGuildData(interaction.guild.id, guildData);

        // Başarı mesajı
        const embed = new EmbedBuilder()
            .setColor(guildData.embedColor)
            .setTitle('✅ Kayıt Tamamlandı!')
            .setDescription(`${member} başarıyla kayıt edildi!`)
            .addFields(
                { name: '👤 İsim', value: name, inline: true },
                { name: '🎂 Yaş', value: age.toString(), inline: true },
                { name: '⚧️ Cinsiyet', value: gender === 'erkek' ? 'Erkek' : 'Kadın', inline: true },
                { name: '👮 Yetkili', value: `${interaction.user}`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

    await interaction.reply({ embeds: [embed] });

        // Send public confirmation to the registration channel
        if (guildData.channels.register) {
            const registerChannel = interaction.guild.channels.cache.get(guildData.channels.register);
            if (registerChannel) {
                const confirmationEmbed = new EmbedBuilder()
                    .setColor(guildData.embedColor)
                    .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
                    .setDescription(`${member} aramıza katıldı! Hoş geldin! 🎉`)
                    .setTimestamp();
                
                await registerChannel.send({ embeds: [confirmationEmbed] });
            }
        }

        // Log kanalına gönder
        if (guildData.channels.log) {
            const logChannel = interaction.guild.channels.cache.get(guildData.channels.log);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(guildData.embedColor)
                    .setTitle('📝 Yeni Kayıt')
                    .setDescription(`**Kayıt Edildi:** ${member} (${member.id})`)
                    .addFields(
                        { name: 'İsim', value: name, inline: true },
                        { name: 'Yaş', value: age.toString(), inline: true },
                        { name: 'Cinsiyet', value: gender === 'erkek' ? 'Erkek' : 'Kadın', inline: true },
                        { name: 'Yetkili', value: `${interaction.user} (${interaction.user.id})`, inline: false }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        // DM mesajı gönder
        try {
            const dmEmbed = new EmbedBuilder()
                .setColor(guildData.embedColor)
                .setTitle('🎉 Kayıt Tamamlandı!')
                .setDescription(`**${interaction.guild.name}** sunucusunda başarıyla kayıt oldunuz!`)
                .addFields(
                    { name: 'İsim', value: name, inline: true },
                    { name: 'Yaş', value: age.toString(), inline: true },
                    { name: 'Cinsiyet', value: gender === 'erkek' ? 'Erkek' : 'Kadın', inline: true }
                )
                .setTimestamp();

            await member.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.log('DM gönderilemedi:', error.message);
        }

    } catch (error) {
        console.error('Kayıt hatası:', error);
        await interaction.followUp({
            content: '❌ Kayıt işlemi sırasında bir hata oluştu!',
            ephemeral: true
        });
    }
}

// Kara liste komutları
async function handleBlacklistCommands(interaction, subcommand, guildData) {
    switch (subcommand) {
        case 'ekle':
            const userToAdd = interaction.options.getUser('kullanıcı');
            const reason = interaction.options.getString('sebep');

            const existingEntry = guildData.blacklist.find(entry => entry.userId === userToAdd.id);
            if (existingEntry) {
                return await interaction.reply({
                    content: '❌ Bu kullanıcı zaten kara listede!',
                    ephemeral: true
                });
            }

            guildData.blacklist.push({
                userId: userToAdd.id,
                username: userToAdd.username,
                reason: reason,
                addedBy: interaction.user.id,
                addedAt: new Date().toISOString()
            });

            saveGuildData(interaction.guild.id, guildData);

            const addEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🚫 Kara Listeye Eklendi')
                .setDescription(`${userToAdd} kara listeye eklendi.`)
                .addFields(
                    { name: 'Sebep', value: reason, inline: false },
                    { name: 'Yetkili', value: `${interaction.user}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [addEmbed] });
            break;

        case 'kaldır':
            const userToRemove = interaction.options.getUser('kullanıcı');
            const entryIndex = guildData.blacklist.findIndex(entry => entry.userId === userToRemove.id);

            if (entryIndex === -1) {
                return await interaction.reply({
                    content: '❌ Bu kullanıcı kara listede değil!',
                    ephemeral: true
                });
            }

            guildData.blacklist.splice(entryIndex, 1);
            saveGuildData(interaction.guild.id, guildData);

            const removeEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Kara Listeden Çıkarıldı')
                .setDescription(`${userToRemove} kara listeden çıkarıldı.`)
                .addFields(
                    { name: 'Yetkili', value: `${interaction.user}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [removeEmbed] });
            break;

        case 'göster':
            if (guildData.blacklist.length === 0) {
                return await interaction.reply({
                    content: '📝 Kara liste boş.',
                    ephemeral: true
                });
            }

            const blacklistEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🚫 Kara Liste')
                .setDescription(`Toplam ${guildData.blacklist.length} kullanıcı`)
                .setTimestamp();

            const blacklistText = guildData.blacklist.map((entry, index) => {
                return `${index + 1}. <@${entry.userId}> - ${entry.reason}`;
            }).join('\n');

            if (blacklistText.length > 1024) {
                blacklistEmbed.setDescription('Kara liste çok uzun, sadece ilk 10 kullanıcı gösteriliyor.');
                blacklistEmbed.addFields({
                    name: 'Kullanıcılar',
                    value: guildData.blacklist.slice(0, 10).map((entry, index) => {
                        return `${index + 1}. <@${entry.userId}> - ${entry.reason}`;
                    }).join('\n'),
                    inline: false
                });
            } else {
                blacklistEmbed.addFields({
                    name: 'Kullanıcılar',
                    value: blacklistText,
                    inline: false
                });
            }

            await interaction.reply({ embeds: [blacklistEmbed] });
            break;
    }
}

// Form alanı komutları
async function handleFormFieldCommands(interaction, subcommand, guildData) {
    switch (subcommand) {
        case 'ekle':
            const isim = interaction.options.getString('isim').toLowerCase();
            const tip = interaction.options.getString('tip');
            const zorunlu = interaction.options.getString('zorunlu') === 'evet';

            if (guildData.formFields.find(f => f.name === isim)) {
                return await interaction.reply({ content: `❌ \`${isim}\` adında bir alan zaten var!`, ephemeral: true });
            }

            guildData.formFields.push({ name: isim, type: tip, required: zorunlu });
            saveGuildData(interaction.guild.id, guildData);

            const addEmbed = new EmbedBuilder()
                .setColor(guildData.embedColor)
                .setTitle('📋 Form Alanı Eklendi')
                .setDescription(`\`${isim}\` alanı forma eklendi.`)
                .addFields(
                    { name: 'Tip', value: tip, inline: true },
                    { name: 'Zorunlu', value: zorunlu ? 'Evet' : 'Hayır', inline: true }
                )
                .setTimestamp();
            await interaction.reply({ embeds: [addEmbed] });
            break;

        case 'kaldır':
            const kaldirilacakIsim = interaction.options.getString('isim').toLowerCase();
            const fieldIndex = guildData.formFields.findIndex(f => f.name === kaldirilacakIsim);

            if (fieldIndex === -1) {
                return await interaction.reply({ content: `❌ \`${kaldirilacakIsim}\` adında bir alan bulunamadı!`, ephemeral: true });
            }

            guildData.formFields.splice(fieldIndex, 1);
            saveGuildData(interaction.guild.id, guildData);

            const removeEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('📋 Form Alanı Kaldırıldı')
                .setDescription(`\`${kaldirilacakIsim}\` alanı formdan kaldırıldı.`)
                .setTimestamp();
            await interaction.reply({ embeds: [removeEmbed] });
            break;
    }
}

// Kayıt düzenleme komutu
async function handleEditCommand(interaction, guildData) {
    const user = interaction.options.getUser('kullanıcı');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        return await interaction.reply({ content: '❌ Kullanıcı bu sunucuda bulunamadı!', ephemeral: true });
    }

    const userRegistration = guildData.registrations
        ?.filter(reg => reg.userId === user.id)
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))[0];

    if (!userRegistration) {
        return await interaction.reply({ content: '❌ Bu kullanıcının düzenlenecek bir kaydı bulunamadı!', ephemeral: true });
    }

    const modal = new ModalBuilder()
        .setCustomId(`edit_form_${user.id}`)
        .setTitle('Kayıt Düzenleme Formu');

    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Yeni İsim')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue(userRegistration.name);

    const ageInput = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('Yeni Yaş')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue(userRegistration.age.toString());

    modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(ageInput));
    await interaction.showModal(modal);
}

// Kayıt iptal komutu
async function handleCancelCommand(interaction, guildData) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Belirtilmedi';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        return await interaction.reply({ content: '❌ Kullanıcı bu sunucuda bulunamadı!', ephemeral: true });
    }

    const lastRegistrationIndex = guildData.registrations?.findLastIndex(reg => reg.userId === user.id);
    if (lastRegistrationIndex === -1) {
        return await interaction.reply({ content: '❌ Bu kullanıcının iptal edilecek bir kaydı bulunamadı!', ephemeral: true });
    }

    const lastReg = guildData.registrations[lastRegistrationIndex];
    
    // Rolleri geri al
    const rolesToRemove = [guildData.roles.male, guildData.roles.female].filter(Boolean);
    await member.roles.remove(rolesToRemove);
    await member.roles.add(guildData.roles.unregistered);

    // İsim değiştir
    try {
        await member.setNickname('Kayıtsız');
    } catch (error) {
        console.log('İptal sonrası isim değiştirilemedi:', error.message);
    }

    // Kaydı iptal olarak işaretle
    const cancelData = { ...lastReg, type: 'cancel', canceledBy: interaction.user.id, cancelReason: reason, canceledAt: new Date().toISOString() };
    guildData.registrations.push(cancelData);
    
    // Remove from pending users if they exist
    if (guildData.pendingUsers && guildData.pendingUsers[member.id]) {
        delete guildData.pendingUsers[member.id];
    }
    
    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Kayıt İptal Edildi')
        .setDescription(`${user} kullanıcısının kaydı iptal edildi.`)
        .addFields(
            { name: 'Sebep', value: reason, inline: false },
            { name: 'Yetkili', value: `${interaction.user}`, inline: true }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Log kanalına gönder
    if (guildData.channels.log) {
        const logChannel = interaction.guild.channels.cache.get(guildData.channels.log);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Kayıt İptali')
                .setDescription(`**Kayıt İptal Edildi:** ${member} (${member.id})`)
                .addFields(
                    { name: 'Sebep', value: reason, inline: false },
                    { name: 'Yetkili', value: `${interaction.user} (${interaction.user.id})`, inline: false }
                )
                .setTimestamp();
            await logChannel.send({ embeds: [logEmbed] });
        }
    }

    // Hoşgeldin kanalına yeni mesaj gönder
    if (guildData.channels.welcome) {
        const welcomeChannel = interaction.guild.channels.cache.get(guildData.channels.welcome);
        if (welcomeChannel) {
            const staffRole = guildData.roles.registerStaff ? interaction.guild.roles.cache.get(guildData.roles.registerStaff) : null;

            const welcomeEmbed = new EmbedBuilder()
                .setColor(guildData.embedColor)
                .setTitle('👋 Tekrar Hoşgeldin!')
                .setDescription(`Kaydın iptal edildi, yeniden kayıt olabilirsin.`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: interaction.guild.name });

            if (staffRole) {
                welcomeEmbed.addFields({ name: '👮 Kayıt Sorumlusu', value: `${staffRole}`, inline: false });
            }

            const callStaffButton = new ButtonBuilder()
                .setCustomId(`call_staff_${member.id}`)
                .setLabel('📞 Kayıt Sorumlusunu Çağır')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false); // Immediately enabled

            const row = new ActionRowBuilder().addComponents(callStaffButton);

            const messageContent = staffRole 
                ? `${member}, kayıt için ${staffRole} rolündeki yetkililerimiz seninle ilgilenecektir.`
                : `${member}, sunucumuza hoş geldin!`;

            const welcomeMessage = await welcomeChannel.send({
                content: messageContent,
                embeds: [welcomeEmbed],
                components: [row],
                allowedMentions: { users: [member.id], roles: staffRole ? [staffRole.id] : [] }
            });

            if (!guildData.pendingUsers) guildData.pendingUsers = {};
            guildData.pendingUsers[member.id] = {
                joinedAt: new Date().toISOString(),
                lastStaffCall: null,
                messageId: welcomeMessage.id,
                channelId: welcomeChannel.id
            };
            saveGuildData(interaction.guild.id, guildData);
        }
    }
}

// Kayıt düzenleme komutu
async function handleEditCommand(interaction, guildData) {
    const user = interaction.options.getUser('kullanıcı');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        return await interaction.reply({ content: '❌ Kullanıcı bu sunucuda bulunamadı!', ephemeral: true });
    }

    const userRegistration = guildData.registrations
        ?.filter(reg => reg.userId === user.id)
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))[0];

    if (!userRegistration) {
        return await interaction.reply({ content: '❌ Bu kullanıcının düzenlenecek bir kaydı bulunamadı!', ephemeral: true });
    }

    const modal = new ModalBuilder()
        .setCustomId(`edit_form_${user.id}`)
        .setTitle('Kayıt Düzenleme Formu');

    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Yeni İsim')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue(userRegistration.name);

    const ageInput = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('Yeni Yaş')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue(userRegistration.age.toString());

    modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(ageInput));
    await interaction.showModal(modal);
}

async function handleInfoCommand(interaction, guildData) {
    const user = interaction.options.getUser('kullanıcı');
    
    if (!guildData.registrations || guildData.registrations.length === 0) {
        return await interaction.reply({
            content: '❌ Henüz kayıt verisi bulunamadı!',
            ephemeral: true
        });
    }

    // Kullanıcının en son kaydını bul
    const userRegistration = guildData.registrations
        .filter(reg => reg.userId === user.id)
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))[0];

    if (!userRegistration) {
        return await interaction.reply({
            content: '❌ Bu kullanıcının kayıt bilgisi bulunamadı!',
            ephemeral: true
        });
    }

    const registeredBy = interaction.guild.members.cache.get(userRegistration.registeredBy);
    const registrationDate = new Date(userRegistration.registeredAt);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('👤 Kullanıcı Kayıt Bilgileri')
        .setDescription(`${user} kullanıcısının kayıt bilgileri:`)
        .addFields(
            { name: '📝 İsim', value: userRegistration.name, inline: true },
            { name: '🎂 Yaş', value: userRegistration.age.toString(), inline: true },
            { name: '⚧️ Cinsiyet', value: userRegistration.gender === 'erkek' ? 'Erkek' : 'Kadın', inline: true },
            { name: '👮 Kayıt Eden', value: registeredBy ? `${registeredBy}` : 'Bilinmiyor', inline: true },
            { name: '📅 Kayıt Tarihi', value: registrationDate.toLocaleString('tr-TR'), inline: true },
            { name: '🔢 Kullanıcı ID', value: user.id, inline: true }
        )
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    await interaction.reply({ embeds: [embed] });
}

async function handleHistoryCommand(interaction, guildData) {
    const user = interaction.options.getUser('kullanıcı');
    
    if (!guildData.registrations || guildData.registrations.length === 0) {
        return await interaction.reply({
            content: '❌ Henüz kayıt verisi bulunamadı!',
            ephemeral: true
        });
    }

    // Kullanıcının tüm kayıtlarını bul
    const userRegistrations = guildData.registrations
        .filter(reg => reg.userId === user.id)
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

    if (userRegistrations.length === 0) {
        return await interaction.reply({
            content: '❌ Bu kullanıcının kayıt geçmişi bulunamadı!',
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('📜 Kullanıcı Kayıt Geçmişi')
        .setDescription(`${user} kullanıcısının kayıt geçmişi (${userRegistrations.length} kayıt):`)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    let historyText = '';
    userRegistrations.slice(0, 10).forEach((reg, index) => {
        const registeredBy = interaction.guild.members.cache.get(reg.registeredBy);
        const date = new Date(reg.registeredAt);
        const typeIcon = reg.type === 'register' ? '✅' : reg.type === 'edit' ? '✏️' : '❌';
        
        historyText += `${typeIcon} **${index + 1}.** ${reg.name} | ${reg.age} | ${reg.gender === 'erkek' ? 'Erkek' : 'Kadın'}\n`;
        historyText += `👮 ${registeredBy ? registeredBy.displayName : 'Bilinmiyor'} - ${date.toLocaleString('tr-TR')}\n\n`;
    });

    if (historyText.length > 1024) {
        historyText = historyText.substring(0, 1000) + '...\n\n*Daha fazla kayıt var*';
    }

    embed.addFields({
        name: '📋 Kayıt Listesi',
        value: historyText || 'Kayıt bulunamadı',
        inline: false
    });

    if (userRegistrations.length > 10) {
        embed.addFields({
            name: '📊 İstatistik',
            value: `Toplam ${userRegistrations.length} kayıt (İlk 10 tanesi gösteriliyor)`,
            inline: false
        });
    }

    await interaction.reply({ embeds: [embed] });
}

async function handleStatsCommand(interaction, guildData) {
    const targetUser = interaction.options.getUser('yetkili') || interaction.user;
    
    if (!guildData.stats || !guildData.stats[targetUser.id]) {
        return await interaction.reply({
            content: '❌ Bu yetkili için istatistik bulunamadı!',
            ephemeral: true
        });
    }

    const stats = guildData.stats[targetUser.id];
    const member = interaction.guild.members.cache.get(targetUser.id);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('📊 Yetkili İstatistikleri')
        .setDescription(`${targetUser} kullanıcısının kayıt istatistikleri:`)
        .addFields(
            { name: '📈 Toplam Kayıt', value: stats.total.toString(), inline: true },
            { name: '👨 Erkek Kayıt', value: stats.male ? stats.male.toString() : '0', inline: true },
            { name: '👩 Kadın Kayıt', value: stats.female ? stats.female.toString() : '0', inline: true },
            { name: '📅 Kayıt Başlangıcı', value: member ? member.joinedAt.toLocaleDateString('tr-TR') : 'Bilinmiyor', inline: true }
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    await interaction.reply({ embeds: [embed] });
}

async function handleTopCommand(interaction, guildData) {
    if (!guildData.stats || Object.keys(guildData.stats).length === 0) {
        return await interaction.reply({
            content: '❌ Henüz istatistik verisi bulunamadı!',
            ephemeral: true
        });
    }

    // İstatistikleri sırala
    const sortedStats = Object.entries(guildData.stats)
        .sort(([,a], [,b]) => b.total - a.total)
        .slice(0, 10);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('🏆 En Çok Kayıt Yapanlar')
        .setDescription('Sunucudaki en aktif kayıt yetkilileri:')
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    let topText = '';
    sortedStats.forEach(([userId, stats], index) => {
        const member = interaction.guild.members.cache.get(userId);
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        
        topText += `${medal} ${member ? member.displayName : 'Bilinmeyen Kullanıcı'}\n`;
        topText += `📊 **${stats.total}** kayıt (👨 ${stats.male || 0} | 👩 ${stats.female || 0})\n\n`;
    });

    if (topText.length > 1024) {
        topText = topText.substring(0, 1000) + '...\n\n*Liste çok uzun*';
    }

    embed.addFields({
        name: '📋 Sıralama',
        value: topText || 'Veri bulunamadı',
        inline: false
    });

    await interaction.reply({ embeds: [embed] });
}

async function handleRecentCommand(interaction, guildData) {
    const count = interaction.options.getInteger('sayı') || 10;
    
    if (!guildData.registrations || guildData.registrations.length === 0) {
        return await interaction.reply({
            content: '❌ Henüz kayıt verisi bulunamadı!',
            ephemeral: true
        });
    }

    // Son kayıtları al
    const recentRegistrations = guildData.registrations
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
        .slice(0, count);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('📋 Son Kayıtlar')
        .setDescription(`Son ${recentRegistrations.length} kayıt:`)
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    let recentText = '';
    recentRegistrations.forEach((reg, index) => {
        const registeredBy = interaction.guild.members.cache.get(reg.registeredBy);
        const registeredUser = interaction.guild.members.cache.get(reg.userId);
        const date = new Date(reg.registeredAt);
        
        recentText += `**${index + 1}.** ${registeredUser ? registeredUser.displayName : reg.name}\n`;
        recentText += `👤 ${reg.name} | ${reg.age} | ${reg.gender === 'erkek' ? 'Erkek' : 'Kadın'}\n`;
        recentText += `👮 ${registeredBy ? registeredBy.displayName : 'Bilinmiyor'} - ${date.toLocaleString('tr-TR')}\n\n`;
    });

    if (recentText.length > 1024) {
        recentText = recentText.substring(0, 1000) + '...\n\n*Liste çok uzun*';
    }

    embed.addFields({
        name: '📝 Kayıt Listesi',
        value: recentText || 'Veri bulunamadı',
        inline: false
    });

    await interaction.reply({ embeds: [embed] });
}

async function handleMessageCommand(interaction, guildData) {
    const tip = interaction.options.getString('tip');
    const metin = interaction.options.getString('metin');
    
    // Mesaj tipine göre kaydet
    switch (tip) {
        case 'hoşgeldin':
            guildData.customMessages.welcome = metin;
            break;
        case 'onay':
            guildData.customMessages.approval = metin;
            break;
        case 'dm':
            guildData.customMessages.dm = metin;
            break;
        default:
            return await interaction.reply({
                content: '❌ Geçersiz mesaj tipi!',
                ephemeral: true
            });
    }

    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('💬 Mesaj Ayarlandı')
        .setDescription(`${tip} mesajı başarıyla güncellendi.`)
        .addFields(
            { name: '📝 Mesaj Tipi', value: tip.charAt(0).toUpperCase() + tip.slice(1), inline: true },
            { name: '✉️ Yeni Mesaj', value: metin.length > 100 ? metin.substring(0, 100) + '...' : metin, inline: false }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleColorCommand(interaction, guildData) {
    const color = interaction.options.getString('renk');
    
    // Hex renk kontrolü
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return await interaction.reply({
            content: '❌ Geçersiz hex renk kodu! Örnek: #ff0000',
            ephemeral: true
        });
    }

    guildData.embedColor = color;
    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🎨 Embed Rengi Güncellendi')
        .setDescription(`Yeni embed rengi: ${color}`)
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleSecurityCommand(interaction, guildData) {
    const ageLimit = interaction.options.getInteger('yaş-sınırı');
    const newAccountDays = interaction.options.getInteger('yeni-hesap');
    const multipleAccountCheck = interaction.options.getString('çoklu-hesap');

    let updated = false;

    if (ageLimit !== null) {
        guildData.security.minAge = ageLimit;
        updated = true;
    }

    if (newAccountDays !== null) {
        guildData.security.newAccountDays = newAccountDays;
        updated = true;
    }

    if (multipleAccountCheck !== null) {
        guildData.security.multipleAccountCheck = multipleAccountCheck === 'aktif';
        updated = true;
    }

    if (!updated) {
        return await interaction.reply({
            content: '❌ Hiçbir güvenlik ayarı değiştirilmedi!',
            ephemeral: true
        });
    }

    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('🛡️ Güvenlik Ayarları Güncellendi')
        .setDescription('Güvenlik ayarları başarıyla güncellendi.')
        .addFields(
            { name: '🔒 Minimum Yaş', value: guildData.security.minAge.toString(), inline: true },
            { name: '📅 Yeni Hesap Kontrolü', value: `${guildData.security.newAccountDays} gün`, inline: true },
            { name: '🛡️ Çoklu Hesap Kontrolü', value: guildData.security.multipleAccountCheck ? '✅ Aktif' : '❌ Pasif', inline: true }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleAutoCommand(interaction, guildData) {
    const nameEdit = interaction.options.getString('isim-düzenleme');
    const roleCleanup = interaction.options.getString('rol-temizleme');

    let updated = false;

    if (nameEdit !== null) {
        guildData.automation.nameEdit = nameEdit === 'aktif';
        updated = true;
    }

    if (roleCleanup !== null) {
        guildData.automation.roleCleanup = roleCleanup === 'aktif';
        updated = true;
    }

    if (!updated) {
        return await interaction.reply({
            content: '❌ Hiçbir otomatik ayar değiştirilmedi!',
            ephemeral: true
        });
    }

    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('🤖 Otomatik İşlemler Güncellendi')
        .setDescription('Otomatik işlem ayarları başarıyla güncellendi.')
        .addFields(
            { name: '✏️ İsim Düzenleme', value: guildData.automation.nameEdit ? '✅ Aktif' : '❌ Pasif', inline: true },
            { name: '🧹 Rol Temizleme', value: guildData.automation.roleCleanup ? '✅ Aktif' : '❌ Pasif', inline: true }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleFormDisplayCommand(interaction, guildData) {
    if (!guildData.formFields || guildData.formFields.length === 0) {
        return await interaction.reply({
            content: '❌ Form alanı bulunamadı!',
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('📋 Mevcut Form Yapısı')
        .setDescription(`Toplam ${guildData.formFields.length} form alanı:`)
        .setTimestamp()
        .setFooter({ text: interaction.guild.name });

    let formText = '';
    guildData.formFields.forEach((field, index) => {
        const required = field.required ? '✅ Zorunlu' : '❌ İsteğe Bağlı';
        const typeText = field.type === 'text' ? '📝 Metin' : 
                        field.type === 'number' ? '🔢 Sayı' : 
                        field.type === 'select' ? '📋 Seçim' : field.type;
        
        formText += `**${index + 1}.** ${field.name}\n`;
        formText += `${typeText} | ${required}\n`;
        
        if (field.options && field.options.length > 0) {
            formText += `Seçenekler: ${field.options.join(', ')}\n`;
        }
        formText += '\n';
    });

    if (formText.length > 1024) {
        formText = formText.substring(0, 1000) + '...\n\n*Liste çok uzun*';
    }

    embed.addFields({
        name: '📝 Form Alanları',
        value: formText || 'Veri bulunamadı',
        inline: false
    });

    await interaction.reply({ embeds: [embed] });
}

async function handleUpdateCommand(interaction, guildData) {
    const type = interaction.options.getString('tip');
    const value = interaction.options.getString('değer');

    // ID formatını kontrol et
    if (!/^\d{17,19}$/.test(value)) {
        return await interaction.reply({
            content: '❌ Geçersiz ID formatı! Discord ID 17-19 haneli sayı olmalıdır.',
            ephemeral: true
        });
    }

    let updated = false;
    let updateText = '';

    switch (type) {
        case 'erkek-rol':
            const maleRole = interaction.guild.roles.cache.get(value);
            if (!maleRole) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile rol bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.roles.male = value;
            updateText = `Erkek rolü ${maleRole} olarak güncellendi.`;
            updated = true;
            break;
        case 'kadın-rol':
            const femaleRole = interaction.guild.roles.cache.get(value);
            if (!femaleRole) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile rol bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.roles.female = value;
            updateText = `Kadın rolü ${femaleRole} olarak güncellendi.`;
            updated = true;
            break;
        case 'kayıtsız-rol':
            const unregisteredRole = interaction.guild.roles.cache.get(value);
            if (!unregisteredRole) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile rol bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.roles.unregistered = value;
            updateText = `Kayıtsız rolü ${unregisteredRole} olarak güncellendi.`;
            updated = true;
            break;
        case 'yetkili-rol':
            const staffRole = interaction.guild.roles.cache.get(value);
            if (!staffRole) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile rol bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.roles.staff = value;
            updateText = `Yetkili rolü ${staffRole} olarak güncellendi.`;
            updated = true;
            break;
        case 'kayıt-kanal':
            const registerChannel = interaction.guild.channels.cache.get(value);
            if (!registerChannel) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile kanal bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.channels.register = value;
            updateText = `Kayıt kanalı ${registerChannel} olarak güncellendi.`;
            updated = true;
            break;
        case 'log-kanal':
            const logChannel = interaction.guild.channels.cache.get(value);
            if (!logChannel) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile kanal bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.channels.log = value;
            updateText = `Log kanalı ${logChannel} olarak güncellendi.`;
            updated = true;
            break;
        case 'hoşgeldin-kanal':
            const welcomeChannel = interaction.guild.channels.cache.get(value);
            if (!welcomeChannel) {
                return await interaction.reply({
                    content: '❌ Belirtilen ID ile kanal bulunamadı!',
                    ephemeral: true
                });
            }
            guildData.channels.welcome = value;
            updateText = `Hoşgeldin kanalı ${welcomeChannel} olarak güncellendi.`;
            updated = true;
            break;
        default:
            return await interaction.reply({
                content: '❌ Geçersiz güncelleme tipi!',
                ephemeral: true
            });
    }

    if (updated) {
        saveGuildData(interaction.guild.id, guildData);

        const embed = new EmbedBuilder()
            .setColor(guildData.embedColor)
            .setTitle('🔄 Ayar Güncellendi')
            .setDescription(updateText)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}

// Tag ayarlama komutu
async function handleTagSetCommand(interaction, guildData) {
    const tag = interaction.options.getString('tag');
    
    if (tag.length > 20) {
        return await interaction.reply({
            content: '❌ Tag çok uzun! Maksimum 20 karakter olmalıdır.',
            ephemeral: true
        });
    }

    guildData.unregisteredTag = tag;
    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('🏷️ Kayıtsız Tag Ayarlandı')
        .setDescription(`Kayıtsız kullanıcılar için tag başarıyla ayarlandı.`)
        .addFields(
            { name: '🏷️ Yeni Tag', value: `\`${tag}\``, inline: true },
            { name: '📝 Örnek', value: `${tag} Kullanıcı Adı`, inline: true }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

// İsim formatlama fonksiyonu
function formatName(name) {
    // İlk harfi büyük, diğerleri küçük yap
    return name.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

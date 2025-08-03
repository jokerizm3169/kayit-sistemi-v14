const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // guildMemberAdd event
        client.on(Events.GuildMemberAdd, async member => {
            const guildData = loadGuildData(member.guild.id);
            if (!guildData.enabled) return;

            // Kayıtsız rolü ver
            if (guildData.roles.unregistered) {
                try {
                    await member.roles.add(guildData.roles.unregistered);
                } catch (error) {
                    console.error('❌ Kayıtsız rol verilemedi:', error);
                }
            }

            // Otomatik isim sistemi
            try {
                await member.setNickname('Kayıtsız');
            } catch (error) {
                console.log('İsim ayarlanamadı:', error.message);
            }

            // Hoşgeldin mesajı gönder
            if (guildData.channels.welcome) {
                const welcomeChannel = member.guild.channels.cache.get(guildData.channels.welcome);
                if (welcomeChannel) {
                    const staffRole = guildData.roles.registerStaff ? member.guild.roles.cache.get(guildData.roles.registerStaff) : null;

                    const embed = new EmbedBuilder()
                        .setColor(guildData.embedColor)
                        .setTitle('🎉 Hoşgeldin!')
                        .setDescription(`Sunucumuza hoşgeldin!\n\nKayıt olmak için kayıt kanalına git ve yetkililere ulaş.`)
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: member.guild.name });

                    if (staffRole) {
                        embed.addFields({ name: '👮 Kayıt Sorumlusu', value: `${staffRole}`, inline: false });
                    }

                    const callStaffButton = new ButtonBuilder()
                        .setCustomId(`call_staff_${member.id}`)
                        .setLabel('📞 Kayıt Sorumlusunu Çağır')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);

                    const row = new ActionRowBuilder().addComponents(callStaffButton);

                    // Mesaj içeriğini güncelle
                    const messageContent = staffRole 
                        ? `${member}, kayıt için ${staffRole} rolündeki yetkililerimiz seninle ilgilenecektir.`
                        : `${member}, sunucumuza hoş geldin!`;

                    const welcomeMessage = await welcomeChannel.send({
                        content: messageContent,
                        embeds: [embed],
                        components: [row],
                        allowedMentions: { users: [member.id], roles: staffRole ? [staffRole.id] : [] }
                    });

                    // Test için butonu 1 dakika sonra aktif hale getir
                    setTimeout(async () => {
                        try {
                            // Mesajın hala var olup olmadığını kontrol et
                            const fetchedMessage = await welcomeChannel.messages.fetch(welcomeMessage.id).catch(() => null);
                            if (!fetchedMessage) return;

                            const updatedButton = new ButtonBuilder()
                                .setCustomId(`call_staff_${member.id}`)
                                .setLabel('📞 Kayıt Sorumlusunu Çağır')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(false);
                            const updatedRow = new ActionRowBuilder().addComponents(updatedButton);
                            await welcomeMessage.edit({ components: [updatedRow] });
                        } catch (error) {
                            console.log('Buton güncellenemedi:', error.message);
                        }
                    }, 60 * 1000); // 1 dakika

                    if (!guildData.pendingUsers) guildData.pendingUsers = {};
                    guildData.pendingUsers[member.id] = {
                        joinedAt: new Date().toISOString(),
                        lastStaffCall: null,
                        messageId: welcomeMessage.id,
                        channelId: welcomeChannel.id
                    };
                    saveGuildData(member.guild.id, guildData);
                }
            }
        });

        // interactionCreate event
        client.on(Events.InteractionCreate, async interaction => {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error('❌ Komut çalıştırılırken hata:', error);
                    await interaction.reply({ content: '❌ Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
                }
            } else if (interaction.isModalSubmit()) {
                await handleModalSubmit(interaction);
            } else if (interaction.isStringSelectMenu()) {
                await handleSelectMenu(interaction);
            } else if (interaction.isButton()) {
                await handleButtonInteraction(interaction);
            }
        });
    }
};

async function handleModalSubmit(interaction) {
    if (!interaction.customId.startsWith('register_form_') && !interaction.customId.startsWith('edit_form_')) return;

    const guildData = loadGuildData(interaction.guild.id);
    const customIdParts = interaction.customId.split('_');
    const formType = customIdParts[0];
    const userId = customIdParts[2];
    const targetUser = await interaction.guild.members.fetch(userId);

    if (!targetUser) {
        return await interaction.reply({ content: '❌ Kullanıcı bulunamadı!', ephemeral: true });
    }

    let name = interaction.fields.getTextInputValue('name');
    const ageInput = interaction.fields.getTextInputValue('age');
    const age = parseInt(ageInput);
    name = formatName(name);

    if (isNaN(age) || age < guildData.security.minAge || age > 99) {
        return await interaction.reply({ content: `❌ Geçersiz yaş! Yaş ${guildData.security.minAge}-99 arasında olmalıdır.`, ephemeral: true });
    }
    if (name.length < 2 || name.length > 32) {
        return await interaction.reply({ content: '❌ İsim 2-32 karakter arasında olmalıdır!', ephemeral: true });
    }

    const customId = `${formType}_gender_select_${userId}_${name}_${age}`;
    const genderSelect = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder('Cinsiyet seçin')
        .addOptions([
            { label: 'Erkek', value: 'erkek', emoji: '👨' },
            { label: 'Kadın', value: 'kadın', emoji: '👩' }
        ]);

    const row = new ActionRowBuilder().addComponents(genderSelect);
    const title = formType === 'edit' ? 'Kayıt Düzenleme - Cinsiyet Seçimi' : 'Kayıt Formu - Cinsiyet Seçimi';

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle(`📝 ${title}`)
        .setDescription(`**Kullanıcı:** ${targetUser}\n**İsim:** ${name}\n**Yaş:** ${age}\n\nLütfen cinsiyet seçin:`)
        .setThumbnail(targetUser.user.displayAvatarURL())
        .setTimestamp();

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleSelectMenu(interaction) {
    if (!interaction.customId.startsWith('register_gender_select_') && !interaction.customId.startsWith('edit_gender_select_')) return;

    const parts = interaction.customId.split('_');
    const formType = parts[0];
    const userId = parts[3];
    const name = parts[4];
    const age = parseInt(parts[5]);
    const gender = interaction.values[0];

    const targetUser = await interaction.guild.members.fetch(userId);
    if (!targetUser) {
        return await interaction.reply({ content: '❌ Kullanıcı bulunamadı!', ephemeral: true });
    }

    const guildData = loadGuildData(interaction.guild.id);
    
    if (formType === 'edit') {
        await completeEdit(interaction, targetUser, { name, age, gender }, guildData);
    } else {
        await completeRegistration(interaction, targetUser, { name, age, gender }, guildData);
    }
}

async function handleButtonInteraction(interaction) {
    if (interaction.customId.startsWith('call_staff_')) {
        const userId = interaction.customId.split('_')[2];

        // Butona sadece ilgili kullanıcının tıklamasını sağla
        if (interaction.user.id !== userId) {
            return await interaction.reply({
                content: '❌ Bu butonu sadece ilgili kullanıcı kullanabilir.',
                ephemeral: true
            });
        }

        const guildData = loadGuildData(interaction.guild.id);
        
        if (!guildData.pendingUsers || !guildData.pendingUsers[userId]) {
            return await interaction.reply({ content: '❌ Kullanıcı verisi bulunamadı veya kullanıcı zaten kayıtlı.', ephemeral: true });
        }

        const userInfo = guildData.pendingUsers[userId];
        const now = new Date();
        
        // Test için 1 dakika bekleme süresi
        const cooldown = 60 * 1000; // 1 dakika

        if (userInfo.lastStaffCall) {
            const lastCall = new Date(userInfo.lastStaffCall);
            const timeDiff = now - lastCall;
            
            if (timeDiff < cooldown) {
                const timeLeft = Math.ceil((cooldown - timeDiff) / 1000);
                return await interaction.reply({ content: `⏰ Kayıt sorumlusunu tekrar çağırabilmek için ${timeLeft} saniye daha beklemelisiniz!`, ephemeral: true });
            }
        }

        const staffRole = guildData.roles.registerStaff ? interaction.guild.roles.cache.get(guildData.roles.registerStaff) : null;
        if (!staffRole) {
            return await interaction.reply({ content: '❌ Kayıt sorumlusu rolü bulunamadı!', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(userId);
        if (!member) {
            return await interaction.reply({ content: '❌ Kullanıcı bulunamadı!', ephemeral: true });
        }

        userInfo.lastStaffCall = now.toISOString();
        saveGuildData(interaction.guild.id, guildData);

        const callMessage = `🔔 **Kayıt Sorumlusu Çağrısı!**\n\n${staffRole} ${member} kullanıcısı sizin ilgilenmenizi bekliyor!`;
        await interaction.reply({ content: callMessage, allowedMentions: { roles: [staffRole.id] } });

        // Butonu tekrar deaktif hale getir ve 1 dakika sonra tekrar aktif et
        const disabledButton = new ButtonBuilder()
            .setCustomId(`call_staff_${userId}`)
            .setLabel('📞 Kayıt Sorumlusunu Çağır')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        
        const row = new ActionRowBuilder().addComponents(disabledButton);
        await interaction.message.edit({ components: [row] });

        setTimeout(async () => {
            try {
                const welcomeChannel = interaction.guild.channels.cache.get(userInfo.channelId);
                if (!welcomeChannel) return;

                const fetchedMessage = await welcomeChannel.messages.fetch(userInfo.messageId).catch(() => null);
                if (!fetchedMessage) return;

                const enabledButton = new ButtonBuilder()
                    .setCustomId(`call_staff_${userId}`)
                    .setLabel('📞 Kayıt Sorumlusunu Çağır')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false);
                
                const enabledRow = new ActionRowBuilder().addComponents(enabledButton);
                await fetchedMessage.edit({ components: [enabledRow] });
            } catch (error) {
                console.log('Buton yeniden aktif edilemedi:', error.message);
            }
        }, cooldown); // 1 dakika sonra

        if (guildData.channels.log) {
            const logChannel = interaction.guild.channels.cache.get(guildData.channels.log);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#ff9900')
                    .setTitle('📞 Kayıt Sorumlusu Çağrısı')
                    .setDescription(`${member} kullanıcısı kayıt sorumlusunu çağırdı`)
                    .addFields(
                        { name: 'Kullanıcı', value: `${member} (${member.id})`, inline: true },
                        { name: 'Çağıran', value: `${interaction.user} (${interaction.user.id})`, inline: true }
                    )
                    .setTimestamp();
                await logChannel.send({ embeds: [logEmbed] });
            }
        }
    }
}

async function completeRegistration(interaction, member, data, guildData) {
    const { name, age, gender } = data;
    const userInfo = guildData.pendingUsers ? guildData.pendingUsers[member.id] : null;
    
    const rolesToRemove = [guildData.roles.unregistered].filter(Boolean);
    const roleToAdd = gender === 'erkek' ? guildData.roles.male : guildData.roles.female;

    if (guildData.automation.roleCleanup && rolesToRemove.length > 0) {
        await member.roles.remove(rolesToRemove);
    }
    if (roleToAdd) {
        await member.roles.add(roleToAdd);
    }

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

    const registrationData = {
        userId: member.id,
        username: member.user.username,
        name, age, gender,
        registeredBy: interaction.user.id,
        registeredAt: new Date().toISOString(),
        type: 'register'
    };

    if (!guildData.stats[interaction.user.id]) {
        guildData.stats[interaction.user.id] = { total: 0, male: 0, female: 0 };
    }
    guildData.stats[interaction.user.id].total++;
    if (gender === 'erkek') {
        guildData.stats[interaction.user.id].male++;
    } else if (gender === 'kadın') {
        guildData.stats[interaction.user.id].female++;
    }

    if (!guildData.registrations) guildData.registrations = [];
    guildData.registrations.push(registrationData);

    if (guildData.pendingUsers && guildData.pendingUsers[member.id]) {
        delete guildData.pendingUsers[member.id];
    }

    saveGuildData(interaction.guild.id, guildData);

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

    await interaction.update({ embeds: [embed], components: [] });

    // Delete the original welcome message with the button
    if (userInfo && userInfo.messageId) {
        const welcomeChannel = interaction.guild.channels.cache.get(userInfo.channelId);
        if (welcomeChannel) {
            const oldMessage = await welcomeChannel.messages.fetch(userInfo.messageId).catch(() => null);
            if (oldMessage) await oldMessage.delete();
        }
    }

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
}

async function completeEdit(interaction, member, data, guildData) {
    const { name, age, gender } = data;

    const lastRegistrationIndex = guildData.registrations.findLastIndex(reg => reg.userId === member.id);
    if (lastRegistrationIndex === -1) {
        return await interaction.update({ content: '❌ Düzenlenecek kayıt bulunamadı.', embeds: [], components: [] });
    }

    const oldReg = guildData.registrations[lastRegistrationIndex];
    const newReg = { ...oldReg, name, age, gender, type: 'edit', editedBy: interaction.user.id, editedAt: new Date().toISOString() };
    guildData.registrations.push(newReg);

    const roleToAdd = gender === 'erkek' ? guildData.roles.male : guildData.roles.female;
    const roleToRemove = gender === 'erkek' ? guildData.roles.female : guildData.roles.male;
    
    await member.roles.remove(roleToRemove);
    await member.roles.add(roleToAdd);

    if (guildData.automation.nameEdit) {
        const newNickname = `${name} | ${age}`;
        try {
            await member.setNickname(newNickname);
        } catch (error) {
            console.log('İsim düzenlenemedi:', error.message);
        }
    }

    saveGuildData(interaction.guild.id, guildData);

    const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle('✏️ Kayıt Güncellendi!')
        .setDescription(`${member} kullanıcısının kaydı güncellendi.`)
        .addFields(
            { name: '👤 Yeni İsim', value: name, inline: true },
            { name: '🎂 Yeni Yaş', value: age.toString(), inline: true },
            { name: '⚧️ Yeni Cinsiyet', value: gender === 'erkek' ? 'Erkek' : 'Kadın', inline: true },
            { name: '👮 Düzenleyen', value: `${interaction.user}`, inline: true }
        )
        .setTimestamp();

    await interaction.update({ embeds: [embed], components: [] });
}

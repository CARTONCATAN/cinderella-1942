require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('newpost')
        .setDescription('Create a new post on the Cinderella 1942 website')
        .addStringOption(opt =>
            opt.setName('title')
                .setDescription('Post title')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('summary')
                .setDescription('Post summary/description')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('tag')
                .setDescription('Post category tag')
                .setRequired(true)
                .addChoices(
                    { name: 'Competition', value: 'Competition' },
                    { name: 'Build Season', value: 'Build Season' },
                    { name: 'Season Kickoff', value: 'Season Kickoff' },
                    { name: 'Community', value: 'Community' },
                    { name: 'Team', value: 'Team' },
                    { name: 'Outreach', value: 'Outreach' },
                    { name: 'Awards', value: 'Awards' },
                    { name: 'Event', value: 'Event' },
                ))
        .addStringOption(opt =>
            opt.setName('icon')
                .setDescription('FontAwesome icon (e.g. fas fa-trophy)')
                .setRequired(false))
        .addStringOption(opt =>
            opt.setName('image')
                .setDescription('Image path (e.g. logos_photos/event.jpg)')
                .setRequired(false))
        .addStringOption(opt =>
            opt.setName('author')
                .setDescription('Post author (default: Team 1942)')
                .setRequired(false))
        .addStringOption(opt =>
            opt.setName('readtime')
                .setDescription('Read time (e.g. "3 min read")')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('listposts')
        .setDescription('List all posts on the website'),

    new SlashCommandBuilder()
        .setName('deletepost')
        .setDescription('Delete a post by its ID')
        .addIntegerOption(opt =>
            opt.setName('id')
                .setDescription('Post ID to delete')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('editpost')
        .setDescription('Edit an existing post')
        .addIntegerOption(opt =>
            opt.setName('id')
                .setDescription('Post ID to edit')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('title')
                .setDescription('New title')
                .setRequired(false))
        .addStringOption(opt =>
            opt.setName('summary')
                .setDescription('New summary')
                .setRequired(false))
        .addStringOption(opt =>
            opt.setName('tag')
                .setDescription('New tag')
                .setRequired(false)
                .addChoices(
                    { name: 'Competition', value: 'Competition' },
                    { name: 'Build Season', value: 'Build Season' },
                    { name: 'Season Kickoff', value: 'Season Kickoff' },
                    { name: 'Community', value: 'Community' },
                    { name: 'Team', value: 'Team' },
                    { name: 'Outreach', value: 'Outreach' },
                    { name: 'Awards', value: 'Awards' },
                    { name: 'Event', value: 'Event' },
                ))
        .addStringOption(opt =>
            opt.setName('icon')
                .setDescription('New icon')
                .setRequired(false))
        .addStringOption(opt =>
            opt.setName('image')
                .setDescription('New image path')
                .setRequired(false)),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
            { body: commands.map(c => c.toJSON()) },
        );
        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error(error);
    }
})();

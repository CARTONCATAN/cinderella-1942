require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { addPost, listPosts, deletePost, editPost } = require('./github');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Bot is online as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // /newpost
    if (commandName === 'newpost') {
        await interaction.deferReply();
        try {
            const title = interaction.options.getString('title');
            const summary = interaction.options.getString('summary');
            const tag = interaction.options.getString('tag');
            const icon = interaction.options.getString('icon');
            const image = interaction.options.getString('image');
            const author = interaction.options.getString('author');
            const readTime = interaction.options.getString('readtime');

            const post = await addPost({ title, summary, tag, icon, image, author, readTime });

            const embed = new EmbedBuilder()
                .setColor(0x1565C0)
                .setTitle('Post Created!')
                .addFields(
                    { name: 'Title', value: post.title, inline: true },
                    { name: 'Tag', value: post.tag, inline: true },
                    { name: 'ID', value: String(post.id), inline: true },
                    { name: 'Date', value: post.date, inline: true },
                    { name: 'Author', value: post.author, inline: true },
                )
                .setDescription(post.summary)
                .setFooter({ text: 'Pushed to GitHub' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await interaction.editReply(`Error creating post: ${err.message}`);
        }
    }

    // /listposts
    if (commandName === 'listposts') {
        await interaction.deferReply();
        try {
            const posts = await listPosts();

            if (posts.length === 0) {
                await interaction.editReply('No posts found.');
                return;
            }

            const lines = posts.map(p =>
                `**#${p.id}** | \`${p.date}\` | **${p.title}** [${p.tag}]`
            );

            // Discord has a 4096 char limit for embed descriptions
            const chunks = [];
            let current = '';
            for (const line of lines) {
                if ((current + '\n' + line).length > 4000) {
                    chunks.push(current);
                    current = line;
                } else {
                    current += (current ? '\n' : '') + line;
                }
            }
            if (current) chunks.push(current);

            const embed = new EmbedBuilder()
                .setColor(0xF5A623)
                .setTitle(`Website Posts (${posts.length})`)
                .setDescription(chunks[0])
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await interaction.editReply(`Error listing posts: ${err.message}`);
        }
    }

    // /deletepost
    if (commandName === 'deletepost') {
        await interaction.deferReply();
        try {
            const id = interaction.options.getInteger('id');
            const removed = await deletePost(id);

            if (!removed) {
                await interaction.editReply(`Post with ID **${id}** not found.`);
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0xFF4444)
                .setTitle('Post Deleted')
                .addFields(
                    { name: 'Title', value: removed.title, inline: true },
                    { name: 'ID', value: String(removed.id), inline: true },
                )
                .setFooter({ text: 'Pushed to GitHub' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await interaction.editReply(`Error deleting post: ${err.message}`);
        }
    }

    // /editpost
    if (commandName === 'editpost') {
        await interaction.deferReply();
        try {
            const id = interaction.options.getInteger('id');
            const updates = {};
            const title = interaction.options.getString('title');
            const summary = interaction.options.getString('summary');
            const tag = interaction.options.getString('tag');
            const icon = interaction.options.getString('icon');
            const image = interaction.options.getString('image');

            if (title) updates.title = title;
            if (summary) updates.summary = summary;
            if (tag) updates.tag = tag;
            if (icon) updates.icon = icon;
            if (image !== null) updates.image = image;

            if (Object.keys(updates).length === 0) {
                await interaction.editReply('No changes provided. Use at least one option to edit.');
                return;
            }

            const post = await editPost(id, updates);

            if (!post) {
                await interaction.editReply(`Post with ID **${id}** not found.`);
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0x43A047)
                .setTitle('Post Updated!')
                .addFields(
                    { name: 'Title', value: post.title, inline: true },
                    { name: 'Tag', value: post.tag, inline: true },
                    { name: 'ID', value: String(post.id), inline: true },
                )
                .setDescription(post.summary)
                .setFooter({ text: 'Pushed to GitHub' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await interaction.editReply(`Error editing post: ${err.message}`);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

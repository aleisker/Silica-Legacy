import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../interfaces/command';
import { insertStaff } from '../../cluster/StaffManager';

const addStaff: Command = {
	data: new SlashCommandBuilder()
		.setName('add_staff')
		.setDescription('Ajoute un staff dans le moniteur.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.addUserOption((option) =>
			option
				.setName('staff')
				.setRequired(true)
				.setDescription('Entrez la mention du staff à ajouter.')
		),

	async executeCommand(client, interaction) {
		let staff = interaction.options.getUser('staff')!;

		try {
			await insertStaff(staff);

			let success_embed = new EmbedBuilder()
				.setColor(client.getConfig().embed.readyColor)
				.setTitle('Staff ajouté en base de données !')
				.setDescription(
					`Pour visualiser son profil,\nfaites __/staff_profile <@${staff.id}>__`
				)
				.setTimestamp()
				.setFooter({
					iconURL: client.user?.avatarURL()!,
					text: client.getConfig().embed.footer,
				});
			interaction
				.reply({ embeds: [success_embed], ephemeral: false })
				.catch(console.error);
		} catch (error) {
			interaction
				.reply({
					content: `Erreur de resolveur SQL\n${error}`,
					ephemeral: false,
				})
				.catch(console.error);
		}
	},

	settings: {
		enabled: true,
	},
};

export default addStaff;

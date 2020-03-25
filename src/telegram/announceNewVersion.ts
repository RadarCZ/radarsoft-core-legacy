import axios from 'axios';
import { getConnection, getRepository } from 'typeorm';

import { ChangelogPosts } from '../entity/ChangelogPosts';
import { getPackageJsonVersion, getVersionChangelog } from '../util/misc';

export const handleNewVersionStartup: () => void = async () => {
	const currentVer = getPackageJsonVersion();
	const lastChangelogPost: ChangelogPosts | undefined = await getConnection()
		.createQueryBuilder()
		.select('changelog_posts')
		.from<ChangelogPosts>(ChangelogPosts, 'changelog_posts')
		.where(`changelog_posts.version = '${currentVer}'`)
		.getOne();

	if (lastChangelogPost) {
		return;
	}

	const newChangelogPost: ChangelogPosts = new ChangelogPosts();
	newChangelogPost.version = `${currentVer}`;

	const changelogPostData = {
	  'chat_id': `${process.env.TG_INFO_CHANNEL_ID}`,
	  'parse_mode': 'HTML'
	};

	changelogPostData['text'] = `<b>New version: ${currentVer}</b>\n`;

	const changelog: object = getVersionChangelog(currentVer);
	const changelogKeys = Object.keys(changelog[currentVer]);
	for (let i = 0, j = changelogKeys.length; i < j; i++) {
	  const currentKey = changelogKeys[i];
	  changelogPostData['text'] += `${currentKey}\n`;
	  const currentMessages: string[] = changelog[currentVer][currentKey];
	  currentMessages.forEach(message => {
			changelogPostData['text'] += `  --&gt; <i>${message}</i>\n`;
	  });
	  changelogPostData['text'] += '\n';
	}

	const postResult = await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, changelogPostData);

	const pinData = {
	  'chat_id': changelogPostData['chat_id']
	};
	pinData['message_id'] = postResult?.data?.result['message_id'];

	await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/pinChatMessage`, pinData);

	const changelogPostRepository = getRepository(ChangelogPosts);
	await changelogPostRepository.insert(newChangelogPost);
};

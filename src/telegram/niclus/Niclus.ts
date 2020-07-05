import fs from 'fs';
import https from 'https';
import path from 'path';

import axios from 'axios';
import { createCanvas, Image, registerFont } from 'canvas';
import FormData from 'form-data';
import { Guid } from 'guid-typescript';
import sharp from 'sharp';
import { getConnection } from 'typeorm';

import { logger } from '../../config/winston';
import { Base64StickerTemplate } from '../../entity/Base64StickerTemplate';
import { StickerResult } from '../../util/structs/telegramSticker';
import {
	TelegramInlineQueryAnswer,
	TelegramInlineQueryResult,
	TelegramWebhookInlineQuery
} from '../../util/structs/telegramWebhookInlineQuery';

type CreateStickerReturn = {
	answerId: Guid;
	stickerId: string | number;
};

const splitLines: (lines: string[], maxWidth: number, context: any, modifier: number) => string[] = (lines, maxWidth, context, modifier) => {
	if (lines.every(line => context.measureText(line).width <= maxWidth)) {
		return lines;
	}

	const wholeQuery = lines.join(' ');

	if (!wholeQuery.includes(' ') || modifier > 5) {
		throw new Error('Query too long');
	}

	const finalLines: string[] = new Array(modifier);
	const words = wholeQuery.split(' ');
	const lineSplitIndex = Math.round(words.length / modifier);
	let currentIterIndex = 0;
	for(let i = 0, j = finalLines.length; i < j; i++) {
		finalLines[i] = (words.slice(currentIterIndex, (lineSplitIndex + currentIterIndex))).join(' ');
		currentIterIndex += lineSplitIndex;
	}

	return splitLines(finalLines, maxWidth, context, (modifier + 1));
};

export class Niclus {
	private InlineQuery: TelegramWebhookInlineQuery;

	public constructor(iq: TelegramWebhookInlineQuery) {
		this.InlineQuery = iq;
	}

	public async processInlineQuery(): Promise<void> {
		if (!this.InlineQuery.query) {
			return;
		}

		const generatedStickerIds = await this.createStickers();

		const results: TelegramInlineQueryResult[] = generatedStickerIds.map(value => {
			return {
				'type': 'sticker',
				'id': value.answerId.toString(),
				'sticker_file_id': value.stickerId
			};
		});

		const answer: TelegramInlineQueryAnswer = {
			'inline_query_id': this.InlineQuery.id,
			results
		};
		await axios.post(`https://api.telegram.org/bot${process.env.TG_STICKER_BOT_TOKEN}/answerInlineQuery`, answer);

		return;
	}

	private async createStickers(): Promise<CreateStickerReturn[]> {
		const dbTemplates: Base64StickerTemplate[] | undefined = await getConnection()
			.createQueryBuilder()
			.select('base64_sticker_template')
			.from<Base64StickerTemplate>(Base64StickerTemplate, 'base64_sticker_template')
			.getMany();
		const templates = dbTemplates.map(value => {
			return {
				...value,
				'answerId': Guid.create()
			};
		});

		const fontPath = path.join(process.cwd(), 'cdn/ubuntu.ttf');
		registerFont(fontPath, { 'family': 'ubuntu' });

		const imageProcessingPromises: Promise<any>[] = [];
		templates.map(image => {
			imageProcessingPromises.push(new Promise((resolve, reject) => {
				const imgCanvas = createCanvas(512, 512, 'svg');
				const imgCtx = imgCanvas.getContext('2d');

				const textCanvas = createCanvas(image.tWidth, image.tHeight, 'svg');
				const textCtx = textCanvas.getContext('2d');

				const finalCanvas = createCanvas(512, 512, 'svg');
				const finalCtx = finalCanvas.getContext('2d');

				const baseImage = new Image();
				// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
				baseImage.onload = () => {
					imgCtx.drawImage(baseImage, 0, 0);
					textCtx.font = '24px "ubuntu"';
					let lines: string[] = [];
					try {
						lines = splitLines([this.InlineQuery.query], image.tWidth, textCtx, 2);
					} catch (err) {
						if (err.message === 'Query too long') {
							lines = ['QUERY WAS', 'TOO LONG'];
							textCtx.fillStyle = '#FF0000';
						}
					}

					const numberOfLines = lines.length;
					const lineHeight = Math.round(image.tHeight / (numberOfLines + 1));
					let currentLinePosY = lineHeight;
					for (let i = 0; i < numberOfLines; i++) {
						const lineWidth = textCtx.measureText(lines[i]).width;
						textCtx.fillText(lines[i], (image.tWidth / 2) - (lineWidth / 2), currentLinePosY, image.tWidth);
						currentLinePosY += lineHeight;
					}

					finalCtx.drawImage(imgCanvas, 0, 0);
					finalCtx.drawImage(textCanvas, image.tPosX, image.tPosY);

					const canvasData = finalCanvas.toDataURL('image/png').split(',');
					sharp(Buffer.from(canvasData[1], 'base64')).webp({
						'quality': 100,
						'lossless': true,
						'force': true,
					}).toFile(`${image.answerId.toString()}.webp`).then(() => {
						resolve();
					}, rejectReason => {
						logger.error(rejectReason);
						fs.writeFileSync('sharp-error.log', finalCanvas.toDataURL('image/png'));
						reject();
					});
				};

				// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
				baseImage.onerror = err => {
					logger.error(err);
					reject();
				};

				baseImage.src = `data:image/png;base64,${image.base64}`;
			}));
		});
		await Promise.all(imageProcessingPromises);

		const result: CreateStickerReturn[] = [];
		const stickerSavingPromises = templates.map(image => new Promise((resolve, reject) => {
			const formData = new FormData();
			formData.append('chat_id', process.env.TG_PM_ID);
			formData.append('sticker', fs.createReadStream(`${image.answerId.toString()}.webp`));
			formData.append('disable_notification', 'true');
			const request = https.request({
				'method': 'POST',
				'host': 'api.telegram.org',
				'path': `/bot${process.env.TG_STICKER_BOT_TOKEN}/sendSticker`,
				'headers': formData.getHeaders()
			});

			formData.pipe(request);

			request.on('response', response => {
				response.on('data', res => {
					const jsonResponse = JSON.parse((res as Buffer).toString('utf8')) as StickerResult;
					result.push({
						'answerId': image.answerId,
						'stickerId': jsonResponse.result.sticker.file_id,
					});
					resolve();
				});
			});
		}));
		await Promise.all(stickerSavingPromises);

		return result;
	}
}

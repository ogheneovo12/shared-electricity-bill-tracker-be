import { join } from 'path';

const loadAttachment = (id: string) => ({
  cid: id,
  path: join(__dirname, '..', '..', 'mail', 'templates', 'images', `${id}.png`),
});

export const SocialAttachments = [
  loadAttachment('whatsapp'),
  loadAttachment('twitter'),
  loadAttachment('medium'),
  loadAttachment('logo'),
  loadAttachment('insta'),
];

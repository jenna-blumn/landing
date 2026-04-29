import type { SmsType } from '../types';

const SMS_BYTE_LIMIT = 90;
const LMS_BYTE_LIMIT = 2000;

const SMS_CHAR_LIMIT = 80;
const LMS_CHAR_LIMIT = 2000;

export function calculateByteLength(text: string): number {
  let byteLength = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode > 127) {
      byteLength += 2;
    } else {
      byteLength += 1;
    }
  }
  return byteLength;
}

export function getSmsType(byteLength: number): SmsType {
  return byteLength <= SMS_BYTE_LIMIT ? 'sms' : 'lms';
}

export function getMaxBytes(smsType: SmsType): number {
  return smsType === 'sms' ? SMS_BYTE_LIMIT : LMS_BYTE_LIMIT;
}

export function getBytePercentage(byteLength: number, smsType: SmsType): number {
  const max = getMaxBytes(smsType);
  return Math.min(Math.round((byteLength / max) * 100), 100);
}

export function isOverByteLimit(byteLength: number): boolean {
  return byteLength > LMS_BYTE_LIMIT;
}

export function formatByteInfo(byteLength: number): string {
  const type = getSmsType(byteLength);
  const max = getMaxBytes(type);
  const label = type.toUpperCase();
  return `${byteLength.toLocaleString()} / ${max.toLocaleString()} bytes (${label})`;
}

export function getSmsTypeByCharCount(charCount: number): SmsType {
  return charCount <= SMS_CHAR_LIMIT ? 'sms' : 'lms';
}

export function getMaxCharLimit(smsType: SmsType): number {
  return smsType === 'sms' ? SMS_CHAR_LIMIT : LMS_CHAR_LIMIT;
}

export function isOverCharLimit(charCount: number): boolean {
  return charCount > LMS_CHAR_LIMIT;
}

export function formatCharCountInfo(text: string): string {
  const count = text.length;
  const type = getSmsTypeByCharCount(count);
  const limit = getMaxCharLimit(type);
  return `${count.toLocaleString()} / ${limit.toLocaleString()}`;
}

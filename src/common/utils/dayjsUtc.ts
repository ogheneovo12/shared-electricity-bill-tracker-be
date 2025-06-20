import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// Extend Day.js with the UTC plugin
dayjs.extend(utc);
dayjs.extend(timezone);

export const dayjsTz = dayjs.tz;

export default dayjs.utc;

import dayJs from 'dayjs';
import { GRADE } from '@/settings/const';

/**
 * 对需要展示的数据，进行格式清洗
 * @param {Array} items 传入的数据
 */
function dealFormatData(items) {
  return items.map((item) => {
    const copyItem = item;
    const pos = GRADE.findIndex(grd => grd.value === item.grade);
    copyItem.createdAt = item.createdAt ? dayJs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-';
    copyItem.payTime = item.payTime || '-';
    copyItem.grade = item.grade && pos >= 0 ? GRADE[pos].text : '-';
    copyItem.payMoney = item.payMoney ? `¥${item.payMoney}` : '-';
    copyItem.className = item.className || '-';
    copyItem.key = item.id;
    copyItem.note = item.note || '';
    return copyItem;
  });
}

export default dealFormatData;

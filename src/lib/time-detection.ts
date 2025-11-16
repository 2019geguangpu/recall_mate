/**
 * 时间检测工具
 * 用于检测文本中是否包含时间相关的关键词
 */

/**
 * 检测文本中是否包含时间相关的关键词
 * @param text 要检测的文本
 * @returns 如果包含时间相关关键词返回 true，否则返回 false
 */
export function containsTimeKeywords(text: string): boolean {
  if (!text) return false;
  
  const timeKeywords = [
    // 时间点
    /\d+点/,
    /\d+:\d+/,
    /上午|下午|晚上|凌晨|早晨|中午|傍晚/,
    /AM|PM|am|pm/,
    
    // 日期相关
    /今天|明天|后天|大后天/,
    /昨天|前天/,
    /周一|周二|周三|周四|周五|周六|周日|星期[一二三四五六日]/,
    /下[周一至日]|上[周一至日]/,
    
    // 相对时间
    /\d+[小时时]后/,
    /\d+[天日后]/,
    /\d+[分钟分]后/,
    /[今明后]天/,
    
    // 具体日期
    /\d+[月年]/,
    /\d+号|\d+日/,
    
    // 时间范围
    /从.*到/,
    /开始|结束|截止/,
    
    // 其他时间表达
    /提醒|提醒我|记得|别忘了/,
  ];
  
  return timeKeywords.some(pattern => pattern.test(text));
}


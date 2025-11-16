/**
 * AI Prompt 构建工具
 * 用于构建不同场景下的 system prompt
 */

interface TimeContext {
  timezone: string;
  currentDate: string;
  currentTime: string;
  currentDateTimeISO: string; // 用户时区的 ISO 格式时间
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  currentHour: number;
  currentMinute: number;
}

/**
 * 获取时区偏移量（格式：+08:00 或 -05:00）
 * 使用一个已知的 UTC 时间来计算目标时区的偏移量
 */
function getTimezoneOffset(timezone: string): string {
  // 使用一个已知的 UTC 时间作为参考（2024-01-01T00:00:00Z）
  const utcDate = new Date("2024-01-01T00:00:00Z");
  
  // 获取目标时区在同一 UTC 时刻的本地时间字符串
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(utcDate);
  const year = parts.find(p => p.type === "year")?.value || "";
  const month = parts.find(p => p.type === "month")?.value || "";
  const day = parts.find(p => p.type === "day")?.value || "";
  const hour = parts.find(p => p.type === "hour")?.value || "";
  const minute = parts.find(p => p.type === "minute")?.value || "";
  
  // 创建目标时区的日期对象（作为本地时间，即 UTC）
  // 注意：这里我们假设这个字符串是 UTC 时间，但实际上它是目标时区的本地时间
  // 我们需要计算：UTC 00:00 在目标时区是什么时间，然后计算差值
  const targetLocalTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
  
  // 计算偏移量：目标时区的本地时间 - UTC 时间
  // 如果目标时区是 UTC+8，那么 UTC 00:00 对应目标时区 08:00
  // 所以 offset = 08:00 - 00:00 = +08:00
  const offsetMs = targetLocalTime.getTime() - utcDate.getTime();
  const offsetMinutes = Math.round(offsetMs / (1000 * 60));
  const offsetHours = Math.floor(offsetMinutes / 60);
  const offsetMins = Math.abs(offsetMinutes % 60);
  
  const sign = offsetHours >= 0 ? "+" : "-";
  const hours = Math.abs(offsetHours).toString().padStart(2, "0");
  const minutes = offsetMins.toString().padStart(2, "0");
  
  return `${sign}${hours}:${minutes}`;
}

/**
 * 构建时间上下文信息
 * @param timezone 时区，如 "Asia/Shanghai"
 * @returns 时间上下文信息
 */
export function buildTimeContext(timezone: string): TimeContext {
  const now = new Date();
  
  // 获取用户时区的当前日期和时间
  const currentDate = now.toLocaleDateString("zh-CN", { 
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
  
  const currentTime = now.toLocaleTimeString("zh-CN", { 
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  
  // 获取用户时区的各个时间组件
  const year = parseInt(now.toLocaleString("en-US", { timeZone: timezone, year: "numeric" }));
  const month = parseInt(now.toLocaleString("en-US", { timeZone: timezone, month: "2-digit" }));
  const day = parseInt(now.toLocaleString("en-US", { timeZone: timezone, day: "2-digit" }));
  const hour = parseInt(now.toLocaleString("en-US", { timeZone: timezone, hour: "2-digit", hour12: false }));
  const minute = parseInt(now.toLocaleString("en-US", { timeZone: timezone, minute: "2-digit" }));
  
  // 构建用户时区的 ISO 格式时间（带时区偏移）
  const timezoneOffset = getTimezoneOffset(timezone);
  const currentDateTimeISO = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00${timezoneOffset}`;
  
  return {
    timezone,
    currentDate,
    currentTime,
    currentDateTimeISO,
    currentYear: year,
    currentMonth: month,
    currentDay: day,
    currentHour: hour,
    currentMinute: minute,
  };
}

/**
 * 构建任务创建的基础 system prompt（不包含时间信息）
 */
export function buildBaseTaskPrompt(): string {
  return `你是一个智能任务助手。用户会告诉你需要做的事情，你需要：
1. 理解用户的意图
2. 提取关键信息：任务标题、描述、时间、优先级等
3. **必须使用 createTaskTool 工具来创建任务，不要只是回复用户**

**重要：你必须调用 createTaskTool 工具来创建任务，不要只是询问用户或回复用户。直接创建任务即可。**`;
}

/**
 * 构建包含时间信息的 system prompt
 * @param timeContext 时间上下文信息
 * @returns 完整的 system prompt
 */
export function buildTaskPromptWithTime(timeContext: TimeContext): string {
  const basePrompt = buildBaseTaskPrompt();
  
  return `${basePrompt}

如果用户提到了时间（如"晚上10点"、"明天早上"、"后天"、"下周"等），需要解析为具体的日期时间。

**当前时间信息（重要，请根据这些信息计算相对时间）：**
- 当前日期：${timeContext.currentDate}
- 当前时间：${timeContext.currentTime}
- 当前时区：${timeContext.timezone}
- 当前 ISO 时间（用户时区）：${timeContext.currentDateTimeISO}
- 当前日期组件：${timeContext.currentYear}年${timeContext.currentMonth}月${timeContext.currentDay}日 ${timeContext.currentHour}:${timeContext.currentMinute}

**时间解析规则（非常重要）：**
1. 所有时间都应该转换为 ISO 8601 格式，使用带时区偏移的格式（如：2024-01-01T22:00:00+08:00）
2. 时区偏移必须与用户时区 ${timeContext.timezone} 匹配
3. 根据当前时间计算相对时间：
   - "今天" = 当前日期
   - "明天" = 当前日期 + 1天
   - "后天" = 当前日期 + 2天
   - "大后天" = 当前日期 + 3天
   - "下周" = 当前日期 + 7天（或下一个周一，根据上下文判断）
   - "下周一" = 下一个周一
   - "下周二" = 下一个周二
   - 等等...

4. 时间点解析：
   - "早上"、"上午" = 08:00-12:00（根据上下文选择合适时间）
   - "中午" = 12:00
   - "下午" = 14:00-18:00（根据上下文选择合适时间）
   - "晚上" = 19:00-23:00（根据上下文选择合适时间）
   - "晚上10点"、"22点" = 22:00:00
   - "凌晨" = 00:00-06:00

5. 示例计算：
   - 如果当前是 ${timeContext.currentDate} ${timeContext.currentTime}
   - 用户说"明天晚上10点" → 计算：当前日期 + 1天，时间 22:00:00
   - 用户说"后天下午3点" → 计算：当前日期 + 2天，时间 15:00:00
   - 用户说"下周一早上9点" → 计算：下一个周一的日期，时间 09:00:00

**重要：你必须根据当前时间信息自己计算相对时间，不要依赖预计算的值。如果用户说"后天"、"下周"等，你需要根据当前日期进行计算。**`;
}

/**
 * 根据是否有时区信息构建 system prompt
 * @param timezone 时区，如果提供则包含时间相关信息，否则只使用基础 prompt
 * @returns system prompt
 */
export function buildTaskPrompt(timezone?: string): string {
  if (timezone) {
    const timeContext = buildTimeContext(timezone);
    return buildTaskPromptWithTime(timeContext);
  }
  
  return buildBaseTaskPrompt();
}


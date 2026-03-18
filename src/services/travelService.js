// 出行方式服务
const DEEPSEEK_API_KEY = 'sk-dd1e2a365d8f4a00b499c53c1dcb276d';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/chat/completions';

class TravelService {
  constructor() {
    this.apiKey = DEEPSEEK_API_KEY;
  }

  // 获取两个商家之间的出行建议
  async getTravelSuggestion(origin, destination, date) {
    try {
      const response = await fetch(DEEPSEEK_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "你是一个专业的出行规划助手，请简洁回答，只提供驾车方案中的距离与时间，公共交通路线和步行，网约车方案，不超过150字。"
            },
            {
              role: "user",
              content: `请为我规划从${origin}到${destination}的出行方案，日期是${date}。`
            }
          ],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return result;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                result += content;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      return result;
    } catch (error) {
      console.error('获取出行建议失败:', error);
      throw error;
    }
  }
}

export default new TravelService();

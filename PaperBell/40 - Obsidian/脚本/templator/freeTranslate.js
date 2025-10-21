/**
 * Term Explanation Module for Templater
 * 为学术术语提供简洁的解释
 */

const https = require('https');

/**
 * Get term explanation using OpenAI API
 * @param {Object} tp - Templater object
 * @param {string} term - Term to explain
 * @returns {string} Term explanation or default placeholder
 */
function explainTerm(tp, term) {
    // Step 1: Validate input
    if (!term || term.trim() === '' || term === '未命名') {
        new Notice('⚠️ 术语名称无效，请提供有效的术语名称');
        return `> [!warning]\n> \n> ${term || '未命名术语'} 等待解释`;
    }

    // Step 2: Check for API Key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        new Notice('未配置 OpenAI API Key，使用默认提示');
        return `> [!warning]\n> \n> ${term} 等待解释`;
    }

    // Step 3: Call OpenAI API
    try {
        const explanation = callOpenAI(apiKey, term);
        return `> [!bot]\n> \n> ${explanation}`;
    } catch (error) {
        new Notice(`API 调用失败: ${error.message}`);
        return `> [!warning]\n> \n> ${term} 等待解释`;
    }
}

/**
 * Call OpenAI API to get term explanation
 * @param {string} apiKey - OpenAI API key
 * @param {string} term - Term to explain
 * @returns {string} Explanation from API
 */
function callOpenAI(apiKey, term) {
    const data = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: '你是一个学术助手，专门为学术术语提供简洁准确的解释。'
            },
            {
                role: 'user',
                content: `请用一句话（不超过50字）解释学术术语："${term}"`
            }
        ],
        temperature: 0.7,
        max_tokens: 100
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': data.length
        },
        timeout: 5000
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode !== 200) {
                        reject(new Error(`API 返回错误状态码: ${res.statusCode}`));
                        return;
                    }

                    const response = JSON.parse(responseData);
                    const explanation = response.choices[0].message.content.trim();
                    resolve(explanation);
                } catch (error) {
                    reject(new Error(`解析响应失败: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`请求失败: ${error.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });

        req.write(data);
        req.end();
    });
}

module.exports = {
    explainTerm
};

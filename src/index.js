const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const logger = {
    info: (type, msg) => console.log(`\x1b[36m[${type}]\x1b[0m ${msg}`),
    success: (type, msg) => console.log(`\x1b[32m[${type}]\x1b[0m ${msg}`),
    error: (type, msg) => console.error(`\x1b[31m[${type} ERROR]\x1b[0m ${msg}`),
    warn: (type, msg) => console.warn(`\x1b[33m[${type}]\x1b[0m ${msg}`)
};

/**
 * 通用流式代理处理器
 * @param {string} targetUrl 目标 URL
 * @param {object} res Express Response 对象
 * @param {object} options 自定义配置
 */
async function streamProxy(targetUrl, res, options = {}) {
    const { type = 'PROXY', cacheAge = 3600, customContentType = null } = options;
    
    try {
        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'stream',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        });

        // 合并响应头
        const headers = {
            'Content-Type': customContentType || response.headers['content-type'] || 'text/plain',
            'Cache-Control': `public, max-age=${cacheAge}`,
            'Access-Control-Allow-Origin': '*',
            'X-Powered-By': 'Liyao-CDN-Proxy',
            'X-Proxy-Source': targetUrl
        };

        if (response.headers['content-length']) headers['Content-Length'] = response.headers['content-length'];
        if (response.headers['content-encoding']) headers['Content-Encoding'] = response.headers['content-encoding'];

        res.set(headers);
        res.status(response.status);

        response.data.pipe(res);

        response.data.on('error', (err) => {
            logger.error(type, `Stream pipe error: ${err.message}`);
        });

    } catch (error) {
        logger.error(type, `Fetch failed: ${targetUrl} - ${error.message}`);
        const status = error.response ? error.response.status : 500;
        res.status(status).json({
            error: true,
            message: error.message,
            source: targetUrl
        });
    }
}

// --- 路由部分 ---

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CDN Proxy - Liyao</title>
    <style>
        :root {
            --bg: #ffffff;
            --fg: #000000;
            --accents-1: #fafafa;
            --accents-2: #eaeaea;
            --accents-3: #999;
            --radius: 5px;
        }
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body { 
            background: var(--bg); color: var(--fg); 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            margin: 0; padding: 0; 
        }
        .container { max-width: 800px; margin: 0 auto; padding: 60px 24px; }
        header { margin-bottom: 48px; }
        h1 { font-size: 32px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -1px; }
        .desc { color: var(--accents-3); font-size: 16px; }
        .card { 
            border: 1px solid var(--accents-2); border-radius: var(--radius); 
            padding: 24px; margin-bottom: 24px; transition: border-color 0.2s;
        }
        .card:hover { border-color: var(--fg); }
        .card h2 { font-size: 18px; margin: 0 0 12px 0; display: flex; align-items: center; }
        .card h2::after { content: 'GET'; font-size: 10px; background: #0070f3; color: white; padding: 2px 6px; border-radius: 10px; margin-left: 10px; }
        .label { font-size: 12px; color: var(--accents-3); text-transform: uppercase; margin-bottom: 4px; display: block; }
        code { 
            display: block; background: var(--accents-1); padding: 12px; 
            border-radius: var(--radius); font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 13px; overflow-x: auto; border: 1px solid var(--accents-2);
        }
        .footer { margin-top: 64px; font-size: 13px; color: var(--accents-3); border-top: 1px solid var(--accents-2); padding-top: 24px; }
        a { color: var(--fg); text-decoration: none; border-bottom: 1px solid var(--accents-2); }
        a:hover { border-bottom-color: var(--fg); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>CDN Edge Proxy</h1>
            <p class="desc">高性能、流式转发的 jsDelivr 与 Google Fonts 加速服务</p>
        </header>

        <div class="card">
            <h2>jsDelivr 全量代理</h2>
            <span class="label">ENDPOINT</span>
            <code>/jsdelivr/{path}</code>
            <span class="label" style="margin-top:12px">EXAMPLE</span>
            <code>/jsdelivr/gh/jquery/jquery@3.6.0/dist/jquery.min.js</code>
        </div>

        <div class="card">
            <h2>Google Fonts API</h2>
            <span class="label">ENDPOINT</span>
            <code>/fonts/css2?family=Inter:wght@400;700</code>
            <p style="font-size:13px">自动重写字体源至本地边缘节点</p>
        </div>

        <div class="card">
            <h2>NPM Package 快捷访问</h2>
            <span class="label">ENDPOINT</span>
            <code>/package/{name}@{version}/{file}</code>
            <span class="label" style="margin-top:12px">EXAMPLE</span>
            <code>/package/lodash@4.17.21/lodash.min.js</code>
        </div>

        <footer class="footer">
            Designed by <strong>Liyao</strong> &bull; <a href="https://liyao.edu.kg" target="_blank">View Blog</a>
        </footer>
    </div>
</body>
</html>
    `);
});

// jsDelivr 代理
app.get('/jsdelivr/*', (req, res) => {
    const target = `https://cdn.jsdelivr.net/${req.params[0]}`;
    logger.info('jsDelivr', req.params[0]);
    streamProxy(target, res, { type: 'jsDelivr', cacheAge: 3600 });
});

// Google Fonts CSS 代理
const handleFontCss = async (req, res, version = 'css') => {
    try {
        const queryString = new URLSearchParams(req.query).toString();
        const target = `https://fonts.googleapis.com/${version}?${queryString}`;
        logger.info('GFonts-CSS', queryString);

        const response = await axios.get(target, {
            headers: { 'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0' }
        });

        // 核心逻辑：重写字体链接
        let cssContent = response.data.replace(
            /https:\/\/fonts\.gstatic\.com\/s\//g,
            `${req.protocol}://${req.get('host')}/fonts/s/`
        );

        res.set({
            'Content-Type': 'text/css; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
        });
        res.send(cssContent);
    } catch (error) {
        logger.error('GFonts-CSS', error.message);
        res.status(500).send({ error: true, message: error.message });
    }
};

app.get('/fonts/css', (req, res) => handleFontCss(req, res, 'css'));
app.get('/fonts/css2', (req, res) => handleFontCss(req, res, 'css2'));

// Google Fonts 字体文件代理
app.get('/fonts/s/*', (req, res) => {
    const target = `https://fonts.gstatic.com/s/${req.params[0]}`;
    const ext = req.params[0].split('.').pop();
    const mimeMap = {
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        otf: 'font/otf',
        eot: 'application/vnd.ms-fontobject'
    };
    logger.success('GFonts-FILE', req.params[0]);
    streamProxy(target, res, { 
        type: 'GFonts-FILE', 
        cacheAge: 31536000, 
        customContentType: mimeMap[ext] 
    });
});

// NPM 快捷代理
app.get('/package/:package@:version/:file', (req, res) => {
    const { package, version, file } = req.params;
    const target = `https://cdn.jsdelivr.net/npm/${package}@${version}/${file}`;
    logger.info('NPM', `${package}@${version}`);
    streamProxy(target, res, { type: 'NPM', cacheAge: 3600 });
});

// 启动服务
app.listen(port, () => {
    console.log(`
\x1b[32m╔═════════════════════════════════════════════════════╗
║                                                     ║
║  🚀 CDN Proxy Server is running on port ${port}        ║
║  🔗 Local: http://localhost:${port}                   ║
║                                                     ║
╚═════════════════════════════════════════════════════╝\x1b[0m
    `);
});

module.exports = app;


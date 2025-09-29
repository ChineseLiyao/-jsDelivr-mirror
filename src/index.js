const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CDN 代理服务器</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; 
                margin: 40px; 
                line-height: 1.6; 
                background: #f8f9fa;
            }
            .container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            h1 { 
                color: #333; 
                text-align: center;
                margin-bottom: 10px;
            }
            .subtitle {
                text-align: center;
                color: #666;
                margin-bottom: 40px;
                font-size: 1.1em;
            }
            .endpoint { 
                background: #f8f9fa; 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 8px; 
                border-left: 4px solid #007bff;
                transition: transform 0.2s ease;
            }
            .endpoint:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,123,255,0.1);
            }
            .endpoint h3 {
                margin-top: 0;
                color: #007bff;
            }
            code { 
                background: #e9ecef; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-family: 'Monaco', 'Consolas', 'Source Code Pro', monospace;
                font-size: 0.9em;
            }
            .example { 
                color: #6c757d; 
                font-size: 0.9em; 
                margin-top: 8px;
                padding: 8px;
                background: #fff;
                border-radius: 4px;
                border: 1px solid #e9ecef;
            }
            .features {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 8px;
            }
            .status {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 CDN 代理服务器 <span class="status">运行中</span></h1>
            <p class="subtitle">为流行的 CDN 服务提供高性能代理</p>
            
            <div class="endpoint">
                <h3>📦 jsDelivr 代理</h3>
                <p><strong>接口地址：</strong> <code>/jsdelivr/*</code></p>
                <p>代理访问所有 jsDelivr CDN 资源，支持 npm、GitHub 等所有类型的包。</p>
                <div class="example">
                    <strong>示例：</strong><br>
                    原始链接：<code>https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.js</code><br>
                    代理链接：<code>/jsdelivr/npm/vue@3.3.4/dist/vue.global.js</code>
                </div>
            </div>
            
            <div class="endpoint">
                <h3>🔤 Google Fonts CSS</h3>
                <p><strong>接口地址：</strong> <code>/fonts/css</code> 或 <code>/fonts/css2</code></p>
                <p>代理 Google Fonts CSS API，自动重写字体文件链接为本地代理。</p>
                <div class="example">
                    <strong>示例：</strong><br>
                    原始链接：<code>https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap</code><br>
                    代理链接：<code>/fonts/css2?family=Roboto:wght@300;400;500;700&display=swap</code>
                </div>
            </div>
            
            <div class="endpoint">
                <h3>📁 Google Fonts 字体文件</h3>
                <p><strong>接口地址：</strong> <code>/fonts/s/*</code></p>
                <p>自动代理字体文件，支持 WOFF2、WOFF、TTF、EOT 等格式。</p>
                <div class="example">
                    <strong>说明：</strong> 使用 CSS 接口时会自动代理字体文件，无需手动配置
                </div>
            </div>
            
            <div class="endpoint">
                <h3>📋 NPM 包快捷访问</h3>
                <p><strong>接口地址：</strong> <code>/package/:package@:version/:file</code></p>
                <p>快速访问指定 npm 包的文件，无需完整的 jsDelivr 路径。</p>
                <div class="example">
                    <strong>示例：</strong><br>
                    <code>/package/lodash@4.17.21/lodash.min.js</code><br>
                    <code>/package/axios@1.6.0/dist/axios.min.js</code>
                </div>
            </div>
            
            <div class="features">
                <h3>✨ 功能特性</h3>
                <p>🌐 CORS 跨域支持 | ⚡ 智能缓存策略 | 🛡️ 完善错误处理 | 🚀 生产环境就绪</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 获取 jsDelivr 文件内容的路由
app.get('/jsdelivr/*', async (req, res) => {
  try {
    const filePath = req.params[0]; // 获取路径参数
    const jsdelivrUrl = `https://cdn.jsdelivr.net/${filePath}`;

    console.log('正在获取:', jsdelivrUrl);

    // 发起请求到 jsDelivr
    const response = await axios.get(jsdelivrUrl, {
      timeout: 10000, // 10秒超时
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 设置响应头
    res.set({
      'Content-Type': response.headers['content-type'] || 'text/plain',
      'Cache-Control': 'public, max-age=3600' // 缓存1小时
    });

    // 返回内容
    res.send(response.data);

  } catch (error) {
    console.error('获取内容失败:', error.message);

    if (error.response) {
      // jsDelivr 返回错误状态码
      res.status(error.response.status).send({
        error: '获取内容失败',
        status: error.response.status,
        message: error.response.statusText
      });
    } else if (error.request) {
      // 请求未发出
      res.status(500).send({
        error: '网络请求失败',
        message: '无法连接到 jsDelivr'
      });
    } else {
      // 其他错误
      res.status(500).send({
        error: '服务器错误',
        message: error.message
      });
    }
  }
});

// Google Fonts CSS API 代理
app.get('/fonts/css', async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const googleFontsUrl = `https://fonts.googleapis.com/css?${queryString}`;

    console.log('正在获取 Google Fonts CSS:', googleFontsUrl);

    const response = await axios.get(googleFontsUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 处理 CSS 内容，将字体文件 URL 替换为本地代理 URL
    let cssContent = response.data;
    cssContent = cssContent.replace(
      /https:\/\/fonts\.gstatic\.com\/s\//g,
      `${req.protocol}://${req.get('host')}/fonts/s/`
    );

    res.set({
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // 24小时缓存
      'Access-Control-Allow-Origin': '*'
    });

    res.send(cssContent);

  } catch (error) {
    console.error('获取 Google Fonts CSS 失败:', error.message);

    if (error.response) {
      res.status(error.response.status).send({
        error: '获取字体 CSS 失败',
        status: error.response.status,
        message: error.response.statusText
      });
    } else {
      res.status(500).send({
        error: '获取字体 CSS 失败',
        message: error.message
      });
    }
  }
});

// Google Fonts CSS2 API 代理 (新版本)
app.get('/fonts/css2', async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const googleFontsUrl = `https://fonts.googleapis.com/css2?${queryString}`;

    console.log('正在获取 Google Fonts CSS2:', googleFontsUrl);

    const response = await axios.get(googleFontsUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 处理 CSS 内容，将字体文件 URL 替换为本地代理 URL
    let cssContent = response.data;
    cssContent = cssContent.replace(
      /https:\/\/fonts\.gstatic\.com\/s\//g,
      `${req.protocol}://${req.get('host')}/fonts/s/`
    );

    res.set({
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // 24小时缓存
      'Access-Control-Allow-Origin': '*'
    });

    res.send(cssContent);

  } catch (error) {
    console.error('获取 Google Fonts CSS2 失败:', error.message);

    if (error.response) {
      res.status(error.response.status).send({
        error: '获取字体 CSS2 失败',
        status: error.response.status,
        message: error.response.statusText
      });
    } else {
      res.status(500).send({
        error: '获取字体 CSS2 失败',
        message: error.message
      });
    }
  }
});

// Google Fonts 字体文件代理
app.get('/fonts/s/*', async (req, res) => {
  try {
    const filePath = req.params[0];
    const fontUrl = `https://fonts.gstatic.com/s/${filePath}`;

    console.log('正在获取字体文件:', fontUrl);

    const response = await axios.get(fontUrl, {
      timeout: 15000, // 字体文件可能较大，增加超时时间
      responseType: 'arraybuffer', // 处理二进制数据
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 根据文件扩展名设置正确的 Content-Type
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.woff2')) {
      contentType = 'font/woff2';
    } else if (filePath.endsWith('.woff')) {
      contentType = 'font/woff';
    } else if (filePath.endsWith('.ttf')) {
      contentType = 'font/ttf';
    } else if (filePath.endsWith('.eot')) {
      contentType = 'application/vnd.ms-fontobject';
    }

    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000', // 字体文件缓存1年
      'Access-Control-Allow-Origin': '*'
    });

    res.send(response.data);

  } catch (error) {
    console.error('获取字体文件失败:', error.message);

    if (error.response) {
      res.status(error.response.status).send({
        error: '获取字体文件失败',
        status: error.response.status,
        message: error.response.statusText
      });
    } else {
      res.status(500).send({
        error: '获取字体文件失败',
        message: error.message
      });
    }
  }
});

// 示例：获取特定包的文件
app.get('/package/:package@:version/:file', async (req, res) => {
  try {
    const { package, version, file } = req.params;
    const jsdelivrUrl = `https://cdn.jsdelivr.net/npm/${package}@${version}/${file}`;

    const response = await axios.get(jsdelivrUrl);

    res.set({
      'Content-Type': response.headers['content-type'] || 'text/plain'
    });

    res.send(response.data);

  } catch (error) {
    res.status(500).send({
      error: '获取包内容失败',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 CDN Proxy Server is running on http://localhost:${port}`);
  console.log(`📦 jsDelivr proxy: http://localhost:${port}/jsdelivr/*`);
  console.log(`🔤 Google Fonts proxy: http://localhost:${port}/fonts/css*`);
});


module.exports = app;

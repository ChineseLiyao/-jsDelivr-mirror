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
        :root {
            --primary-color: #000000;
            --secondary-color: #333333;
            --background-color: #ffffff;
            --border-color: #e0e0e0;
            --code-bg: #f5f5f5;
            --shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
        }
        
        body {
            background-color: var(--background-color);
            color: var(--primary-color);
            line-height: 1.6;
            padding: 0 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 0;
        }
        
        header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 1px solid var(--border-color);
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 1.2rem;
            color: var(--secondary-color);
            font-weight: 400;
        }
        
        .endpoint {
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: var(--shadow);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .endpoint:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        h3 {
            font-size: 1.4rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        h3::before {
            content: "•";
            color: var(--primary-color);
            font-size: 1.8rem;
        }
        
        p {
            margin-bottom: 15px;
            color: var(--secondary-color);
        }
        
        strong {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        code {
            background-color: var(--code-bg);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.9rem;
            color: var(--primary-color);
        }
        
        .example {
            background-color: var(--code-bg);
            border-left: 3px solid var(--primary-color);
            padding: 15px;
            margin-top: 15px;
            border-radius: 0 4px 4px 0;
        }
        
        .example code {
            background-color: rgba(0, 0, 0, 0.05);
            display: block;
            padding: 10px;
            margin: 8px 0;
            border-radius: 4px;
            overflow-x: auto;
            white-space: nowrap;
        }
        
        footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
            color: var(--secondary-color);
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .endpoint {
                padding: 20px;
            }
            
            .container {
                padding: 20px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>CDN 代理服务器</h1>
            <p class="subtitle">为流行的 CDN 服务提供高性能代理</p>
        </header>
        
        <div class="endpoint">
            <h3>jsDelivr 代理</h3>
            <p><strong>接口地址：</strong> <code>/jsdelivr/*</code></p>
            <p>代理访问所有 jsDelivr CDN 资源，支持 npm、GitHub 等所有类型的包。</p>
            <div class="example">
                <strong>示例：</strong>
                <p>原始链接：</p>
                <code>https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.js</code>
                <p>代理链接：</p>
                <code>/jsdelivr/npm/vue@3.3.4/dist/vue.global.js</code>
            </div>
        </div>
        
        <div class="endpoint">
            <h3>Google Fonts CSS</h3>
            <p><strong>接口地址：</strong> <code>/fonts/css</code> 或 <code>/fonts/css2</code></p>
            <p>代理 Google Fonts CSS API，自动重写字体文件链接为本地代理。</p>
            <div class="example">
                <strong>示例：</strong>
                <p>原始链接：</p>
                <code>https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap</code>
                <p>代理链接：</p>
                <code>/fonts/css2?family=Roboto:wght@300;400;500;700&display=swap</code>
            </div>
        </div>
        
        <div class="endpoint">
            <h3>Google Fonts 字体文件</h3>
            <p><strong>接口地址：</strong> <code>/fonts/s/*</code></p>
            <p>自动代理字体文件，支持 WOFF2、WOFF、TTF、EOT 等格式。</p>
            <div class="example">
                <strong>说明：</strong> 使用 CSS 接口时会自动代理字体文件，无需手动配置
            </div>
        </div>
        
        <div class="endpoint">
            <h3>NPM 包快捷访问</h3>
            <p><strong>接口地址：</strong> <code>/package/:package@:version/:file</code></p>
            <p>快速访问指定 npm 包的文件，无需完整的 jsDelivr 路径。</p>
            <div class="example">
                <strong>示例：</strong>
                <code>/package/lodash@4.17.21/lodash.min.js</code>
                <code>/package/axios@1.6.0/dist/axios.min.js</code>
            </div>
        </div>
        
        <footer>
            <p>CDN 代理服务器 &copy; 2023</p>
        </footer>
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




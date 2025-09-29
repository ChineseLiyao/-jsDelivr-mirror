const request = require('supertest');
const app = require('../src/index');

describe('CDN Proxy Server', () => {
  describe('GET /', () => {
    it('should return the homepage with API documentation', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('CDN Proxy Server');
      expect(res.text).toContain('/jsdelivr/*');
      expect(res.text).toContain('/fonts/css');
    });
  });

  describe('jsDelivr Proxy', () => {
    it('should proxy jsDelivr requests', async () => {
      const res = await request(app)
        .get('/jsdelivr/npm/vue@3.3.4/package.json')
        .timeout(10000);
      
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    }, 15000);
  });

  describe('Google Fonts Proxy', () => {
    it('should proxy Google Fonts CSS requests', async () => {
      const res = await request(app)
        .get('/fonts/css2?family=Roboto:wght@400;700')
        .timeout(10000);
      
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('text/css');
      expect(res.text).toContain('font-family');
    }, 15000);

    it('should rewrite font URLs in CSS', async () => {
      const res = await request(app)
        .get('/fonts/css2?family=Roboto:wght@400')
        .timeout(10000);
      
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('/fonts/s/');
      expect(res.text).not.toContain('fonts.gstatic.com');
    }, 15000);
  });

  describe('Package Shortcut', () => {
    it('should handle package shortcut requests', async () => {
      const res = await request(app)
        .get('/package/lodash@4.17.21/package.json')
        .timeout(10000);
      
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const res = await request(app)
        .get('/jsdelivr/npm/nonexistent-package@1.0.0/index.js')
        .timeout(10000);
      
      expect(res.statusCode).toBe(404);
    }, 15000);
  });
});
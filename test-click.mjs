import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173');
  await page.waitForSelector('button[title="Push directly to GitHub"]');
  console.log('Found button, clicking...');
  await page.click('button[title="Push directly to GitHub"]');
  console.log('Clicked.');
  
  await page.waitForTimeout(1000);
  
  const hasModal = await page.evaluate(() => {
    return document.body.innerHTML.includes('Push to GitHub');
  });
  console.log('Has modal string:', hasModal);
  
  await browser.close();
})();

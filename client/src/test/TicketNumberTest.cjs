const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('MicrosoftEdge').build();

  try {
    await driver.get('http://localhost:5173/ticketnumber'); 

    // Wait for the page to load
    await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(),"Current Number")]')), 10000);

    // Find and display the current number
    let currentNumberElement = await driver.findElement(By.css('div[style*="font-weight: bold; color: red; display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 200px;"]'));

    let currentNumber = await currentNumberElement.getText();
    console.log(`Current Number: ${currentNumber}`);

  } finally {
    await driver.quit();
  }
}

runTest();

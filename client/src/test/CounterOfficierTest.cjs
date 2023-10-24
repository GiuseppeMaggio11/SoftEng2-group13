const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTest() {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();

    try {
        await driver.get('http://localhost:5173/counterofficier');

        // Wait for the page to load
        await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(),"Currently serving")]')), 10000);

        // Find and click the "Call next customer" button
        let callButton = await driver.findElement(By.xpath('//span[contains(text(),"Call next customer")]'));
        await callButton.click();

        // Wait briefly for the number to update
        await driver.sleep(1000);

        // Find and display the updated number
        let updatedNumberElement = await driver.findElement(By.css('div[style*="font-weight: bold; color: black; display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 200px;"]'));
        let updatedNumber = await updatedNumberElement.getText();
        console.log(`Updated Number first time: ${updatedNumber}`);
        await callButton.click();

        // Wait briefly for the number to update
        await driver.sleep(1000);

        updatedNumber = await updatedNumberElement.getText();
        console.log(`Updated Number first time: ${updatedNumber}`);


    } finally {
        await driver.quit();
    }
}

runTest();

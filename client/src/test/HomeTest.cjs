const { Builder, By, Key, until } = require("selenium-webdriver");

(async function () {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Apri la pagina Home
    await driver.get('http://localhost:5173/');

    // Esempio di attesa implicita (attendi fino a 10 secondi per tutti gli elementi)
    await driver.manage().setTimeouts({ implicit: 10000 });

    // Esegui un test sui pulsanti e sui link
    const buttons = await driver.findElements(By.tagName("button"));
    for (const button of buttons) {
      const buttonText = await button.getText();
      if (buttonText === "Customer Interface") {
        await button.click();
        // Assicurati che la pagina di destinazione sia stata caricata
        // Esegui ulteriori test sulla pagina di destinazione se necessario
        await driver.navigate().back(); // Torna alla pagina Home
      }
    }

    // Esempio di test su link
    const links = await driver.findElements(By.tagName("a"));
    for (const link of links) {
      const linkText = await link.getText();
      if (linkText === "Get Ticket Number") {
        await link.click();
        // Assicurati che la pagina di destinazione sia stata caricata
        // Esegui ulteriori test sulla pagina di destinazione se necessario
        await driver.navigate().back(); // Torna alla pagina Home
      }
    }
  } catch (error) {
    console.error("Errore durante l'esecuzione del test:", error);
  } finally {
    await driver.quit();
  }
})();

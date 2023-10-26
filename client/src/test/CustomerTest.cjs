const { Builder, By, until } = require("selenium-webdriver");

(async function () {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Apri la pagina Customer
    await driver.get("'http://localhost:5173/customer'");

    // Esempio di attesa implicita (attendi fino a 10 secondi per tutti gli elementi)
    await driver.manage().setTimeouts({ implicit: 10000 });

    // Esegui un test sul pulsante "Get a new ticket"
    const getTicketButton = await driver.findElement(By.xpath("//button[text()='Get a new ticket']"));
    await getTicketButton.click();

    // Esempio di attesa esplicita (attendi fino a 10 secondi che il messaggio "Thank you!" sia visibile)
    await driver.wait(until.elementLocated(By.xpath("//h1[text()='Thank you!']"), 10000));

    // Verifica che il messaggio "Thank you!" sia visibile
    const thankYouMessage = await driver.findElement(By.xpath("//h1[text()='Thank you!']"));
    if (!(await thankYouMessage.isDisplayed())) {
      throw new Error("Il messaggio 'Thank you!' non è stato visualizzato.");
    }
  } catch (error) {
    console.error("Errore durante l'esecuzione del test:", error);
  } finally {
    await driver.quit();
  }
})();

import {browser, element, by } from 'protractor';

describe("Prueba 1", ()=>{
    beforeEach(()=>{
        browser.get("/home");
    });

    it("El tab 1 se muestra por defecto", ()=>{
        expect(element(by.css(".tab-select ion-label")).getText()).toContain("Tab 1");
    });

    it("El usuario selecciona el tab 2", async ()=>{
        await element(by.css("[tab=tab2]")).click();
        browser.driver.sleep(500);
        expect(element(by.css(".tab-select ion-label")).getText()).toContain("Tab 2");

    });
});
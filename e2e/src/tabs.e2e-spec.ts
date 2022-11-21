import {browser, element, by, By } from 'protractor';



describe("Prueba 1 | Mostrar página de iniciar sesión |", ()=>{
    beforeEach(()=>{
        browser.get("/");
    });

    it("Se muestra la página de iniciar sesión",()=>{
    expect(element(By.css("ion-button")).getText()).toContain("Entrar");
    });
});

describe("Prueba 2 | Mostrar home |", ()=>{
    beforeEach(()=>{
        browser.get("/main");
    });

    it("Se muestra el home",()=>{
    expect(element(By.css('[data-testid="btn1"]')).getText()).toContain("Mi Perfil");
    });
});

describe("Prueba 3 | Navegar hacia perfil |", ()=>{

    beforeEach(()=>{
        browser.get("/main");
    });

    it("El usuario puede navejar a su perfil",async ()=>{
        await element(By.css('[data-testid="btn2"]')).click();
        browser.driver.sleep(20000)
        expect(element(By.css('[data-testid="btn3"]')).getText()).toContain("Mi Perfil");
    });
});

// describe("Prueba 3 | Navegar hacia ajustes |", ()=>{
//     beforeEach(()=>{
//         browser.get("/main");
//     });

//     it("El usuario puede navejar a su perfil",async ()=>{
//         await element(by.css(".fuenteM"))
//         expect(element(by.css(".fuente label")).getText()).toContain("Mi Perfil");
//     });
// });


describe('Pruebas del Módulo de Rango de Precio', () => {

    beforeEach(() => {
        // Limpiamos almacenamiento previo para arrancar con un estado limpio
        cy.clearLocalStorage();
        cy.clearCookies();

        // Simulamos que el usuario tiene sesión activa ingresando el token
        cy.visit('http://localhost:3000/price-range', {
            failOnStatusCode: false,
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'fake-jwt-token-12345');
            }
        });
    });

    it('debería renderizar la página con el título y el presupuesto inicial por defecto', () => {
        cy.contains('h1', 'Rango de precio').should('be.visible');
        cy.contains('p', 'Encuentra estudios y tatuadores según tu presupuesto.').should('be.visible');
        
        // Verifica que el rango por defecto ($0 — $1.5M) se muestre correctamente
        cy.contains('span', '$0 — $1.5M').should('be.visible');
    });

    it('debería actualizar el presupuesto visual al hacer clic en los atajos (presets)', () => {
        // Hacemos clic en el preset de "Menos de $100.000"
        cy.contains('button', 'Menos de $100.000').click();
        cy.contains('span', '$0 — $100K').should('be.visible');

        // Hacemos clic en el preset de "$300.000 - $600.000"
        cy.contains('button', '$300.000 - $600.000').click();
        cy.contains('span', '$300K — $600K').should('be.visible');
    });

    it('debería mostrar las tarjetas de resultados con sus nombres, categorías y precios', () => {
        // Esperamos a que termine el estado de carga si lo hay
        cy.contains('Buscando...').should('not.exist');

        // Validamos que se listen los estudios/tatuadores (usando los del mock por defecto si la API no responde)
        cy.get('main').find('a[href*="/studio/"], a[href*="/profile/"]').should('have.length.at_least', 1);

        // Tomamos la primera tarjeta para verificar que tenga la estructura mínima requerida
        cy.get('main').find('a[href*="/studio/"], a[href*="/profile/"]').first().within(() => {
            cy.get('h3').should('be.visible'); // Nombre del estudio/artista
            cy.get('span').eq(1).should('contain', '$'); // Rango de precio formateado
            cy.contains('reseñas').should('be.visible'); // Contador de reviews
        });
    });

    it('debería permitir abrir y cambiar la opción del dropdown de ordenamiento', () => {
        // El dropdown debe iniciar con la opción por defecto
        cy.contains('button', 'Recomendados').click();
        
        // Verificamos que se desplieguen las opciones de ordenamiento
        cy.contains('button', 'Mejor calificados').should('be.visible');
        cy.contains('button', 'Menor precio').should('be.visible').click();

        // El dropdown debió cerrarse y actualizar el label del botón principal
        cy.contains('button', 'Menor precio').should('be.visible');
        cy.contains('button', 'Mejor calificados').should('not.exist');
    });
});
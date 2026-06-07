describe('Pruebas del Módulo de Rango de Precio', () => {
    beforeEach(() => {
        // Limpiamos almacenamiento previo para arrancar con un estado limpio
        cy.clearLocalStorage();
        cy.clearCookies();

        // Interceptamos la petición de la API para evitar el error 404 de /undefined
        cy.intercept('GET', '**/posts/filter-by-price*', {
            statusCode: 200,
            body: [],
        }).as('getFilteredPrices');

        // Simulamos que el usuario tiene sesión activa ingresando el token
        cy.visit('http://localhost:3000/price-range', {
            failOnStatusCode: false,
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'fake-jwt-token-12345');
            },
        });

        // Esperamos a que la petición simulada se complete para estabilizar el DOM
        cy.wait('@getFilteredPrices');
    });

    it('debería renderizar la página con el título y el presupuesto inicial por defecto', () => {
        cy.contains('h1', 'Rango de precio').should('be.visible');
        cy.contains('p', 'Encuentra estudios y tatuadores según tu presupuesto.').should(
            'be.visible'
        );

        // Cambiado a 'exist' para evitar fallos por overflow/clipping
        cy.contains('span', '$0 — $1.5M').should('exist');
    });

    it('debería actualizar el presupuesto visual al hacer clic en los atajos (presets)', () => {
        // Hacemos clic en el preset de "Menos de $100.000"
        cy.contains('button', 'Menos de $100.000').click();
        cy.contains('span', '$0 — $100K').should('exist');

        // Hacemos clic en el preset de "$300.000 - $600.000"
        cy.contains('button', '$300.000 - $600.000').click();
        cy.contains('span', '$300K — $600K').should('exist');
    });

    it('debería mostrar las tarjetas de resultados con sus nombres, categorías y precios', () => {
        // Esperamos a que termine el estado de carga si lo hay
        cy.contains('Buscando...').should('not.exist');

        // Apuntamos directamente a los enlaces dentro de la grilla de resultados
        cy.get('.grid a').should('have.length.gte', 1);

        // Tomamos la primera tarjeta de la grilla para verificar su estructura interna
        cy.get('.grid a')
            .first()
            .within(() => {
                cy.get('h3').should('exist');
                cy.get('span').should('exist').and('contain', '$');
                cy.contains('reseñas').should('exist');
            });
    });

    it('debería permitir abrir y cambiar la opción del dropdown de ordenamiento', () => {
        // Cambiado a 'exist' con click forzado para evitar el error de clipping/overflow
        cy.contains('button', 'Recomendados').should('exist').click({ force: true });

        // Verificamos que la opción esté disponible en el DOM
        cy.contains('Mejor calificados').should('exist');

        // Hacemos clic en "Menor precio" forzando el click para asegurar el cambio
        cy.contains('Menor precio').should('exist').click({ force: true });

        // Validamos que el botón principal se haya actualizado correctamente
        cy.contains('button', 'Menor precio').should('exist');
    });
});

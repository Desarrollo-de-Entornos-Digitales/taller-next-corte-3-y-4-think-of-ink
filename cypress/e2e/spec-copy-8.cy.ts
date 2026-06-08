describe('Pruebas del Perfil de Estudio (StudioProfilePage)', () => {
    const studioId = 'test-studio-123';

    it('debería renderizar la página', () => {
        // Interceptores ultra-permisivos
        cy.intercept('GET', '**/studios/' + studioId).as('getStudio');
        cy.intercept('GET', '**/posts/studio/' + studioId).as('getPosts');

        cy.visit(`http://localhost:3000/studios/${studioId}`, { failOnStatusCode: false });

        // En lugar de esperar indefinidamente, hagamos un log si falla
        cy.wait(['@getStudio', '@getPosts'], { timeout: 10000 }).then((interceptions) => {
            cy.log('Peticiones capturadas:', interceptions);
        });
    });
});

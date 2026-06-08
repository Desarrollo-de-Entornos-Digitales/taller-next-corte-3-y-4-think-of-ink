describe('Pruebas de Configuración (SettingsPage)', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'fake-jwt-token');
            win.localStorage.setItem('username', 'tatuador_test');
        });

        cy.intercept('GET', '**/profile', {
            statusCode: 200,
            body: {
                user: {
                    name: 'Tatuador Test',
                    username: 'tatuador_test',
                    email: 'test@taller.com',
                },
            },
        }).as('getProfile');
    });

    it('debería cargar la página y esperar los datos', () => {
        cy.visit('http://localhost:3000/profile/settings');

        cy.wait('@getProfile', { timeout: 15000 });

        cy.contains('Cargando configuración...').should('not.exist');
        cy.contains('Información del perfil').should('be.visible');
    });
});

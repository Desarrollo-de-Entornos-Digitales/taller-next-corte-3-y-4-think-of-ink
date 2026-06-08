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
                    profession: 'Tatuador Profesional',
                    bio: 'Especialista en realismo',
                    location: 'Cali, Colombia',
                },
            },
        }).as('getProfile');

        cy.visit('http://localhost:3000/profile/settings');
    });

    it('debería cargar los datos, permitir editarlos y guardarlos', () => {
        cy.wait('@getProfile');
        cy.contains('Cargando configuración...').should('not.exist');

        cy.intercept('PATCH', '**/profile', {
            statusCode: 200,
            body: { message: 'Success' },
        }).as('saveProfile');

        cy.get('input[placeholder="Tu nombre completo"]')
            .should('be.visible')
            .clear()
            .type('Nuevo Nombre Test');

        cy.get('input[placeholder="Ej: Diseñadora Digital"]').clear().type('Tatuador Senior');

        cy.contains('button', 'Guardar cambios').click();

        cy.wait('@saveProfile').then((interception) => {
            expect(interception.request.body.name).to.equal('Nuevo Nombre Test');
            expect(interception.request.body.profession).to.equal('Tatuador Senior');
        });

        cy.on('window:alert', (text) => {
            expect(text).to.contains('Cambios guardados con éxito');
        });
    });
});

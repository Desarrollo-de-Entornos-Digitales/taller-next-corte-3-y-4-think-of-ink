y pegaste esto: describe('Pruebas de Mis Publicaciones (MyPostsPage)', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'fake-jwt-token');
            win.localStorage.setItem('username', 'tatuador_test');
        });
    });

    it('debería cargar la página sin errores', () => {
        cy.intercept('GET', '**/posts/**', {
            statusCode: 200,
            body: [],
        }).as('getMyPosts');

        cy.visit('http://localhost:3000/profile/my-posts', { failOnStatusCode: false });

        cy.wait('@getMyPosts', { timeout: 10000 }).then((interception) => {
            cy.log('Interceptor capturó la ruta:', interception.request.url);
        });

        cy.contains('Mis publicaciones').should('be.visible');
    });
});
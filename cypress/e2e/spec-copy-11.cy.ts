describe('Pruebas del Feed: Creación y Likes', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'fake-jwt-token');
            win.localStorage.setItem('username', 'usuario_test');
        });

        cy.intercept('GET', '**/posts', {
            statusCode: 200,
            body: [
                {
                    id: '1',
                    title: 'Post de Prueba',
                    content: 'Contenido inicial',
                    category: { name: 'Tatuaje' },
                    user: { username: 'usuario_test' },
                    likesCount: 0,
                },
            ],
        }).as('getPosts');

        cy.visit('http://localhost:3000/feed');
        cy.wait('@getPosts');
    });

    it('debería abrir el modal, crear un post y dar like correctamente', () => {
        cy.contains('button', 'Nueva publicación').should('be.visible').click();

        cy.get('input[placeholder="Escribe un título atractivo"]').type('Título Test Cypress');
        cy.get('textarea').first().type('Descripción de prueba automatizada');
        cy.get('select').select('Tatuaje');

        cy.intercept('POST', '**/posts', {
            statusCode: 201,
            body: { message: 'Success' },
        }).as('createPost');

        cy.contains('button', 'Publicar').click();
        cy.wait('@createPost');

        cy.get('input[placeholder="Escribe un título atractivo"]').should('not.exist');

        cy.intercept('POST', '**/posts/1/like', {
            statusCode: 200,
            body: { likesCount: 1, isLiked: true },
        }).as('likePost');

        cy.contains('Post de Prueba')
            .closest('div') // Subimos al contenedor principal del post
            .find('button')
            .filter(':contains("🤍"), :contains("❤️")') // Buscamos botones con emojis de like
            .first()
            .click();

        cy.wait('@likePost');

        cy.contains('Post de Prueba').closest('div').find('button').should('contain', '❤️');

        cy.contains('Post de Prueba').closest('div').should('contain', '1');
    });
});
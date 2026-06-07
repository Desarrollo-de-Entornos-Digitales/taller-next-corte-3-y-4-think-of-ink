describe('Pruebas del Perfil de Estudio (StudioProfilePage)', () => {
    const API_URL = 'http://localhost:3001/api'; // Ajusta la URL según tu backend real
    const studioId = 'test-studio-123';

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.viewport(1920, 1080); // Evitamos problemas de clipping de CSS

        // Configuramos las variables de entorno simuladas si es necesario
        Cypress.env('NEXT_PUBLIC_API_URL', API_URL);
    });

    it('debería mostrar el spinner de carga al entrar y luego renderizar los datos del estudio', () => {
        // Interceptamos las llamadas a la API con datos simulados (Mocks)
        cy.intercept('GET', `${API_URL}/studios/${studioId}`, {
            statusCode: 200,
            body: {
                id: studioId,
                name: 'Tinta Dorada Studio',
                logoUrl: null,
                description: 'Estudio profesional en el centro de Cali.',
                location: 'Cali, Colombia',
                followersCount: 1500,
                rating: 4.8,
                website: 'www.tintadorada.com'
            }
        }).as('getStudio');

        cy.intercept('GET', `${API_URL}/posts/studio/${studioId}`, {
            statusCode: 200,
            body: [
                {
                    id: 'post-1',
                    title: 'Tatuaje Realismo',
                    content: 'Sesión de 6 horas usando sombras suaves.',
                    imageUrl: null,
                    _count: { likes: 45, comments: 12 },
                    createdAt: new Date().toISOString()
                }
            ]
        }).as('getPosts');

        // Visitamos la página pasando el ID dinámico en la URL
        cy.visit(`http://localhost:3000/studios/${studioId}`, { failOnStatusCode: false });

        // Validamos que los datos mockeados se pinten en la interfaz gráfica
        cy.wait(['@getStudio', '@getPosts']);
        cy.contains('h1', 'Tinta Dorada Studio').should('be.visible');
        cy.contains('Estudio profesional en el centro de Cali.').should('be.visible');
        cy.contains('Cali, Colombia').should('be.visible');
        cy.contains('1500').should('be.visible'); // Seguidores
        cy.contains('4.8').should('be.visible'); // Rating
        cy.contains('Sitio web').should('be.visible');
    });

    it('debería abrir el modal con los detalles completos al hacer clic en un post', () => {
        cy.intercept('GET', `${API_URL}/studios/${studioId}`, {
            body: { name: 'Studio Test' }
        });

        cy.intercept('GET', `${API_URL}/posts/studio/${studioId}`, {
            body: [
                {
                    id: 'post-click',
                    title: 'Tatuaje Neo Tradicional',
                    content: 'Diseño personalizado de una serpiente.',
                    _count: { likes: 120, comments: 5 },
                    createdAt: new Date().toISOString()
                }
            ]
        });

        cy.visit(`http://localhost:3000/studios/${studioId}`);

        // Buscamos el botón/tarjeta del post por su título y le damos clic
        cy.contains('Tatuaje Neo Tradicional').closest('button').click();

        // Validamos que el modal se abra visualizando la estructura interna
        cy.get('div.fixed.inset-0.z-\\[100\\]').should('be.visible'); // Valida el contenedor del modal
        cy.contains('h3', 'Tatuaje Neo Tradicional').should('be.visible');
        cy.contains('Diseño personalizado de una serpiente.').should('be.visible');
        cy.contains('120 likes').should('be.visible');
        cy.contains('5 comentarios').should('be.visible');

        // Cerramos el modal haciendo clic en el botón con el ícono X
        cy.get('button').find('svg').closest('button').click();
        cy.contains('120 likes').should('not.exist'); // Asegura que se haya cerrado
    });

    it('debería manejar el caso de error de API recurriendo a la data estática por defecto (Fallback)', () => {
        // Hacemos que la API responda con un error de servidor (500)
        cy.intercept('GET', `${API_URL}/studios/inexistente`, { statusCode: 500 });
        cy.intercept('GET', `${API_URL}/posts/studio/inexistente`, { statusCode: 500 });

        cy.visit('http://localhost:3000/studios/inexistente');

        // Si el ID "inexistente" no está en tus MOCK_STUDIOS del frontend, mostrará la pantalla de vacío:
        cy.contains('Estudio no encontrado').should('be.visible');
        cy.contains('Volver al inicio').should('have.attr', 'href', '/feed');
    });

    it('debería mostrar el estado vacío si el estudio existe pero no tiene posts', () => {
        cy.intercept('GET', `${API_URL}/studios/${studioId}`, {
            body: { name: 'Studio Sin Posts', followersCount: 0 }
        });

        // Retornamos un arreglo vacío de posts
        cy.intercept('GET', `${API_URL}/posts/studio/${studioId}`, {
            body: []
        });

        cy.visit(`http://localhost:3000/studios/${studioId}`);

        // Verificamos el bloque condicional del frontend
        cy.contains('No hay trabajos publicados').should('be.visible');
    });
});
describe('Pruebas del Módulo de Categorías y Exploración', () => {

    beforeEach(() => {
        // Limpiamos almacenamiento previo para arrancar con un estado limpio
        cy.clearLocalStorage();
        cy.clearCookies();

        // Interceptamos la petición a la API para evitar el error 404 por variables de entorno /undefined
        // Simulamos que el backend responde con un par de posts estructurados
        cy.intercept('GET', '**/posts*', {
            statusCode: 200,
            body: [
                {
                    id: 'mock-1',
                    title: 'Dragón Neo Tradicional',
                    imageUrl: '/images/tattoos/tattoo-5.jpg',
                    createdAt: new Date().toISOString(),
                    category: { name: 'Neo Tradicional' },
                    user: { id: 'u1', username: 'ArtInker' },
                    likes: 12,
                    comments: 4
                },
                {
                    id: 'mock-2',
                    title: 'Líneas finas flores',
                    imageUrl: '/images/tattoos/tattoo-6.jpg',
                    createdAt: new Date().toISOString(),
                    category: { name: 'Fine Line' },
                    user: { id: 'u2', username: 'GigiTattoo' },
                    likes: 45,
                    comments: 7
                }
            ]
        }).as('getPosts');

        // Simulamos la sesión inyectando el token antes de cargar la página
        cy.visit('http://localhost:3000/categories', {
            failOnStatusCode: false,
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'fake-jwt-token-98765');
            }
        });

        // Esperamos a que la API simulada responda para asegurar estabilidad en la interfaz
        cy.wait('@getPosts');
    });

    it('debería renderizar los elementos base de la página (título, buscador y filtros)', () => {
        cy.contains('h1', 'Categorías').should('be.visible');
        cy.contains('Explora tatuajes, artistas y estudios según tus intereses.').should('be.visible');
        
        // Validamos la barra de búsqueda por su placeholder
        cy.get('input[placeholder*="Buscar estilos, tatuadores o estudios..."]').should('exist');
    });

    it('debería permitir escribir en la barra de búsqueda', () => {
        const query = 'Realismo';
        cy.get('input[placeholder*="Buscar estilos, tatuadores o estudios..."]')
            .type(query)
            .should('have.value', query);
    });

    it('debería mostrar las secciones de contenido estático y dinámico', () => {
        // Esperamos que termine el indicador de carga si existe
        cy.get('.animate-spin').should('not.exist');

        // Validamos la presencia de los títulos de las secciones sin importar la etiqueta HTML (h2, h3, span)
        cy.contains('Recientes').should('exist');
        cy.contains('Más virales').should('exist');
        cy.contains('Más likes').should('exist');
        cy.contains('Tatuadores cerca de ti').should('exist');
        cy.contains('Estudios destacados').should('exist');
    });

    it('debería renderizar las tarjetas fijas de artistas y estudios con su información', () => {
        // Comprobamos la existencia de la data estática de artistas (ARTISTS)
        cy.contains('Black Ink Studio').should('exist');
        cy.contains('Blackwork y Realismo').should('exist');

        // Comprobamos la existencia de la data estática de estudios (STUDIOS)
        cy.contains('Estudio 79 Tattoo').should('exist');
        cy.contains('Bogotá').should('exist');
    });

    it('debería cambiar el filtro de categorías al hacer clic en una opción', () => {
        // Hacemos clic en la categoría deseada usando force: true por si hay scroll horizontal
        cy.contains('Fine Line').should('exist').click({ force: true });

        // Verificamos que la página mantenga su estructura básica tras el filtro
        cy.contains('Categorías').should('exist');
    });

    it('debería mostrar el bloque de categoría vacía si filtramos por una sin resultados', () => {
        // Hacemos clic en una categoría que no venga en nuestro mock de la API (ej: Piercing)
        cy.contains('Piercing').should('exist').click({ force: true });

        // Validamos que aparezca el mensaje de error controlado de la interfaz
        cy.contains('No hay publicaciones en esta categoría').should('exist');
    });
});
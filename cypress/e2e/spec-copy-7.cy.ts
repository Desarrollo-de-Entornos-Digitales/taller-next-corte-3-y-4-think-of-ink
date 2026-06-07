describe('Pruebas del Módulo de Geolocalización y Estudios', () => {

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();

        // Visitamos la página de mapas/locación
        cy.visit('http://localhost:3000/location', {
            failOnStatusCode: false,
            onBeforeLoad(win) {
                // Inyectamos token por si las moscas los componentes Navbar/Sidebar lo validan
                win.localStorage.setItem('token', 'fake-jwt-token-12345');
            }
        });
    });

    it('debería renderizar la estructura base de la interfaz (títulos, sidebar y buscador)', () => {
        // Validar textos principales
        cy.contains('h1', 'Explora estudios cerca de ti').should('be.visible');
        cy.contains('Encuentra tatuadores y estudios según tu ubicación.').should('be.visible');
        cy.contains('Estudios y tatuadores cercanos').should('be.visible');

        // Validar el input de búsqueda por su placeholder descriptivo
        cy.get('input[placeholder*="Buscar ciudad, barrio o estudio..."]').should('be.visible');
    });

    it('debería renderizar correctamente el contenedor del mapa dinámico', () => {
        // Validamos que el contenedor del MapSection exista y tenga las clases de dimensiones
        cy.get('.rounded-lg.overflow-hidden.border.border-gray-200').should('exist');
    });

    it('debería listar los estudios por defecto ordenados por cercanía', () => {
        // Validamos que aparezcan estudios clave declarados en la data estática (STUDIOS)
        cy.contains('Ink Starter Studio').should('be.visible');
        cy.contains('San Fernando, Cali').should('be.visible');
        cy.contains('0.4 km').should('be.visible');

        cy.contains('Black House Tattoo').should('be.visible');
        cy.contains('Granada, Cali').should('be.visible');
    });

    it('debería permitir filtrar estudios mediante la barra de búsqueda', () => {
        // Buscamos un estudio específico por su nombre
        cy.get('input[placeholder*="Buscar ciudad, barrio o estudio..."]')
            .type('Fine Line');

        // Debería mostrar la tarjeta correspondiente
        cy.contains('Fine Line Studio').should('be.visible');
        cy.contains('Menga, Cali').should('be.visible');

        // No debería mostrar los estudios que no coincidan
        cy.contains('Ink Starter Studio').should('not.exist');
    </it>

    it('debería permitir cambiar el estado de selección al hacer clic en un estudio', () => {
        // Hacemos clic en la tarjeta de 'Black House Tattoo'
        cy.contains('Black House Tattoo').closest('button').click();

        // Validamos que el botón reciba las clases de estado activo/seleccionado (bg-gray-100)
        cy.contains('Black House Tattoo')
            .closest('button')
            .should('have.class', 'bg-gray-100');
    });

    it('debería mostrar un mensaje controlado si la búsqueda no arroja resultados', () => {
        // Escribimos algo inexistente en el buscador
        cy.get('input[placeholder*="Buscar ciudad, barrio o estudio..."]')
            .type('Estudio Inexistente en Marte');

        // Verificamos que se oculte la lista y aparezca el bloque de vacío
        cy.contains('No se encontraron resultados').should('be.visible');
        cy.contains('Ink Starter Studio').should('not.exist');
    });
});
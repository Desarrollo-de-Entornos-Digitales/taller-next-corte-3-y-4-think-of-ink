describe('Flujo de Navegación al Registro', () => {
    beforeEach(() => {
        // 1. MODIFICADO: Asegúrate de empezar directamente en la ruta del login
        cy.visit('http://localhost:3000/login');
    });

    it('debería navegar a la página de registro al hacer clic en el botón', () => {
        // 2. Busca el enlace en el login con el data-cy que acordamos y hace clic
        cy.get('[data-cy="link-to-register"]').click();

        // 3. Verificaciones (Aserciones):

        // A) MODIFICADO: Tu ruta en Next.js es '/register', no '/registro'
        cy.url().should('include', '/register');

        // B) Verifica que el título con el data-cy que agregamos en el paso anterior sea visible
        cy.get('[data-cy="titulo-registro"]')
            .should('be.visible')
            .and('contain.text', 'Crear cuenta');
    });
});

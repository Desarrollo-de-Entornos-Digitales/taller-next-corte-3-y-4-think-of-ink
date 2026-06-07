describe('Pruebas de la Página de Login', () => {
    beforeEach(() => {
        // Visitamos directamente la página de login antes de cada prueba
        cy.visit('http://localhost:3000/login');
    });

    it('debería iniciar sesión exitosamente con credenciales correctas', () => {
        // 1. Interceptamos la petición POST del backend simulando una respuesta exitosa
        cy.intercept('POST', '**/auth/login*', {
            statusCode: 200,
            body: {
                access_token: 'fake-jwt-token-12345',
            },
        }).as('loginRequest');

        // 2. Diligenciar los campos usando los selectores por tipo
        cy.get('input[type="email"]').type('testuser@gmail.com');
        cy.get('input[type="password"]').type('SecurePassword123');

        // 3. CAMBIO CLAVE: Buscamos el botón nativo directamente por su texto visible en la pantalla
        cy.contains('button', 'Entrar en la red').click();

        // 4. Esperar a que la petición simulada responda
        cy.wait('@loginRequest');

        // 5. Usamos cy.window() como comando padre antes de revisar el localStorage
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token-12345');
        });

        // 6. Verificar que la app intentó redirigir al feed
        cy.url().should('include', '/feed');
    });

    it('debería mostrar un mensaje de error si las credenciales son incorrectas', () => {
        // 1. Interceptamos la petición simulando un error 401 de Backend
        cy.intercept('POST', '**/auth/login*', {
            statusCode: 401,
            body: {
                message: 'Credenciales inválidas. Inténtalo de nuevo.',
            },
        }).as('loginFailedRequest');

        // Preparamos el capturador del alert del navegador
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        // 2. Llenamos datos aleatorios equivocados
        cy.get('input[type="email"]').type('wronguser@gmail.com');
        cy.get('input[type="password"]').type('WrongPassword111');

        // 3. CAMBIO CLAVE: Buscamos el botón por su texto aquí también
        cy.contains('button', 'Entrar en la red').click();

        // 4. Esperamos que actúe el interceptor de red
        cy.wait('@loginFailedRequest');

        // 5. Evaluamos el alert
        cy.window().then(() => {
            expect(alertStub.getCall(0)).to.be.calledWith(
                'Credenciales inválidas. Inténtalo de nuevo.'
            );
        });

        // 6. Usamos cy.window() para verificar que el token siga estando vacío (null)
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
        });
    });

    it('debería permitir navegar hacia la página de registro', () => {
        cy.get('[data-cy="link-to-register"]').click();
        cy.url().should('include', '/register');
    });
});

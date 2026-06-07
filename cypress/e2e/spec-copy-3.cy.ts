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
                access_token: 'fake-jwt-token-12345'
            }
        }).as('loginRequest');

        // 2. Diligenciar los campos usando selectores basados en el atributo nativo 'type'
        cy.get('input[type="email"]').type('testuser@gmail.com');
        cy.get('input[type="password"]').type('SecurePassword123');

        // 3. Hacer clic en el botón de envío
        // Buscamos el botón por su tipo submit o el texto que le definiste en la propiedad
        cy.get('button[type="submit"]').click();

        // 4. Esperar a que la petición simulada responda
        cy.wait('@loginRequest');

        // 5. Verificar que el token se guardó correctamente en el localStorage de la app
        cy.should(() => {
            expect(localStorage.getItem('token')).to.eq('fake-jwt-token-12345');
        });

        // 6. Verificar que la app intentó redirigir al feed
        cy.url().should('include', '/feed');
    });

    it('debería mostrar un mensaje de error si las credenciales son incorrectas', () => {
        // 1. Interceptamos la petición simulando un error 401 de Backend (Unauthorized)
        cy.intercept('POST', '**/auth/login*', {
            statusCode: 401,
            body: {
                message: 'Credenciales inválidas. Inténtalo de nuevo.'
            }
        }).as('loginFailedRequest');

        // Capturamos el alert nativo del navegador
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        // 2. Llenamos datos aleatorios equivocados
        cy.get('input[type="email"]').type('wronguser@gmail.com');
        cy.get('input[type="password"]').type('WrongPassword111');
        
        cy.get('button[type="submit"]').click();

        // 3. Esperar que actúe el interceptor
        cy.wait('@loginFailedRequest');

        // 4. Validar que saltó el alert con el string exacto de tu catch
        cy.then(() => {
            expect(alertStub.getCall(0)).to.be.calledWith('Credenciales inválidas. Inténtalo de nuevo.');
        });
        
        // 5. Garantizar que NO se guardó ningún token tramposo
        cy.should(() => {
            expect(localStorage.getItem('token')).to.be.null;
        });
    });

    it('debería permitir navegar hacia la página de registro', () => {
        // Probamos que tu componente Link de Next.js funcione con el data-cy que ya posee
        cy.get('[data-cy="link-to-register"]').click();
        cy.url().should('include', '/register');
    });
});
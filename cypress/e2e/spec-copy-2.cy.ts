describe('Pruebas del Formulario de Registro', () => {
    beforeEach(() => {
        // Interceptamos la petición POST para simular la respuesta del backend
        cy.intercept('POST', '**/auth/register*', {
            statusCode: 201,
            body: { message: 'Usuario creado con éxito' }
        }).as('registerRequest');

        // Visitamos directamente la página de registro
        cy.visit('http://localhost:3000/register');
    });

    it('debería mostrar el título correcto en la pantalla', () => {
        cy.get('[data-cy="titulo-registro"]')
            .should('be.visible')
            .and('contain.text', 'Crear cuenta');
    });

    it('debería registrar un usuario exitosamente rellenando todos los campos', () => {
        // Usamos el objeto window:alert para capturar los mensajes nativos de tu código
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        // 1. Seleccionar Rol con el nuevo data-cy dinámico
        cy.get('[data-cy="role-user"]').click();

        // 2. Diligenciar el formulario usando los atributos 'name' que agregamos
        cy.get('input[name="fullName"]').type('Carlos Gómez');
        cy.get('input[name="username"]').type('carlosg');
        cy.get('input[name="email"]').type('carlos@example.com');
        cy.get('input[name="password"]').type('SecurePass123');
        cy.get('input[name="confirmPassword"]').type('SecurePass123');
        cy.get('input[name="location"]').type('Cali, Colombia');

        // 3. Aceptar términos con su data-cy único
        cy.get('[data-cy="checkbox-terms"]').check();

        // 4. Enviar el formulario
        cy.get('button[type="submit"]').click();

        // 5. Verificar que Cypress esperó y detectó la llamada al servicio de registro
        cy.wait('@registerRequest');

        // 6. Verificar que apareció el mensaje de éxito en el alert
        cy.then(() => {
            expect(alertStub.getCall(0)).to.be.calledWith('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
        });

        // 7. Asegurar que Next.js redirigió correctamente al Login
        cy.url().should('include', '/login');
    });

    it('debería mostrar un error si las contraseñas no coinciden', () => {
        const alertStub = cy.stub();
        cy.on('window:alert', alertStub);

        cy.get('[data-cy="role-user"]').click();
        cy.get('input[name="fullName"]').type('Carlos Gómez');
        cy.get('input[name="username"]').type('carlosg');
        cy.get('input[name="email"]').type('carlos@example.com');
        
        // Ponemos contraseñas distintas a propósito
        cy.get('input[name="password"]').type('SecurePass123');
        cy.get('input[name="confirmPassword"]').type('Diferente123');
        
        cy.get('input[name="location"]').type('Cali, Colombia');
        cy.get('[data-cy="checkbox-terms"]').check();

        cy.get('button[type="submit"]').click().then(() => {
            // Verifica que saltó tu validación de contraseñas
            expect(alertStub.getCall(0)).to.be.calledWith('Las contraseñas no coinciden');
        });
    });
});
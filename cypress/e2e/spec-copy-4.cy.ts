describe('Pruebas del Módulo de Nueva Publicación', () => {
    
    describe('Acceso Restringido', () => {
        it('debería redirigir a /login si no existe un token de sesión', () => {
            cy.clearLocalStorage();
            cy.visit('http://localhost:3000/feed/new'); 
            
            cy.url().should('include', '/login');
        });
    });

    describe('Flujo de Creación y Formulario', () => {
        beforeEach(() => {
            // Seteamos las credenciales requeridas por el useEffect antes de entrar
            cy.window().then((win) => {
                win.localStorage.setItem('token', 'fake-jwt-token-12345');
                win.localStorage.setItem('username', 'Tatuador Cali');
            });
            cy.visit('http://localhost:3000/feed/new'); 
        });

        it('debería mostrar el nombre de usuario recuperado del localStorage en la vista previa', () => {
            cy.get('p').contains('Tatuador Cali').should('be.visible');
        });

        it('debería permitir crear un post básico de tipo texto de forma exitosa', () => {
            // 1. Interceptamos el servicio de creación de posts
            cy.intercept('POST', '**/posts*', {
                statusCode: 201,
                body: { id: 'post-123', title: 'Nuevo Estilo' }
            }).as('createPostRequest');

            const alertStub = cy.stub();
            cy.on('window:alert', alertStub);

            // 2. Cambiamos el tipo usando el atributo data-type inyectado
            cy.get('button[data-type="Promoción"]').click();

            // 3. Llenamos el formulario utilizando placeholders unicos
            cy.get('input[placeholder="Escribe un título atractivo"]').type('Flash Day este Sábado');
            cy.get('textarea[placeholder="Cuéntales a todos sobre tu publicación..."]').type('Tendremos diseños disponibles desde 100k.');
            
            // Usamos el ID asignado para evitar falsos selectores globales
            cy.get('#post-category').select('Promoción');
            cy.get('input[placeholder="ej. Bogotá, Colombia"]').type('Cali, Colombia');

            // 4. Publicamos con el texto semántico
            cy.contains('button', 'Publicar').click();

            // 5. Validamos los datos enviados al backend
            cy.wait('@createPostRequest').then((interception) => {
                expect(interception.request.body.title).to.eq('Flash Day este Sábado');
                expect(interception.request.body.postType).to.eq('Promoción');
            });

            // 6. Revisamos las llamadas de respuesta del cliente
            cy.window().then(() => {
                expect(alertStub.getCall(0)).to.be.calledWith('Publicación creada con éxito!');
            });
            cy.url().should('include', '/feed');
        });

        it('debería mostrar un alert si se intenta publicar con campos requeridos vacíos', () => {
            const alertStub = cy.stub();
            cy.on('window:alert', alertStub);

            // Intentamos publicar directo con campos vacíos
            cy.contains('button', 'Publicar').click();

            cy.window().then(() => {
                expect(alertStub.getCall(0)).to.be.calledWith('Por favor completa todos los campos requeridos');
            });
        });

        it('debería previsualizar y cargar una imagen correctamente', () => {
            cy.intercept('POST', '**/posts*', { statusCode: 201, body: {} }).as('createPostMultipart');

            cy.get('input[placeholder="Escribe un título atractivo"]').type('Diseño Neo Tradicional');
            cy.get('textarea[placeholder="Cuéntales a todos sobre tu publicación..."]').type('Disponible para la próxima semana.');
            cy.get('#post-category').select('Diseño');

            // Cargamos un archivo simulado directamente sobre el input nativo usando force: true por su opacity-0
            cy.get('input[type="file"]').selectFile({
                contents: Cypress.Buffer.from('imagen-binaria-falsa'),
                fileName: 'tattoo_flash.webp',
                mimeType: 'image/webp',
            }, { force: true });

            // Comprobamos la existencia del preview renderizado en la UI
            cy.get('img[alt="Preview"]').should('be.visible');

            cy.contains('button', 'Publicar').click();
            cy.wait('@createPostMultipart');
        });

        it('debería rechazar archivos que tengan formatos no permitidos', () => {
            // Subimos un archivo plano no admitido por ALLOWED_TYPES (.txt)
            cy.get('input[type="file"]').selectFile({
                contents: Cypress.Buffer.from('document-content'),
                fileName: 'sketch.txt',
                mimeType: 'text/plain',
            }, { force: true });

            // Evaluamos el contenedor dinámico del error generado
            cy.get('div.bg-red-50').should('be.visible')
              .and('contain', 'Formato no válido. Solo se aceptan JPG, PNG y WebP.');
        });
    });
});
const puppeteer = require('puppeteer');

async function voteBot() {
    try {
        // Iniciar el navegador en modo headless
        const browser = await puppeteer.launch({
            headless: 'new', // Usar el nuevo modo headless
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        while (true) { // Bucle infinito
            try {
                console.log('Iniciando nueva votación...');
                
                // Abrir nueva página
                const page = await browser.newPage();
                
                // Ir a la página de votación
                console.log('Navegando a la página de votación...');
                await page.goto('https://poll.fm/15690408', {
                    waitUntil: 'networkidle0'
                });

                // Esperar a que el radio button esté disponible y hacer clic
                console.log('Buscando la opción para votar...');
                await page.waitForSelector('input[type="radio"]');
                
                // Encontrar y hacer clic en la opción correcta
                const radioButtons = await page.$$('input[type="radio"]');
                const labels = await page.$$('label');
                
                let encontrado = false;
                for (let i = 0; i < labels.length; i++) {
                    const labelText = await labels[i].evaluate(node => node.textContent);
                    if (labelText.includes('Sofia Pepper, Amarillo High girls soccer')) {
                        await radioButtons[i].click();
                        encontrado = true;
                        console.log('Opción encontrada y seleccionada');
                        break;
                    }
                }

                if (!encontrado) {
                    throw new Error('No se encontró la opción para votar');
                }

                // Encontrar y hacer clic en el botón de votar
                console.log('Enviando el voto...');
                await page.waitForSelector('button[type="submit"]');
                await page.click('button[type="submit"]');

                // Esperar un momento para que se registre el voto
                await page.waitForTimeout(2000);

                // Cerrar la página
                await page.close();

                console.log('Voto completado exitosamente');
                console.log('Esperando 30 segundos antes del próximo voto...');
                
                // Esperar 30 segundos antes de la próxima votación
                await new Promise(resolve => setTimeout(resolve, 30000));
                
            } catch (error) {
                console.error('Error durante la votación:', error);
                // Si hay un error, esperar 5 segundos antes de intentar de nuevo
                console.log('Esperando 5 segundos antes de reintentar...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } catch (error) {
        console.error('Error fatal:', error);
    }
}

// Iniciar el bot
console.log('Iniciando el bot de votación...');
voteBot().catch(console.error);

let zPos = 0;
const sensibilidad = 8; // Aumenté un poco la velocidad para que el viaje sea más fluido

function actualizarZoom(delta) {
    zPos += delta * sensibilidad; 
    
    const escenario = document.getElementById('escenario');
    // Usamos translateZ para mover el escenario
    escenario.style.transform = `translateZ(${zPos}px)`;

    const capas = document.querySelectorAll('.capa');
    capas.forEach(capa => {
        const depth = parseFloat(capa.style.getPropertyValue('--depth'));
        const posicionZPalabra = depth * 6000; // Mantén la distancia de 4000px
        const distancia = zPos - posicionZPalabra;

        // --- NUEVA LÓGICA DE GIGANTISMO Y OPACIDAD ---
        
        // 1. Si la palabra ya pasó muy lejos detrás de nosotros (hacia la espalda) -> BORRAR TOTAL
        if (distancia > 1500) { 
            capa.style.opacity = "0";
            capa.style.visibility = "hidden";
        } 
        // 2. Si la palabra está en la zona de "Atravesar" (entre 0px y 1500px) -> SE HACE GIGANTE Y SE DESVANECE
        else if (distancia > 0) {
            // Mientras más grande es la distancia, menor es la opacidad (va de 1 a 0)
            const nuevaOpacidad = 1 - (distancia / 1500); 
            capa.style.opacity = nuevaOpacidad.toString();
            capa.style.visibility = "visible";
        }
        // 3. Si la palabra está muy lejos en el fondo (todavía no llegamos a ella) -> OPACIDAD BAJA
        else if (distancia < -3000) {
            capa.style.opacity = "0.1"; // Evita el muro de letras al fondo
            capa.style.visibility = "visible";
        }
        // 4. Si la palabra está en su zona normal de visión (se acerca) -> SE VE PERFECTO
        else {
            capa.style.opacity = "1";
            capa.style.visibility = "visible";
        }
    });
}

// Eventos (Mouse y Touch con multiplicadores)
window.addEventListener('wheel', (e) => {
    actualizarZoom(e.deltaY * 3); 
    e.preventDefault();
}, { passive: false });

let ts;
window.addEventListener('touchstart', (e) => { 
    ts = e.touches[0].clientY; 
});

window.addEventListener('touchmove', (e) => {
    let te = e.touches[0].clientY;
    actualizarZoom((ts - te) * 20); // Multiplicador fuerte para el touch
    ts = te;
}, { passive: false });
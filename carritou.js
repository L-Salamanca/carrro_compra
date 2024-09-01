document.addEventListener('DOMContentLoaded', function () {
    let carrito = [];

    function actualizarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    function añadirAlCarrito(event) {
        const productoElement = event.target.closest('.producto');
        const nombreProducto = productoElement.querySelector('.nombre-producto').textContent;
        const precioProducto = parseFloat(productoElement.querySelector('.precio').textContent.replace('$', '').replace(',', ''));

        const productoExistente = carrito.find(item => item.nombre === nombreProducto);
        if (productoExistente) {
            productoExistente.cantidad += 1;
            productoExistente.precioTotal += precioProducto;
        } else {
            const producto = {
                nombre: nombreProducto,
                precioUnitario: precioProducto,
                cantidad: 1,
                precioTotal: precioProducto
            };
            carrito.push(producto);
        }
        actualizarCarrito();
    }

    function incrementarCantidad(nombreProducto) {
        const producto = carrito.find(item => item.nombre === nombreProducto);
        if (producto) {
            producto.cantidad += 1;
            producto.precioTotal += producto.precioUnitario;
            actualizarCarrito();
        }
    }

    function decrementarCantidad(nombreProducto) {
        const producto = carrito.find(item => item.nombre === nombreProducto);
        if (producto && producto.cantidad > 1) {
            producto.cantidad -= 1;
            producto.precioTotal -= producto.precioUnitario;
            actualizarCarrito();
        } else if (producto && producto.cantidad === 1) {
            carrito = carrito.filter(item => item.nombre !== nombreProducto);
            actualizarCarrito();
        }
    }

    function renderizarCarrito() {
        const carritoSeccion = document.querySelector('#carrito-seccion');
        carritoSeccion.innerHTML = ''; // Limpiar contenido previo

        if (carrito.length === 0) {
            carritoSeccion.innerHTML = '<p>El carrito está vacío.</p>';
            return;
        }

        let totalFinal = 0;
        carrito.forEach(producto => {
            const productoElemento = document.createElement('div');
            productoElemento.classList.add('producto-carrito');
            productoElemento.innerHTML = `
                <span>${producto.nombre}</span>
                <div class="cantidad-controles">
                    <button class="boton-restar">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="boton-sumar">+</button>
                </div>
                <span>Precio Unitario: $${producto.precioUnitario.toFixed(2)}</span>
                <span>Precio Total: $${producto.precioTotal.toFixed(2)}</span>
            `;
            carritoSeccion.appendChild(productoElemento);

            // Eventos para los botones de suma y resta
            productoElemento.querySelector('.boton-sumar').addEventListener('click', () => incrementarCantidad(producto.nombre));
            productoElemento.querySelector('.boton-restar').addEventListener('click', () => decrementarCantidad(producto.nombre));

            totalFinal += producto.precioTotal;
        });

        const totalElemento = document.createElement('div');
        totalElemento.classList.add('total-carrito');
        totalElemento.innerHTML = `<strong>Total a Pagar: $${totalFinal.toFixed(2)}</strong>`;
        carritoSeccion.appendChild(totalElemento);

        // Botón para reiniciar el carrito
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reiniciar Carrito';
        resetButton.classList.add('boton-reset');
        resetButton.addEventListener('click', reiniciarCarrito);
        carritoSeccion.appendChild(resetButton);
    }

    function mostrarCarrito() {
        const carritoContainer = document.querySelector('#carrito-container');
        carritoContainer.style.display = carritoContainer.style.display === 'none' ? 'block' : 'none';
        carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        renderizarCarrito();
    }

    function reiniciarCarrito() {
        carrito = [];
        actualizarCarrito();
        document.querySelector('#carrito-container').style.display = 'none';
    }

    document.querySelectorAll('.boton-carrito').forEach(boton => {
        boton.addEventListener('click', añadirAlCarrito);
    });

    document.querySelector('.carritico').addEventListener('click', mostrarCarrito);
});

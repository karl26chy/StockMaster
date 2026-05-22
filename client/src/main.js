import './styles/globals.css';

import {
  traerProductos,
  crearProducto,
  eliminarProducto,
  actualizarProducto
} from './service/product.service';

const formulario = document.getElementById("product-form");
const buscador = document.getElementById("buscador");

let idEditar = null; 
let todosLosProductos = []; 

// FORMULARIO: Crear o Actualizar
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    stock: Number(document.getElementById("stock").value),
    descripcion: document.getElementById("descripcion").value
  };

  if (idEditar !== null) {
    await actualizarProducto(idEditar, producto);
    idEditar = null; 
  } else {
    await crearProducto(producto);
  }

  formulario.reset(); 
  buscador.value = ""; 
  
  // Actualizamos la lista global y refrescamos la pantalla
  todosLosProductos = await traerProductos();
  imprimirProductos(todosLosProductos);
});


// FUNCIÓN PARA LAS TARJETAS ESTADÍSTICAS
function actualizarTarjetas(listaProductos) {
  let totalProductos = listaProductos.length;
  let valorTotal = 0;
  let stockCritico = 0;

  for (const producto of listaProductos) {
    valorTotal = valorTotal + (producto.precio * producto.stock);
    if (producto.stock < 5) {
      stockCritico = stockCritico + 1;
    }
  }

  document.getElementById("stat-total").textContent = totalProductos;
  document.getElementById("stat-value").textContent = "COP " + valorTotal;
  document.getElementById("stat-low").textContent = stockCritico;
}

// FUNCIÓN PARA IMPRIMIR LOS PRODUCTOS EN LA TABLA
function imprimirProductos(listaProductos){
  actualizarTarjetas(listaProductos);

  const tbody = document.getElementById("inventory-list");
  tbody.innerHTML = '';
  
  const listaInvertida = [...listaProductos].reverse();

  for (const producto of listaInvertida) {
    
    // 1. Color verde por defecto
    let colorStock = "bg-emerald-50 text-emerald-600 border-emerald-100";

    // 2. Si el stock es menor a 5, cambiamos a rojo
    if (producto.stock < 5) {
      colorStock = "bg-rose-50 text-rose-600 border-rose-100";
    }

    tbody.innerHTML += `
      <tr class="hover:bg-slate-50/30 transition-colors group">
        <td class="px-8 py-6">
          <div class="flex flex-col">
            <span class="font-bold text-slate-900">${producto.nombre}</span>
            <span class="text-xs text-slate-400 mt-1 line-clamp-1 max-w-[300px]">${producto.descripcion}</span>
          </div>
        </td>
        <td class="px-8 py-6 text-center">
          <!-- 3. Insertamos nuestra variable de color -->
          <span class="px-4 py-1.5 ${colorStock} rounded-xl text-[10px] font-black uppercase tracking-tight border">${producto.stock} unidades</span>
        </td>
        <td class="px-8 py-6 text-center font-bold text-slate-900">COP ${producto.precio}</td>
        <td class="px-8 py-6 text-right">
          <div class="flex justify-end gap-3">
            <button data-id="${producto.id}" class="btn-editar w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button data-id="${producto.id}" class="btn-eliminar w-10 h-10 flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>`;
  }

  // EVENTOS PARA ELIMINAR
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      await eliminarProducto(id);
      
      buscador.value = ""; 
      todosLosProductos = await traerProductos();
      imprimirProductos(todosLosProductos);
    });
  });

  // EVENTOS PARA EDITAR
  const botonesEditar = document.querySelectorAll(".btn-editar");
  botonesEditar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.id;
      idEditar = id; 

      const productoSeleccionado = listaProductos.find(producto => producto.id === id);

      document.getElementById("nombre").value = productoSeleccionado.nombre;
      document.getElementById("precio").value = productoSeleccionado.precio;
      document.getElementById("stock").value = productoSeleccionado.stock;
      document.getElementById("descripcion").value = productoSeleccionado.descripcion;
    });
  });
}

// EL BUSCADOR
buscador.addEventListener("input", (e) => {
  const textoEscrito = e.target.value.toLowerCase();

  const productosFiltrados = todosLosProductos.filter((producto) => {
    return producto.nombre.toLowerCase().includes(textoEscrito);
  });

  imprimirProductos(productosFiltrados);
});

// Carga inicial al abrir la página
document.addEventListener("DOMContentLoaded", async () => {
  todosLosProductos = await traerProductos();
  imprimirProductos(todosLosProductos); 
});
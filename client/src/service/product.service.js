


const endpoint = "http://localhost:3000/productos";



export async function traerProductos() {
  try {

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Error obteniendo productos");
    }

    return await response.json();

  } catch (error) {

    console.error(error);

  }
}


// CREAR PRODUCTO
export async function crearProducto(producto) {

  try {

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });

    if (!response.ok) {
      throw new Error("Error creando producto");
    }

    return await response.json();

  } catch (error) {

    console.error(error);

  }
}



// ELIMINAR PRODUCTO
export async function eliminarProducto(id) {

  try {

    await fetch(`${endpoint}/${id}`, {
      method: "DELETE"
    });

  } catch (error) {

    console.error(error);

  }
}


// ACTUALIZAR PRODUCTO
export async function actualizarProducto(id, producto) {

  try {

    const response = await fetch(`${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });

    return await response.json();

  } catch (error) {

    console.error(error);

  }
}

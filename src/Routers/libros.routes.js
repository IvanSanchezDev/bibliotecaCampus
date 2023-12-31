import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlwares/jwt.js";

const libroRouter = Router();

libroRouter.get("/getEstadoLibros", async (req, res) => {
  try {
    const con = await getConnection();
    const [result] = await con.execute("SELECT libro.titulo AS libro,estado_libro.nombre AS estado,estado_libro.descripcion FROM libro INNER JOIN estado_libro ON libro.id_estado=estado_libro.id_estado");
    if (result.length === 0) {
      return res.status(204).send(`No hay libro`);
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message)
  }
});


libroRouter.get("/getLibrosAutorEditorial", async (req, res) => {
    try {
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo, autor.nombre AS autor, editorial.nombre as editorial FROM libro INNER JOIN autor ON libro.id_autor=autor.id_autor INNER JOIN editorial ON libro.id_editorial=editorial.id_editorial");
      if (result.length === 0) {
        return res.status(204).send(`No hay libros`);
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });

  libroRouter.get("/getLibrosDisponibles", async (req, res) => {
    try {
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo, autor.nombre FROM `libro` INNER JOIN estado_libro ON libro.id_estado=estado_libro.id_estado INNER JOIN autor ON libro.id_autor=autor.id_autor WHERE estado_libro.nombre='Disponible';");
      if (result.length === 0) {
        return res.status(204).send(`No hay libros Disponibles`);
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });



  libroRouter.get("/getLibrosPrestados", async (req, res) => {
    try {
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo, prestamo.fecha_devolucion FROM libro INNER JOIN prestamo ON libro.id_libro=prestamo.id_libro WHERE prestamo.estado='Prestado'");
      if (result.length === 0) {
        return res.status(204).send(`No hay libros Prestados`);
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });

  libroRouter.get("/getLibrosAutorEspecifico/:nombreAutor", async (req, res) => {
    try {
        const { nombreAutor }=req.params
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo FROM `libro` INNER JOIN autor ON libro.id_autor=autor.id_autor WHERE autor.nombre=?", [nombreAutor]);
      if (result.length === 0) {
        return res.status(204).send(`No hay libros del autor ${nombreAutor}`);
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });

  libroRouter.get("/getLibrosCategoria/:categoria", async (req, res) => {
    try {
        const { categoria }=req.params
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo AS libro, categoria.nombre AS categoria FROM libro INNER JOIn categoria ON libro.id_categoria=categoria.id_categoria WHERE categoria.nombre=?", [categoria]);
      if (result.length === 0) {
        return res.status(204).json({message:`No hay libros de la categoria ${categoria}`});
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });

  libroRouter.get("/getLibrosMayoresPagina",verifyToken, async (req, res) => {
    try {
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo AS libro, autor.nombre AS autor FROM `libro` INNER JOIN autor ON libro.id_autor=autor.id_autor WHERE num_paginas>500;");
      if (result.length === 0) {
        return res.status(204).send(`No hay libros de mas de 500 paginas`);
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });

  libroRouter.get("/getLibrosPrestadosUsuarioEspecifico",verifyToken, async (req, res) => {
    try {
      const { nombreApellido }=req.query
      const con = await getConnection();
      const [result] = await con.execute("SELECT libro.titulo FROM libro INNER JOIN prestamo ON libro.id_libro = prestamo.id_libro INNER JOIN usuario ON prestamo.id_usuario=usuario.id_usuario WHERE concat(usuario.nombre, ' ', usuario.apellido)=?;", [nombreApellido]);
      if (result.length === 0) {
        return res.status(204).send(`No hay libros prestado al usuario ${nombreApellido}`);
      }
      res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message)
    }
  });
  



export default libroRouter;

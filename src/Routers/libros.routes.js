import { Router } from "express";
import getConnection from "../db/database.js";

const libroRouter = Router();

libroRouter.get("/getEstadoLibros", async (req, res) => {
  try {
    const con = await getConnection();
    const [result] = await con.execute("SELECT libro.titulo AS libro,estado_libro.nombre AS estado,estado_libro.descripcion FROM libro INNER JOIN estado_libro ON libro.id_estado=estado_libro.id_estado");
    if (result.length === 0) {
      return res.status(204).send(`No hay libro`);
    }
    res.status(200).send(result);
  } catch (error) {}
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


export default libroRouter;
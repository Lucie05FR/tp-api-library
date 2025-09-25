import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import { AuthorController } from "../controllers/author.controller";
import { AuthorService } from "./author.service";
import { CustomError } from "../middlewares/errorHandler";
import e from "express";

export class BookService {

  public authorService = new AuthorService();

  public async getAllBooks(): Promise<Book[]> {
    return Book.findAll({
      include: [{
        model: Author,
        as: 'author'
      }]
    });
  }

  public async getBookById(id: number): Promise<Book | null> {
    return Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: 'author',
        },
      ],
    });
  }

  // Crée un nouveau livre
  public async createBook(
    title: string,
    publishYear: number,
    authorId: number,
    isbn: string
  ): Promise<Book> {
    let author: Author | null = await this.authorService.getAuthorById(authorId);
    if (author === null) {
      let error: CustomError = new Error(`Author ${authorId} not found`);
      error.status = 404;
      throw error;
    }
    return Book.create({ title, publishYear, authorId, isbn });
  }

  // Met à jour un livre
  public async updateBook(
    id: number, 
    title: string, 
    publishYear: number, 
    authorId: number, 
    isbn: string
  ): Promise<Book> {
    let book = await this.getBookById(id);
    if (book === null) {
      // Cette erreur pourrait être levée directement dans le contrôleur pour garder une cohérence de code
      // Possibilité de gérer les erreurs dans le contrôleur ou le service selon les choix de développement
      let error: CustomError = new Error(`Book ${id} not found`);
      error.status = 404;
      throw error;
    } else {
      if (authorId !== undefined) {
        let author = await this.authorService.getAuthorById(authorId);
        if (author === null) {
          let error: CustomError = new Error(`Author ${authorId} not found`);
          error.status = 404;
          throw error;
        }
      }

      if (title !== undefined) {
        book.title = title;
      }

      if (publishYear !== undefined) {
        book.publishYear = publishYear;
      }

      if (isbn !== undefined) {
        book.isbn = isbn;
      }
      await book.save();
      return book;
    }
  }
}

export const bookService = new BookService();

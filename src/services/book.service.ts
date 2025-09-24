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
  // public async updateBook(
  //   title: string,
  //   publishYear: number,
  //   authorId: number,
  //   isbn: string
  // ): Promise<Book | null> {
  //   const book = await Book.findByPk(id);
  //   if (author) {
  //     if (firstName) author.firstName = firstName;
  //     if (lastName) author.lastName = lastName;
  //     await book.save();
  //     return book;
  //   }
  //   return null;
  // }
}

export const bookService = new BookService();

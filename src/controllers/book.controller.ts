import { Controller, Get, Post, Body, Route, Tags, Path, Patch, Delete } from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { CustomError } from "../middlewares/errorHandler";
import { Book } from "../models/book.model";
import { toDto } from "../mapper/book.mapper";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  public async getAllBooks(): Promise<BookDTO[]> {
    return bookService.getAllBooks();
  }

  // Récupère un livre par ID
  @Get("{id}")
  public async getBoodById(id: number): Promise<BookDTO> {
    let book: Book | null = await bookService.getBookById(id);

    if (book === null) {
      let error: CustomError = new Error(`Book ${id} not found`);
      error.status = 404;
      throw error;
    }

    return toDto(book);
  }

  // Crée un nouveau livre
  @Post("/")
  public async createBook(@Body() requestBody: BookDTO): Promise<BookDTO> {
    let { title, publishYear, author, isbn } = requestBody;

    if (author?.id === undefined) {
      let error: CustomError = new Error("Author ID is required to create a book");
      error.status = 400;
      throw error;
    }
    return bookService.createBook(title, publishYear, author?.id, isbn)
  }

  // Met à jour un livre par ID
  @Patch("{id}")
  public async updateBook(
    @Path() id: number,
    @Body() requestBody: BookDTO
  ): Promise<BookDTO> {
    let { title, publishYear, author, isbn } = requestBody;

    if (author?.id === undefined) {
      let error: CustomError = new Error("Author ID is required to update a book");
      error.status = 400;
      throw error;
    }

    return bookService.updateBook(id, title, publishYear, author?.id, isbn);
  }

  // Supprime un livre par ID
  @Delete("{id}")
  public async deleteBook(@Path() id: number): Promise<void> {
    let hasCopy = await bookService.hasBookCopy(id)
    if (!hasCopy) {
      await bookService.deleteBook(id);
    }
  }
}
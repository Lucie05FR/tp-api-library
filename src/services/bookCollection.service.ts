import { CustomError } from "../middlewares/errorHandler";
import { Book } from "../models/book.model";
import { BookCopy } from "../models/bookCopy.model";
import { BookService } from "./book.service";

export class BookCopyService {

    public bookService = new BookService();

    public async getAllBooksCopy(): Promise<BookCopy[]> {
        return BookCopy.findAll({
            include: [{
                model: Book,
                as: 'book'
            }]
        });
    }

    public async getBookCopyById(id: number): Promise<BookCopy | null> {
        return BookCopy.findByPk(id, {
            include: [
                {
                    model: Book,
                    as: 'book',
                },
            ],
        });
    }

    // Crée un nouveau livre
    public async createBookCopy(
        available: number,
        state: number,
        bookId: number
    ): Promise<BookCopy> {
        let book: Book | null = await this.bookService.getBookById(bookId)
        if (book === null) {
            let error: CustomError = new Error(`Book ${bookId} not found`);
            error.status = 404;
            throw error;
        }
        return BookCopy.create({ available, state, bookId });
    }

    // Met à jour un livre
    public async updateBookCopy(
        id: number,
        available: number,
        state: number,
        bookId: number
    ): Promise<BookCopy> {
        let bookCopy = await this.getBookCopyById(id);
        if (bookCopy === null) {
            // Cette erreur pourrait être levée directement dans le contrôleur pour garder une cohérence de code
            // Possibilité de gérer les erreurs dans le contrôleur ou le service selon les choix de développement
            let error: CustomError = new Error(`Book copy ${id} not found`);
            error.status = 404;
            throw error;
        } else {
            if (bookId !== undefined) {
                let book = await this.bookService.getBookById(bookId);
                if (book === null) {
                    let error: CustomError = new Error(`Book ${bookId} not found`);
                    error.status = 404;
                    throw error;
                }
            }

            if (available !== undefined) {
                bookCopy.available = available;
            }

            if (state !== undefined) {
                bookCopy.state = state;
            }

            await bookCopy.save();
            return bookCopy;
        }
    }
}

export const bookCopyService = new BookCopyService();
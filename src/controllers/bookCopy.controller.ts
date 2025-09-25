import { Controller, Route, Tags, Get, Post, Body, Patch, Path } from "tsoa";
import { BookCopyDTO } from "../dto/bookCopy.dto";
import { bookCopyService } from "../services/bookCollection.service";
import { BookCopy } from "../models/bookCopy.model";
import { CustomError } from "../middlewares/errorHandler";

@Route("bookCopys")
@Tags("BookCopys")
export class BookCopyController extends Controller {

    @Get("/")
    public async getAllBooksCopy(): Promise<BookCopyDTO[]> {
        return bookCopyService.getAllBooksCopy();
    }

    // Récupère un livre par ID
    @Get("{id}")
    public async getBookCopyById(id: number): Promise<BookCopyDTO> {
        let bookCopy: BookCopy | null = await bookCopyService.getBookCopyById(id);

        if (bookCopy === null) {
            let error: CustomError = new Error(`Book copy ${id} not found`);
            error.status = 404;
            throw error;
        }

        return bookCopy;
    }

    // Crée un nouveau livre
    @Post("/")
    public async createBookCopy(@Body() requestBody: BookCopyDTO): Promise<BookCopyDTO> {
        let { available, state, book } = requestBody;

        if (book?.id === undefined) {
            let error: CustomError = new Error("Book ID is required to create a book copy");
            error.status = 400;
            throw error;
        }
        return bookCopyService.createBookCopy(available, state, book?.id);
    }

    // Met à jour un livre par ID
    @Patch("{id}")
    public async updateBookCopy(
        @Path() id: number,
        @Body() requestBody: BookCopyDTO
    ): Promise<BookCopyDTO> {
        let { available, state, book } = requestBody;

        if (book?.id === undefined) {
            let error: CustomError = new Error("Book ID is required to update a book copy");
            error.status = 400;
            throw error;
        }

        return bookCopyService.updateBookCopy(id, available, state, book?.id);
    }
}

import { PagedResultDto, ListService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookDto, BookService, bookTypeOptions } from '@proxy/books';
// added this line
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';



@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService,
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter } // add this line
  ]
})
export class BookComponent implements OnInit {

  book = { items: [], totalCount: 0 } as PagedResultDto<BookDto>;
  isModalOpen = false; // add this line
  form: FormGroup; // add this line
  // add bookTypes as a list of BookType enum members
  bookTypes = bookTypeOptions;
  selectedBook = {} as BookDto; // declare selectedBook




  constructor(
    public readonly list: ListService,
    private bookService: BookService,
    private fb: FormBuilder, // inject FormBuilder
    private confirmation: ConfirmationService // inject the ConfirmationService
  ) {}

  ngOnInit() {
    const bookStreamCreator = (query) => this.bookService.getList(query);

    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }

  // add new method
  createBook() {
    this.buildForm(); // add this line
    this.form.reset();
    this.isModalOpen = true;
  }

  // Add editBook method
  editBook(id: string) {
    this.bookService.get(id).subscribe((book) => {
      this.selectedBook = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedBook.name || '', Validators.required],
      type: [this.selectedBook.type || null, Validators.required],
      publishDate: [
        this.selectedBook.publishDate ? new Date(this.selectedBook.publishDate) : null,
        Validators.required,
      ],
      price: [this.selectedBook.price || null, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedBook.id
      ? this.bookService.update(this.selectedBook.id, this.form.value)
      : this.bookService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  // Add a delete method
  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.bookService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

}

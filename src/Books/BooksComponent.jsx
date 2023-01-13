import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { BooksPresenter } from './BooksPresenter'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { AddBooksComponent } from './AddBooks/AddBooksComponent'
import { BookListComponent } from './BooksList/BookListComponent'
import { LastAddedBookComponent } from './LastAddedBookComponent'


export const BooksComp = observer((props) => {
    return (
      <>
        <h1>Books</h1>
        <LastAddedBookComponent lastAddedBook={props.presenter.lastAddedBook} />
        <br/>
        <AddBooksComponent presenter={props.presenter} />
        <br/>
        <BookListComponent />
        <br/>
        {/* {props.presenter.viewModel} */}
        <MessagesComponent />
      </>
    )
  })


  export const BooksComponent = withInjection({ presenter: BooksPresenter })(BooksComp)

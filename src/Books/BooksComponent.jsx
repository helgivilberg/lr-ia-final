import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { BooksPresenter } from './BooksPresenter'


export const BooksComp = observer((props) => {
    return (
      <>
        <h1>Books</h1>
        {props.presenter.viewModel}
      </>
    )
  })


  export const BooksComponent = withInjection({ presenter: BooksPresenter })(BooksComp)

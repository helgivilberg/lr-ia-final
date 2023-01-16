import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorListComponent } from './AuthorList/AuthorListComponent'
import { AddAuthorComponent } from './AddAuthor/AddAuthorComponent'
import { AddBooksComponent } from '../Books/AddBooks/AddBooksComponent'
import { BookListComponent } from '../Books/BookList/BookListComponent'
import { AuthorsPresenter } from './AuthorsPresenter'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { useValidation } from '../Core/Providers/Validation'

export const AuthorsComp = observer(props => {
    console.log("AuthorsComp: ", props)
    const [, updateClientValidationMessages] = useValidation()
    let formValid = () => {
        let clientValidationMessages = []
        if (props.presenter.newAuthorName === '') {
            clientValidationMessages.push('No author name')
        }

        // if (props.presenter.newBookName === '') clientValidationMessages.push('No author name')



        updateClientValidationMessages(clientValidationMessages)
        return clientValidationMessages.length === 0
    }

    React.useEffect(() => {
        props.presenter.load()
    }, [])

    return (
        <>
            <h1>AUTHORS</h1>
            <input value="show author list" type="button" onClick={props.presenter.toggleShowBooks} />
            <br />
            <AuthorListComponent />
            <br />
            <AddAuthorComponent formValid={formValid} /* why is form valid outside this component? */ />
            <br />
            <AddBooksComponent presenter={props.presenter} />
            <br />
            <BookListComponent />
            <br />
            <MessagesComponent />
        </>
    )
})

export const AuthorsComponent = withInjection({ presenter: AuthorsPresenter })(AuthorsComp)

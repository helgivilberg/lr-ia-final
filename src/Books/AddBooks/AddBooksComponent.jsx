import * as React from 'react'
import { observer } from 'mobx-react'
import { useValidation } from '../../Core/Providers/Validation'

export const AddBooksComponent = observer(props => {
    const [, updateClientValidationMessages] = useValidation()

    let formValid = () => {
        let clientValidationMessages = []
        if (props.presenter.bookName === '') {
            clientValidationMessages.push('No book name')
        }
        updateClientValidationMessages(clientValidationMessages)

        return clientValidationMessages.length === 0
    }

    return (
        <div>
            <form
                className="Login"
                onSubmit={event => {
                    event.preventDefault()
                    if (formValid()) {
                        props.presenter.addBook()
                    }
                }}
            >
                <label>
                    <input
                        type="text"
                        value={props.presenter.newBookName}
                        placeholder="Enter book name"
                        onChange={event => {
                            console.log("on change")
                            props.presenter.newBookName = event.target.value
                        }}
                    />
                    <input type="submit" value="Add Book" />
                </label>
            </form>
        </div>
    )
})

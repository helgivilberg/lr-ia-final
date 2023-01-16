import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection  } from '../../Core/Providers/Injection'
import { AuthorsPresenter } from '../AuthorsPresenter'
import { useValidation } from '../../Core/Providers/Validation'


export const AddAuthorComp = observer((props) => {
    const { presenter, formValid } = props;
    // const [, updateClientValidationMessages] = useValidation()

    // let formValid = () => {
    //     let clientValidationMessages = []
    //     if (props.presenter.newAuthorName === '') {
    //         clientValidationMessages.push('No author name')
    //     }
    //     updateClientValidationMessages(clientValidationMessages)

    //     return clientValidationMessages.length === 0
    // }


    return (
        <>
        <form onSubmit={event => {
                    event.preventDefault()
                    console.log("props.presenter.newAuthorName", props.presenter.newAuthorName)
                    if (formValid()) {
                        presenter.addAuthorAndBooks()
                    }
                    console.log("props.presenter.newAuthorName", props.presenter.newAuthorName)
                }}>
        <input type="text" value={presenter.newAuthorName} onChange={(e) => {
            console.log("foo")
            presenter.newAuthorName = e.currentTarget.value
            console.log("bar")
        }

            } />
        <button>Add Author and Books</button>
                </form>
        </>
    )
})

export const AddAuthorComponent = withInjection({ presenter: AuthorsPresenter })(AddAuthorComp)
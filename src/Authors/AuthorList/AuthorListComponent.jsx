import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection  } from '../../Core/Providers/Injection'
import { AuthorsPresenter } from '../AuthorsPresenter'


export const AuthorListComp = observer((props) => {
    console.log("AuthorsList", props.presenter.authors)
    return (
        <>
        {props.presenter.authors.map((author, i) => {
            return <div key={i}>{author.displayName}</div>
        })}
        </>
    )
})

export const AuthorListComponent = withInjection({ presenter: AuthorsPresenter })(AuthorListComp)
import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection  } from '../../Core/Providers/Injection'
import { AuthorsPresenter } from '../AuthorsPresenter'


export const AuthorListComp = observer((props) => {
    const { presenter } = props

    return (
        <>
        {presenter.showList &&
            presenter.authors.map((author, i) => {
            return <div key={i}>{author.displayName}</div>
        })}
       </>
    )
})

export const AuthorListComponent = withInjection({ presenter: AuthorsPresenter })(AuthorListComp)
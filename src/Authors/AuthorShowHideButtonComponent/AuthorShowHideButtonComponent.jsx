import * as React from 'react'
import { observer } from 'mobx-react'

export const AuthorShowHideButtonComponent = observer(props => {
    return (
        <>
            <button type="button" onClick={props.toggle}>
                {props.value === false ? <>show author list</> : <>hide author list</>}
            </button>
        </>
    )
})

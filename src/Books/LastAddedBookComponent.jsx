import * as React from 'react'
import { observer } from 'mobx-react'

export const LastAddedBookComponent = observer((props) => {
  return (
    <>
      <p>Last Added Book : {props.lastAddedBook && props.lastAddedBook.visibleName}</p>
    </>
  )
})
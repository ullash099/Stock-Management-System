import React from 'react'
import { Button } from 'react-bootstrap'

export default function BtnSaving(props) {
    return (
        <Button variant={props.variant} disabled className="float-end">
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            {props.text}
        </Button>
    )
}

import React from 'react'

export default function AlertMsg(props) {

    const [cssClass,setCssClass] = React.useState();
    React.useEffect(() => {
        if(props.type == 'primary'){
            setCssClass('alert alert-primary alert-dismissible bg-primary text-white border-0 fade show')
        }
        else if(props.type == 'secondary'){
            setCssClass('alert alert-secondary alert-dismissible bg-secondary text-white border-0 fade show')
        }
        else if(props.type == 'warning'){
            setCssClass('alert alert-warning alert-dismissible bg-warning text-white border-0 fade show')
        }
        else if(props.type == 'success'){
            setCssClass('alert alert-success alert-dismissible bg-success text-white border-0 fade show')
        }
    }, [props]);
    return (
        <React.Fragment>
            {
                props.msg || props.heading ?
                (
                    <div role="alert" className={cssClass}>
                        {
                            props.close ? 
                            (
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            ):(``)
                        }
                        {
                            props.strongMsg ?
                            (
                                <strong>{props.strongMsg} </strong>
                            ):(``)
                        }
                        {
                            props.heading ?
                            (
                                <h4>{props.heading} </h4>
                            ):(``)
                        }
                        {
                            props.msg ?
                            (
                                <React.Fragment>{props.msg}</React.Fragment>
                            ):(``)
                        }
                    </div>
                ):(``)
            }
        </React.Fragment>
    )
}

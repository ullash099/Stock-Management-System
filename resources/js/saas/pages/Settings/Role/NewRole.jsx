import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { AppUrl } from '../../../Context'

export default function NewRole(props) {
    const [manus,setManus] = React.useState([])
    const [data,setData] = React.useState({
        id : ``,
        name : ``,
        name_l : ``,
    })

    const handelGetStartUpData = async (id = null) => {
        let url = id ? AppUrl(`/secure/settinsg/role/`+id) : AppUrl(`/secure/settinsg/role/`);
        await axios.get(url)
        .then(response=>{
            let info = response.data;
            setManus(info.menus)            
            if (info) {
                setData({
                    ...data,
                    id : info.id,
                    name : info.name,
                    name_l : info.name_l,
                })
            }
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        });
    }

    React.useEffect(() => {
        handelGetStartUpData(props.match.params.id)
    }, [props]);

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header>
                        <Card.Title>Create a admintrative role</Card.Title>
                    </Card.Header>

                    <Card.Body>
                        
                        <Row>
                            <Col>
                                <Form.Group className="mb-2" controlId="name">
                                    <Form.Label className="m-0">Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" 
                                        defaultValue={data.name} 
                                        required
                                        onChange={e=>{
                                            setData({
                                                ...data,
                                                name : e.target.value
                                            })
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2" controlId="name_l">
                                    <Form.Label className="m-0">Name (in bangla)</Form.Label>
                                    <Form.Control type="text"
                                        defaultValue={data.name_l} 
                                        onChange={e=>{
                                            setData({
                                                ...data,
                                                name_l : e.target.value
                                            })
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            {
                                Object.keys(manus).length > 0 ?
                                (
                                    <React.Fragment>
                                        {
                                            (manus).map((manu, index)=>(
                                                <Col sm={12} md={3} key={index}>
                                                    <ul style={{ listStyle : `none` }}>
                                                        <li>
                                                            <Form.Group>
                                                                <Form.Check 
                                                                    type="checkbox" 
                                                                    /* checked={
                                                                        Object.keys(data.infos).length > 0 && Object.keys(data.infos).length ==  Object.keys(blockItems).length ? true : false
                                                                    }  */
                                                                    label={manu.name} defaultValue={manu.id}
                                                                    //onChange={handelCheckAll.bind(this,0)} 
                                                                />
                                                            </Form.Group>
                                                            {
                                                                manu.childs ? (
                                                                    Object.keys(manu.childs).length > 0 ?
                                                                    (
                                                                        <ul style={{ listStyle : `none` }}>
                                                                            {
                                                                                (manu.childs).map((child, i)=>(
                                                                                    <li key={i}>
                                                                                        <Form.Group>
                                                                                            <Form.Check 
                                                                                                type="checkbox" 
                                                                                                /* checked={
                                                                                                    Object.keys(data.infos).length > 0 && Object.keys(data.infos).length ==  Object.keys(blockItems).length ? true : false
                                                                                                }  */
                                                                                                label={child.name} defaultValue={child.id}
                                                                                                //onChange={handelCheckAll.bind(this,0)} 
                                                                                            />
                                                                                        </Form.Group>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    )
                                                                    :(``)
                                                                ):(``)
                                                            }
                                                        </li>
                                                    </ul>
                                                </Col>
                                            ))
                                        }
                                    </React.Fragment>
                                )
                                :(``)
                            }
                        </Row>

                    </Card.Body>

                </Card>
            </Col>
        </Row>
    )
}

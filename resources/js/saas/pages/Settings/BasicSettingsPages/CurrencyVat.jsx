import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import BtnSaving from '../../../components/BtnSaving'
import { AppUrl, ShowToast } from '../../../Context'

export default function CurrencyVat(props) {
    const [isSavingInfo,setSavingInfo] = React.useState(false)
    const [currencies,setCurrencies] = React.useState([])

    const [data,setData] = React.useState({
        default_currency : 0,
        bin_no : ``,
        mushak_no : ``,
        vat : 0,
    })

    const handelSaveData = async () => {
        setSavingInfo(true);
        const formData = new FormData()
        
        if (data.default_currency != 0) {
            formData.append('default_currency', data.default_currency.toString())
        }
        formData.append('bin_no', data.bin_no)
        formData.append('mushak_no', data.mushak_no)
        formData.append('vat', data.vat.toString())

        await axios.post(AppUrl(`/secure/settings/save-currency-info`),data)
        .then(function (response) {
            let info = response.data;
            if(info.errors){
                (info.errors).map((error,i)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
            else if(info.success){
                ShowToast({
                    type : 'success',
                    msg  : info.success
                })
                props.onSaveData()
            }
            setSavingInfo(false);
        })
        .catch(function (error) {
            if(error == 'Error: Request failed with status code 401'){
                location.reload()
            }
        })
    }

    React.useEffect(() => {
        let currencyList = [];
        if(Object.keys(props.currencies).length > 0){
            (props.currencies).map((currency)=>{
                currencyList.push({ value: currency.id, label: currency.name+` (`+currency.short_code+`)` })
            });
        }
        setCurrencies(currencyList)

        let settings = props.settings
        setData({
            ...data,
            default_currency :  settings.default_currency ? settings.default_currency : 0,
            bin_no :  settings.bin_no ? settings.bin_no : ``,
            mushak_no :  settings.mushak_no ? settings.mushak_no : ``,
            vat : settings.vat ? settings.vat : ``
        })

    }, [props]);

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col md={6} sm={12}>
                        <Form.Group className="mb-2" controlId="bin_no">
                            <Form.Label className="m-0">BIN No.</Form.Label>
                            <Form.Control type="text" 
                                value={data.bin_no} 
                                onChange={
                                    e => {
                                        setData({
                                            ...data,
                                            bin_no : e.target.value
                                        })
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6} sm={12}>
                        <Form.Group className="mb-2" controlId="mushak_no">
                            <Form.Label className="m-0">Mushak</Form.Label>
                            <Form.Control type="text" 
                                value={data.mushak_no} 
                                onChange={
                                    e => {
                                        setData({
                                            ...data,
                                            mushak_no : e.target.value
                                        })
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6} sm={12}>
                        <Form.Group className="mb-2" controlId="vat">
                            <Form.Label className="m-0">VAT</Form.Label>
                            <InputGroup>
                                <Form.Control type="number"
                                    min={0} max={999} step="any"
                                    value={data.vat} 
                                    onChange={
                                        e => {
                                            let min = e.target.min;
                                            let max = e.target.max;
                                            let value = parseFloat(e.target.value);
                                            let vat = min;
                                            
                                            if(value < min){
                                                vat = min
                                            }
                                            else if(value > max){
                                                vat = max
                                            }
                                            else{
                                                vat = value
                                            }
                                            setData({
                                                ...data,
                                                vat : vat
                                            })
                                        }
                                    }
                                />
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    <Col md={6} sm={12}>
                        <Form.Group className="mb-2" controlId="default_currency">
                            <Form.Label className="m-0">Default currency <span className="text-danger">*</span></Form.Label>
                            <Select
                                value={currencies.filter(
                                    option => (data.default_currency && option.value.toString() === (data.default_currency).toString())
                                )}
                                required
                                isClearable
                                options={currencies}
                                onChange={
                                    option => {
                                        setData({
                                            ...data,
                                            default_currency : option ? option.value : 0
                                        })
                                    }
                                }
                            />
                        </Form.Group>
                    </Col>
                    
                </Row>
            </Card.Body>
            <Card.Footer>
                {
                    !isSavingInfo ? (
                        <Button variant="primary" className="float-end" 
                            onClick={handelSaveData.bind(this)}
                        >Save</Button>
                    ):(
                        <BtnSaving variant="primary" text="Saving..." />
                    )
                }
            </Card.Footer>
        </Card>
    )
}

import React, { useEffect, useRef, useState } from 'react'
import "../Store/Store.css"
import { Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { addSku, removeSku, updateSku } from '../../redux/skuSlice';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export interface skuDetails {
    skuName: string,
    price: number | "",
    cost: number | "",
    id: number | "",
}

const SkuComp = () => {
    const dispatch = useDispatch()
    const skuArray = useSelector((state: any) => state.skuArray.skuArray)
    const storeArrayRef = useRef(skuArray);

    useEffect(() => {
        storeArrayRef.current = skuArray; // Always keeps the latest skuArray
    }, [skuArray]);

    // This is for storing the column definitions
    const [colDefs] = useState([
        { headerName: "⬍", rowDrag: true, width: 50 },
        { headerName: "SKU", field: "skuName" },
        { headerName: "Price", field: "price" },
        { headerName: "Cost", field: "cost" },
        {
            headerName: "",
            field: "actions",
            cellRenderer: (params: any) => {
                return (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button className='border-none' onClick={() => handleEdit(params.data.id)}>✏️</button>
                        <button className='border-none' onClick={() => handleDelete(params.data.id)}>🗑️</button>
                    </div>
                )

            },
            width: 190,
        },
    ])

    // This is for storing the modal
    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // This is for storing the form details
    const [formDetails, setFormDetails] = useState<skuDetails>({
        id: new Date().getTime(),
        skuName: "",
        price: "",
        cost: ""
    })

    // This is for handling the form change and validing cost and price values
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name !== "skuName") {
            // Prevent negative numbers
            if (value === "" || Number(value) >= 0) {
                setFormDetails((prev) => ({
                    ...prev,
                    [name]: value === "" ? "" : Number(value)
                }));
            }
        } else {
            setFormDetails((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // This is for closing and opening the modal
    const handleClose = () => setShow(false);
    const handleShow = (isNew: boolean) => {
        setShow(true)
        if (isNew) {
            setIsEdit(false)
            setFormDetails({
                id: new Date().getTime(),
                skuName: "",
                price: 0,
                cost: 0
            })
        }
    };

    // This is for adding/updating the sku details
    const addUpdateSku = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (isEdit) {
            dispatch(updateSku(formDetails))
            handleClose()
        }
        else {
            const newStoreDetails = { ...formDetails, id: new Date().getTime() };
            setFormDetails(newStoreDetails);
            dispatch(addSku(formDetails))
            handleClose()
        }
    }

    // This is for editing the sku details
    const handleEdit = (id: number) => {
        setIsEdit(true)
        const sku = storeArrayRef.current.find((sku: skuDetails) => sku.id === id);

        if (sku) {
            setFormDetails({
                price: sku.price,
                cost: sku.cost,
                skuName: sku.skuName,
                id: sku.id
            }); // Ensure sku is not undefined
            handleShow(false);
        }

    }

    // This is for deleting the sku details
    const handleDelete = (id: number) => {
        dispatch(removeSku(id))
    }

    const gridOptions: any = {
        rowDragManaged: true, // Enables automatic row movement
    };

    return (
        <div style={{
            textAlign: 'start',
        }}>
            <div style={{
                height: '500px',
            }}>
                <AgGridReact
                    rowData={skuArray}
                    columnDefs={colDefs}
                    gridOptions={gridOptions}
                />
            </div>
            <Button className='store-btn mt-4' variant="primary" active size='lg' onClick={() => handleShow(true)}>
                NEW SKU
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{
                        isEdit ? "Update SKU" : "Add New SKU"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>SKU Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="skuName"
                                value={formDetails.skuName}
                                placeholder="Enter SKU Name"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formDetails.price}
                                placeholder="Enter Price"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cost</Form.Label>
                            <Form.Control
                                type="number"
                                name="cost"
                                value={formDetails.cost}
                                placeholder="Enter Cost"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="outline-primary" type='submit'
                        disabled={!formDetails.skuName || !formDetails.price || !formDetails.cost}
                        onClick={(e) => (addUpdateSku(e))}>
                        {isEdit ? "Update SKU" : "Add SKU"}
                    </Button>
                </Modal.Footer>
                <div className="fs-6 d-block text-danger text-end ps-3 px-2 pb-2">
                    {(!formDetails.skuName || formDetails.price === "" || formDetails.cost === "") && "Please fill all the fields"}
                </div>
            </Modal>
        </div>
    )
}

export default SkuComp

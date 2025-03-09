import React, { useEffect, useRef, useState } from 'react'
import './Store.css'
import { Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { addStore, removeStore, updateStore } from '../../redux/slice';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export interface storeDetails {
    storeName: string,
    city: string,
    state: string,
    id: number,
}

const Store = () => {
    const dispatch = useDispatch()
    const storeArray = useSelector((state: any) => state.storeArray.storeArray)
    const storeArrayRef = useRef(storeArray);

    useEffect(() => {
        storeArrayRef.current = storeArray; // Always keeps the latest storeArray
    }, [storeArray]);

    // This is for storing the column definitions
    const [colDefs] = useState([
        { headerName: "S.no", valueGetter: (params: any) => params.node?.rowIndex! + 1, width: 80 },
        { headerName: "⬍", rowDrag: true, width: 50 },
        { headerName: "Name", field: "storeName" },
        { headerName: "City", field: "city" },
        { headerName: "State", field: "state" },
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
    const [formDetails, setFormDetails] = useState<storeDetails>({
        id: new Date().getTime(),
        storeName: "",
        city: "",
        state: ""
    })

    // This is for closing and opening the modal
    const handleClose = () => setShow(false);
    const handleShow = (isNew: boolean) => {
        setShow(true)
        if (isNew) {
            setIsEdit(false)
            setFormDetails({
                id: new Date().getTime(),
                storeName: "",
                city: "",
                state: ""
            })
        }
    };

    // This is for adding/updating the store details
    const addUpdateStore = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (isEdit) {
            dispatch(updateStore(formDetails))
            handleClose()
        }
        else {
            const newStoreDetails = { ...formDetails, id: new Date().getTime() };
            setFormDetails(newStoreDetails);
            dispatch(addStore(formDetails))
            handleClose()
        }
    }

    // This is for editing the store details
    const handleEdit = (id: number) => {
        setIsEdit(true)
        const store = storeArrayRef.current.find((store: storeDetails) => store.id === id);

        if (store) {
            setFormDetails({
                city: store.city,
                state: store.state,
                storeName: store.storeName,
                id: store.id
            }); // Ensure store is not undefined
            handleShow(false);
        }

    }

    // This is for deleting the store details
    const handleDelete = (id: number) => {
        dispatch(removeStore(id))
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
                    rowData={storeArray}
                    columnDefs={colDefs}
                    gridOptions={gridOptions}
                />
            </div>
            <Button className='store-btn mt-4' variant="primary" size='lg' active onClick={() => handleShow(true)}>
                NEW STORE
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{
                        isEdit ? "Update Store" : "Add New Store"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Store Name</Form.Label>
                            <Form.Control type="text" value={formDetails?.storeName} placeholder="Enter Store Name" onChange={(e) => {
                                setFormDetails({ ...formDetails, storeName: e.target.value })
                            }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" value={formDetails?.city} placeholder="Enter City" onChange={(e) => {
                                setFormDetails({ ...formDetails, city: e.target.value })
                            }} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>State</Form.Label>
                            <Form.Control value={formDetails?.state} type="text" placeholder="Enter State" onChange={(e) => {
                                setFormDetails({ ...formDetails, state: e.target.value })
                            }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="outline-primary" type='submit'

                        disabled={!formDetails.storeName || !formDetails.city || !formDetails.state}

                        onClick={(e) => (addUpdateStore(e))}>
                        {isEdit ? "Update Store" : "Add Store"}
                    </Button>
                </Modal.Footer>
                <div className='fs-6 d-block text-danger text-end ps-3 px-2
                pb-2'>
                    {(!formDetails.storeName || !formDetails.city || !formDetails.state) && "Please fill all the fields"}
                </div>
            </Modal>
        </div>
    )
}

export default Store

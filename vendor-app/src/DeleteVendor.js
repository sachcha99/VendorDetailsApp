import React,{useState} from 'react'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axios from 'axios';

function DeleteVendor({ id, handleClick ,setToggle,toggle}) {

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            const result = await axios.delete(`http://localhost:5000/vendor/delete/${id}`)
            handleClick()
            handleClose()
            setToggle(!toggle)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Button onClick={handleClickOpen} color="error" size="small">Delete</Button>
            <div>
                <Dialog
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Confirm to Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Are you sure to Delete this?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="success" onClick={handleClose}>No</Button>
                        <Button color="error" onClick={() => handleDelete(id)}>Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default DeleteVendor
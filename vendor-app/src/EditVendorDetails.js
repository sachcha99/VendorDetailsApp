
import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import RemoveCircleIcon from '@mui/icons-material/AddReaction';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const Alert = React.forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const theme = createTheme();

const EditVendorDetails = ({ id, toggle, setToggle }) => {
    let navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [product, setProduct] = useState([{ "pid": '', "pcode": '', "pname": '', "type": "raw-material" }]);
    const [personalDetails, setPersonalDetails] = useState({
        name: "",
        vid: "",
        phone: "",
        address: "",
        email: ""
    })
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setPersonalDetails({ ...personalDetails, [name]: value });
    };
    useEffect(() => {
        if (id) {
            getVendorDetails()
        }

    }, []);

    async function getVendorDetails() {
        const result = await axios.get(`http://localhost:5000/vendor/${id}`)

        setPersonalDetails({
            ...personalDetails,
            name: result.data[0].name,
            email: result.data[0].email,
            phone: result.data[0].contactNo,
            address: result.data[0].address,
            vid: result.data[0].vendorId,
        });
        setProduct(result.data[0].product)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get('name') && data.get('vid') && data.get('address') && data.get('phone') && data.get('email') && product) {
            let body = {
                name: personalDetails.name,
                vendorId: personalDetails.vid,
                registeredDate: new Date(),
                contactNo: personalDetails.phone,
                address: personalDetails.address,
                email: personalDetails.email,
                product: product,
            }
            try {
                const result = await axios.put(`http://localhost:5000/vendor/update/${id}`, body)
                setPersonalDetails({
                    name: "",
                    vid: "",
                    phone: "",
                    address: "",
                    email: ""
                })
                setProduct([{ "pid": '', "pcode": '', "pname": '', "type": '' }])
                setToggle(!toggle)
                handleClose();
            } catch (error) {
                console.log(error)
            }
        } else {
            setErrorMsg("Please Fill all fields")
            handleError()
        }
    };

    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleError = () => {
        setError(true);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setError(false);
    };

    const handleAddProduct = () => {
        setProduct([...product, { "pid": '', "pcode": '', "pname": '', "type": '' }]);
    };
    const handleRemoveProduct = (index) => {
        const list = [...product];
        list.splice(index, 1);
        setProduct(list);
    };

    const handleProductChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...product];
        list[index][name] = value;
        setProduct(list);
    };
    return (
        <div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Vendor Updated Successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error">{errorMsg}</Alert>
            </Snackbar>
            <Button onClick={handleOpen} color="success" size="small">Edit </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Update Vendor Details</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="given-name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    value={personalDetails.name}
                                    onChange={handleChangeInput}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    required
                                    fullWidth
                                    id="vid"
                                    label="VendorID"
                                    name="vid"
                                    autoComplete="vid"
                                    value={personalDetails.vid}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    name="phone"
                                    autoComplete="phone"
                                    value={personalDetails.phone}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="given-name"
                                    name="address"
                                    required
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    value={personalDetails.address}
                                    onChange={handleChangeInput}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="given-name"
                                    name="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-Mail"
                                    value={personalDetails.email}
                                    onChange={handleChangeInput}
                                    autoFocus
                                />
                            </Grid>
                            {product.map((singleProduct, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "center", }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                                        <Grid key={i} item xs={10} style={{ backgroundColor: "#e6e3e3", padding: "10px", marginTop: "10px", borderRadius: "10px" }}>
                                            <Grid style={{ display: 'flex' }} item xs={12}>
                                                <TextField
                                                    style={{ margin: '4px' }}
                                                    required
                                                    fullWidth
                                                    id="pid"
                                                    label="Product ID"
                                                    name="pid"
                                                    value={singleProduct.pid}
                                                    onChange={(e) => handleProductChange(e, i)}
                                                />

                                                <TextField
                                                    style={{ margin: '4px' }}
                                                    required
                                                    fullWidth
                                                    id="pcode"
                                                    label="Product Code"
                                                    name="pcode"
                                                    value={singleProduct.pcode}
                                                    onChange={(e) => handleProductChange(e, i)}
                                                />

                                            </Grid>

                                            <Grid item xs={12} style={{ display: 'flex' }}  >
                                                <TextField
                                                    style={{ margin: '4px' }}
                                                    required
                                                    fullWidth
                                                    id="pname"
                                                    label="Product Name"
                                                    name="pname"
                                                    value={singleProduct.pname}
                                                    onChange={(e) => handleProductChange(e, i)}
                                                />

                                            </Grid>
                                            <Grid item xs={12} style={{ display: 'flex' }}  >
                                                <FormControl>
                                                    <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                                        name="type"
                                                        value={singleProduct.type}
                                                        onChange={(e) => handleProductChange(e, i)}
                                                    >
                                                        <FormControlLabel value="raw-material" control={<Radio />} label="Raw Material" />
                                                        <FormControlLabel value="component" control={<Radio />} label="Component" />
                                                    </RadioGroup>
                                                </FormControl>

                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => { handleRemoveProduct(i) }}><RemoveCircleIcon /></div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => { handleAddProduct() }}><AddBoxIcon /></div>

                                </div>
                            ))}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Update
                        </Button>
                    </Box>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditVendorDetails
import React, { useState, useEffect } from 'react'
import NavBar from './NavBar';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import EditVendorDetails from './EditVendorDetails';
import BgImage from './images/bg-img.jpg'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DeleteVendor from './DeleteVendor';
import SearchBar from "material-ui-search-bar";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// const Transition = React.forwardRef(function Transition(
//     props: TransitionProps & {
//         children: React.ReactElement;
//     },
//     ref: React.Ref,
// ) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

const Alert = React.forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const VendorDetails = () => {

    const [userDetails, setUserDetails] = useState()
    const [toggle, setToggle] = useState(false)
    const [searchText, setSearchText] = useState()
    const [vendorDetails, setVendorDetails] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    let navigate = useNavigate();

    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        setUserDetails(user)
        if (!user) {
            navigate('/login')
        }
    }, []);

    useEffect(() => {
        getVendorDetails()

    }, [toggle]);

    async function getVendorDetails() {
        try {
            const result = await axios.get(`http://localhost:5000/vendor/`)
            console.log("res", result.data)
            setVendorDetails(result.data)
        } catch (error) {

            console.log(error)
        }
    }

    async function searchVendor() {
        if (searchText) {
            try {
                const result = await axios.get(`http://localhost:5000/vendor/search/${searchText}`)
                console.log("res", result.data)
                setVendorDetails(result.data)
            } catch (error) {

                console.log(error)
            }
        }
    }


    return (
        <>
            <NavBar user={userDetails} />
            <div style={{
                backgroundImage: `url(${BgImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>

                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Vendor Deleted Successfully!
                    </Alert>
                </Snackbar>
                <div>
                    <Box
                        sx={{
                            paddingTop: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        <SearchBar
                            value={searchText}
                            onChange={(newValue) => setSearchText(newValue)}
                            onRequestSearch={() => searchVendor()}
                        />
                        <div onClick={() => getVendorDetails()} style={{ cursor: "pointer" }}>
                            <RestartAltIcon color="primary" />
                        </div>
                    </Box>
                </div>
                <Box
                    sx={{
                        paddingTop: 8,
                        paddingBottom: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {vendorDetails.length ==0 && 
                        <Typography tyle={{ position: "absolute" }} gutterBottom variant="h4" component="div">
                            
                            <span style={{ fontWeight: 'bold' }}>No Entries Available</span>
                        </Typography>
                    }
                    {vendorDetails && vendorDetails.map((ven, i) => (

                        <Card key={i} sx={{ minWidth: 700, maxWidth: 700, marginBottom: 5 }} >
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    <Typography tyle={{ position: "absolute" }} gutterBottom variant="h6" component="div">
                                        <span style={{ fontWeight: 'bold' }}>{ven.name}</span>
                                    </Typography>
                                    <Typography variant="overline" color="text.secondary" style={{ position: "relative" }}>
                                        Vendor ID : {ven.vendorId}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                }}>
                                    <Typography variant="body1" >
                                        <span style={{ fontWeight: 'bold' }}>Address</span> : {ven.address}
                                    </Typography>
                                    <Typography variant="body1" >
                                        <span style={{ fontWeight: 'bold' }}>Registered Date</span> : {(new Date(ven.registeredDate)).getDate() + '/' + ((new Date(ven.registeredDate)).getMonth() + 1) + '/' + (new Date(ven.registeredDate)).getFullYear()}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                }}>
                                    <Typography variant="body1" >
                                        <span style={{ fontWeight: 'bold' }}>E-Mail</span> : {ven.email}
                                    </Typography>
                                    <Typography variant="body1" >
                                        <span style={{ fontWeight: 'bold' }}>Contact No</span> : {ven.contactNo}
                                    </Typography>
                                </Box>
                                <hr
                                    style={{
                                        color: "#858585",
                                        backgroundColor: "#858585",
                                        height: "1px"
                                    }}
                                />
                                <Typography variant="h6" style={{ display: "flex", justifyContent: "center", }} >
                                    Product Details
                                </Typography>

                                <div style={{ display: "flex", justifyContent: 'space-evenly', flexWrap: "wrap" }}>
                                    {ven.product.map((pro, i) => (
                                        <Box key={i} sx={{
                                            backgroundColor: "#ededed",
                                            margin: "3px",
                                            padding: "4px",
                                            borderRadius: "5px"
                                            //  width:"50px",
                                            //  flex: "50%"
                                            // display: 'flex',
                                            // justifyContent: 'space-evenly',
                                        }}>
                                            <Typography variant="body1" >
                                                <span style={{ fontWeight: 'bold' }}>Product ID</span> : {pro.pid}
                                            </Typography>
                                            <Typography variant="body1" >
                                                <span style={{ fontWeight: 'bold' }}>Product Name</span> : {pro.pname}
                                            </Typography>
                                            <Typography variant="body1" >
                                                <span style={{ fontWeight: 'bold' }}>Product Code</span> : {pro.pcode}
                                            </Typography>
                                            <Typography variant="body1" >
                                                <span style={{ fontWeight: 'bold' }}>Product Type</span> : {pro.type}
                                            </Typography>
                                        </Box>

                                    ))}

                                </div>

                            </CardContent>
                            <CardActions sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>

                                <EditVendorDetails toggle={toggle} setToggle={setToggle} id={ven._id} />
                                <DeleteVendor handleClick={handleClick} toggle={toggle} setToggle={setToggle} id={ven._id} />
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </div>
        </>
    )
}

export default VendorDetails
import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar'
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
import AddReactionIcon from '@mui/icons-material/AddReaction';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddBoxIcon from '@mui/icons-material/AddBox';
import BgImage from './images/bg-img.jpg'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import validator from 'validator';
const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <span color="inherit" >
        Vendor App
      </span>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();

const Home = () => {
  let navigate = useNavigate();
  const [userDetails, setUserDetails] = useState()
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    vid: "",
    phone: "",
    address: "",
    email: ""
  })
  const [birthday, setBirthday] = useState(new Date());
  const [product, setProduct] = useState([{ "pid": '', "pcode": '', "pname": '', "type": 'raw-material' }]);
  const [mobile, setMobile] = useState([{ "mobile": '' }]);
  const [departmentDetails, setDepartmentDetails] = useState(["Select"]);
  const [department, setDepartment] = useState("");
  const [designationDetails, setDesignationDetails] = useState([]);
  const [designation, setDesignation] = useState("");
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...product];
    console.log("first", name, value, list)
    list[index][name] = value;
    setProduct(list);
  };

  const handleMobileChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...mobile];
    list[index][name] = value;
    setMobile(list);
  };

  const handleChange = async (event) => {
    setDepartment(event.target.value);
    let dept = event.target.value;
    const result = await axios.get(`http://localhost:5000/departments/${dept}`)
    setDesignationDetails(result.data)

  };
  const handleChangeDes = async (event) => {
    setDesignation(event.target.value);
  };
  const handleAddProduct = () => {
    setProduct([...product, { "pid": '', "pcode": '', "pname": '', "type": '' }]);
  };
  const handleRemoveProduct = (index) => {
    const list = [...product];
    list.splice(index, 1);
    setProduct(list);
  };

  const handleAddMobile = () => {
    setMobile([...mobile, { "mobile": "" }]);
  };
  const handleRemoveMobile = (index) => {
    const list = [...mobile];
    list.splice(index, 1);
    setMobile(list);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    setUserDetails(user)
    if (!user) {
      navigate('/login')
    }
  }, []);

  useEffect(() => {
    getDepartments()
    async function getDepartments() {
      const result = await axios.get(`http://localhost:5000/departments/`)
      setDepartmentDetails(result.data)
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get('name') && data.get('vid') && data.get('address') && data.get('phone') && data.get('email') && product) {
      if (!validator.isEmail(data.get('email'))) {
        setErrorMsg("Enter valid email address")
        handleError()
      } else {
        let body = {
          name: personalDetails.name,
          vendorId: personalDetails.vid,
          registeredDate: new Date(),
          contactNo: personalDetails.phone,
          address: personalDetails.address,
          email: personalDetails.email,
          product: product,
        }
        console.log("body", body)
        try {
          const result = await axios.post(`http://localhost:5000/vendor/create`, body)
          console.log("result", result)
          setPersonalDetails({
            name: "",
            vid: "",
            phone: "",
            address: "",
            email: ""
          })
          setBirthday(new Date())
          setProduct([{ "pid": '', "pcode": '', "pname": '', "type": '' }])
          setMobile([{ "mobile": '' }])
          setDesignation("")
          setDepartment("")
          handleClick();

        } catch (error) {
          if (error.response.data.name == "duplicate") {
            setErrorMsg(error.response.data.msg)
            handleError()
          }
          console.log(error)
        }
      }

    } else {
      setErrorMsg("Please Fill all fields")
      handleError()
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
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

  return (
    <>
      <NavBar user={userDetails} />
      <div style={{
        backgroundImage: `url(${BgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <ThemeProvider theme={theme} >
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Vendor Added Successfully!
            </Alert>
          </Snackbar>
          <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error">{errorMsg}</Alert>
          </Snackbar>
          <Container component="main" maxWidth="xs" style={{}}>
            <CssBaseline />
            <Box
              sx={{
                paddingTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                padding: "10px",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
                <AddReactionIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add New Vendor
              </Typography>
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
                        <Grid key={i} item xs={10} style={{ backgroundColor: "#fefefe", padding: "10px", marginTop: "10px", borderRadius: "10px" }}>
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
                  Submit
                </Button>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      </div>
    </>
  )
}

export default Home
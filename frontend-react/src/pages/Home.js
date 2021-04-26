import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block'
  }
})

export default function Home() {
  const classes = useStyles()
  const [amount, setAmount] = useState(0)
  const [amountError, setAmountError] = useState(false)
  const [error, setError] = useState(null)
  const [withdrawCoins, setWithdrawCoins] = useState([])
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null)
    setAmountError(false);
    if (amount === 0) {
      setAmountError(true);
      return;
    }

    fetch(`http://localhost:3001/atm/withdraw/${amount}`, {
    }).then(res => res.json())
      .then(data => {
        setWithdrawCoins([]);
        const { message, withdraw } = data
        if (message) {
          setError(message);
          return;
        }
        console.log(withdraw)
        setWithdrawCoins(withdraw)
      })
  }

  return (
    <Container size="sm">
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
      >
        Please Enter withdraw Amount
      </Typography>


      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField className={classes.field}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          variant="outlined"
          color="secondary"
          fullWidth
          required
          error={amountError}
        />

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}>
          Submit
        </Button>
      </form>
      {error &&
        <h5>
          {error}
        </h5>
      }
      {
        Object.keys(withdrawCoins).map(function (key, index) {
          return (<Typography
            key={index}
            variant="h6"
            color="green"
            component="h2"
          >
            Paybox : {key} will Pay :

            {withdrawCoins[key].map((itm, idx) => (<Typography
              key={idx}
              variant="h8"
              color="textSecondary"
              component="h4"
            >

              Count : {itm.count} Amount: {itm.amount}

            </Typography>))}
          </Typography>)
        })
      }
    </Container>
  )
}
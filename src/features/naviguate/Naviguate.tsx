import './Naviguate.css'
import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'

export default function Naviguate() {
  const { open } = useWeb3Modal()
  const naviguate = useNavigate()
  const { address, isConnected, isDisconnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [value, setValue] = useState('provider')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4)
  }

  useEffect(() => {
    if (isDisconnected) {
      open()
    } else {
      naviguate('/protectedData')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected, open])

  useEffect(() => {
    if (value === 'provider') {
      naviguate('/protectedData')
    }
    if (value === 'consumer') {
      naviguate('/integration')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div>
      <AppBar position="static" elevation={0} id="appbar">
        <Toolbar id="tootBar">
          <img
            onClick={() => naviguate('/protectedData')}
            src={require('../../assets/logo.png')}
            alt="The immage can't be loaded"
            id="logo"
          />
          <Box sx={{ ml: 8 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              sx={{ '& .MuiTab-root': { textTransform: 'none' } }}
            >
              <Tab value="provider" label="My Vault" />
              <Tab value="consumer" label="Integrations" />
            </Tabs>
          </Box>
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: 'right',
              mr: 2,
              fontStyle: 'italic',
            }}
          >
            {isConnected && shortAddress(address as string)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              isConnected ? disconnect() : open()
            }}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </Toolbar>
      </AppBar>
      {isConnected ? <Outlet /> : 'Connect to Your Wallet'}
    </div>
  )
}

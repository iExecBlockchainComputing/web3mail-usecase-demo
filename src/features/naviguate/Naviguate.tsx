import './Naviguate.css'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'

export default function Naviguate() {
  const { open } = useWeb3Modal()
  const naviguate = useNavigate()
  const { address, isConnected, isDisconnected } = useAccount()
  const { disconnect } = useDisconnect()

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
      {isConnected && <Outlet />}
    </div>
  )
}

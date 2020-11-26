import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  const [recentProps, setRecentProps] = React.useState([])
  const [receivedProps, setReceivedProps] = React.useState([])
  const [submitting, setSubmitting] = React.useState(false)

  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {
        (async () => {
          setRecentProps(await window.contract.getRecentProps())
          setReceivedProps(await window.contract.getPropsWithReceiver({ receiver: window.accountId }))
        })().catch(console.error)
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Give props!</h1>
        <p>
          Say thanks to somebody. Your note stays forever on NEAR blockchain.
          You need to sign in to proceed.
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  async function onReceiverChange(event) {
    const receiver = event.target.value
    // TODO: Debounce, extract auto-loading pattern
    setButtonDisabled(true)
    try {
      const account = await window.near.account(receiver)
      await account.state()
      setButtonDisabled(false)
    } catch (error) {
      console.warn('Error checking account', receiver, error)
    }
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          Hello, {window.accountId}!
        </h1>
        <form onSubmit={async event => {
          event.preventDefault()

          const form = event.target
          const message = form.querySelector('textarea').value
          const receiver = form.querySelector('input[name="receiver"]').value

          try {
            setSubmitting(true)

            // Make sure receiver exists
            const account = await window.near.account(receiver)
            await account.state()

            // make an update call to the smart contract
            await window.contract.giveProps({
              receiver,
              message
            })
          } catch (e) {
            alert(
              'Something went wrong! ' +
              'Maybe you need to sign out and back in? ' +
              'Check your browser console for more info.'
            )
            throw e
          } finally {
            setSubmitting(false)
          }
        }}>
          <fieldset id="fieldset" disabled={submitting}>

            <p>Give props to:

              <input type="text" placeholder="username.near" name="receiver" onChange={onReceiverChange}></input>
            </p>

            <label
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em'
              }}
            >
              Add a note
            </label>

            <textarea style={{ width: '100%', height: '12em', fontSize: '1em' }} defaultValue='For being awesome'/>

            <button
              disabled={buttonDisabled}
              style={{ borderRadius: '5px' }}
            >
              Give props
            </button>
          </fieldset>
        </form>

        <h2>Recent props</h2>
        <PropsList data={recentProps} />

        <h2>Your props</h2>

        { receivedProps.length == 0
          ? <p>You haven't given or received any props yet.</p>
          : <PropsList data={receivedProps} />
        }

        <hr />
        <p>
          If you want to build more apps like this, check out <a target="_blank" rel="noreferrer" href="https://docs.near.org">the NEAR docs</a> or look through some <a target="_blank" rel="noreferrer" href="https://examples.near.org">example apps</a>.
        </p>
      </main>
    </>
  )
}

function PropsList(props) {
  return props.data.map(({ sender, receiver, message, timestamp }) => <div key={`${sender}:${receiver}:${timestamp}`}>
    <p>{sender} gave {receiver} props for:</p>
    <blockquote>{message}</blockquote>
  </div>)
}
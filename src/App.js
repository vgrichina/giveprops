import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  // use React Hooks to store greeting in component state
  const [greeting, setGreeting] = React.useState()

  const [submitting, setSubmitting] = React.useState(false)

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {

        // TODO: Load list of props

        // // window.contract is set by initContract in index.js
        // window.contract.getGreeting({ accountId: window.accountId })
        //   .then(greetingFromContract => {
        //     setGreeting(greetingFromContract)
        //   })
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
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
            {greeting}
          </label>
          {' '/* React trims whitespace around tags; insert literal space character when needed */}
          {window.accountId}!
        </h1>
        <form onSubmit={async event => {
          event.preventDefault()

          const form = event.target
          const message = form.querySelector('textarea').value
          const receiverId = form.querySelector('input[name="receiverId"]').value

          try {
            setSubmitting(true)

            // make an update call to the smart contract
            await window.contract.giveProps({
              receiverId,
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

              <input type="text" placeholder="username.near" name="receiverId"></input>
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

            <textarea style={{ width: '100%', height: '12em', fontSize: '1em' }}>For being awesome</textarea>

            <button
              //disabled={buttonDisabled}
              style={{ borderRadius: '5px' }}
            >
              Give props
            </button>
          </fieldset>
        </form>

        <p>You haven't given or received any props yet.</p>

        <hr />
        <p>
          If you want to build more apps like this, check out <a target="_blank" rel="noreferrer" href="https://docs.near.org">the NEAR docs</a> or look through some <a target="_blank" rel="noreferrer" href="https://examples.near.org">example apps</a>.
        </p>
      </main>
    </>
  )
}
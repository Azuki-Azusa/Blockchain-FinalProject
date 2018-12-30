// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import gambling0Artifact from '../../build/contracts/gambling0.json'
import gambling1Artifact from '../../build/contracts/gambling1.json'

// gambling0 is our usable abstraction, which we'll use through the code below.
const gambling0 = contract(gambling0Artifact)
const gambling1 = contract(gambling1Artifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the gambling0 abstraction for Use.
    gambling0.setProvider(web3.currentProvider)
    gambling1.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.refresh()
      self.restFresh()
      self.restFresh2()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  bet0: function () {
    const self = this

    const num = parseInt(document.getElementById('bet0num').value)

    this.setStatus('Betting... (please wait)')

    let g0
    gambling0.deployed().then(function (instance) {
      g0 = instance
      return g0.bet(num, {value: web3.toWei('1', 'ether'), from: account })
    }).then(function () {
      self.setStatus('Bet successfully!')
      self.restFresh()
      self.restFresh2()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error bet0; see log.')
    })
  },

  restFresh: function () {
    const self = this
    let g0
    gambling0.deployed().then(function (instance) {
      g0 = instance
      return g0.getMoneyNum(({ from: account }))
    }).then(function (value) {
      const rest = document.getElementById('rest')
      rest.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      if (e.message == 'Internal JSON-RPC error.') {
        document.getElementById('ll').style.visibility="hidden";
        self.setStatus('Contract has been destroyed; see log.')
      }
      else {
        self.setStatus('Error getting rest; see log.')
      }
    })
  },

  restFresh2: function () {
    const self = this
    let g0
    gambling0.deployed().then(function (instance) {
      g0 = instance
      return g0.getwin({ from: account })
    }).then(function (value) {
      const rest = document.getElementById('win')
      rest.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      if (e.message == 'Internal JSON-RPC error.') {
        document.getElementById('ll').style.visibility="hidden";
        self.setStatus('Contract has been destroyed; see log.')
      }
      else {
        self.setStatus('Error getting rest; see log.')
      }
    })
  },

  endd: function () {
    const self = this

    this.setStatus('Ending... (please wait)')

    let g0
    gambling0.deployed().then(function (instance) {
      g0 = instance
      return g0.endd({ from: account })
    }).then(function () {
      self.restFresh2()
      self.restFresh()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error ending; see log.')
    })
  },

  des: function () {
    const self = this

    this.setStatus('Destroying... (please wait)')

    let g0
    gambling0.deployed().then(function (instance) {
      g0 = instance
      return g0.des({ from: account })
    }).then(function () {
      self.setStatus('Destroy successfully!')
      document.getElementById('ll').style.visibility="hidden";
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error ending; see log.')
    })
  },

  refresh: function () {
    const self = this

    let g1
    gambling1.deployed().then(function (instance) {
      g1 = instance
      return g1.enable({ from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('able')
      if (!value.valueOf() == true) {
        balanceElement.innerHTML = 'not'
      } 
      else {
        balanceElement.innerHTML = ''
      }
    }).catch(function (e) {
      console.log(e)
      if (e.message == 'Internal JSON-RPC error.') {
        document.getElementById('rr').style.visibility="hidden";
        self.setStatus('Contract has been destroyed; see log.')
      }
      else {
        self.setStatus('Error getting rest; see log.')
      }
    })
  },

  ini1: function () {
    const self = this
    let g1
    gambling1.deployed().then(function (instance) {
      g1 = instance
      return g1.ini({value: web3.toWei('1000', 'ether'), from: account })
    }).then(function (value) {
      self.setStatus(value.valueOf())
      self.refresh()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },


  bet1: function () {
    const self = this

    this.setStatus('Betting... (please wait)')
    let g1
    gambling1.deployed().then(function (instance) {
      g1 = instance
      return g1.bet({ value: web3.toWei('1', 'ether'), from: account })
    }).then(function (value) {
      if (value.valueOf() == true) {
        self.setStatus('Bet successfully!')
      } 
      else {
        self.setStatus('Failed to bet!')
      } 
      self.setStatus('Bet successfully!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error betting; see log.')
    })
  },

  take: function () {
    const self = this

    this.setStatus('Taking... (please wait)')

    let g1
    gambling1.deployed().then(function (instance) {
      g1 = instance
      return g1.take({ from: account })
    }).then(function () {
      self.setStatus('Take successfully!')
      document.getElementById('rr').style.visibility="hidden";
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 gambling0,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:7545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})

export const NETWORKS = {
  UNDEFINED: undefined,
  LOCAL: {
    name: 'local',
    id: '*',
    url: 'http://localhost',
    port: 8545
  },
  ROPSTEN: {
    name: 'ropsten',
    id: '3',
    url: `http://${process.env.ROPSTEN_HOST}`,
    port: 8565,
  }
}

// Web3
export const Web3 = require("web3")

export const ACTIVE_NETWORK = NETWORKS.LOCAL
// export const ACTIVE_NETWORK = NETWORKS.ROPSTEN

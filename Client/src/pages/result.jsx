import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CONTRACT_ADDRESS = "0x38AfaA080da2F1Cace463888eb3f00417643C773";
const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "NFTMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "NFTTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "won",
				"type": "bool"
			}
		],
		"name": "Resolved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "prediction",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "btcPriceAtStake",
				"type": "uint256"
			}
		],
		"name": "Staked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contestId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contests",
		"outputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "prediction",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "btcPriceAtStake",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "won",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			}
		],
		"name": "mintNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextTokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contestId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "actualPrice",
				"type": "uint256"
			}
		],
		"name": "resolveContest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "prediction",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timeLimit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "btcPrice",
				"type": "uint256"
			}
		],
		"name": "stakeAVAX",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const WS_URL = "ws://localhost:3001";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const wsRef = useRef(null);

  // State with Quidditch-themed names
  const [snitchValue, setSnitchValue] = useState(() => {
    const price = location.state?.prediction;
    return price ? Number(price) : 82873; // Default fallback
  });

  const [matchData, setMatchData] = useState({
    matchId: location.state?.contestId || null,
    duration: location.state?.timeLimit ? Number(location.state.timeLimit) : 0,
    wager: location.state?.stakeAmount ? Number(location.state.stakeAmount) : 0
  });

  // Magical game state
  const [currentSnitchPosition, setCurrentSnitchPosition] = useState(null);
  const [finalSnitchPosition, setFinalSnitchPosition] = useState(null);
  const [hasCaughtSnitch, setHasCaughtSnitch] = useState(false);
  const [isMatchActive, setIsMatchActive] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [house, setHouse] = useState('gryffindor'); // Default house
  
  // Wallet and contract state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCastingSpell, setIsCastingSpell] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // House colors mapping
  const houseColors = {
    gryffindor: { bg: 'bg-red-700', text: 'text-yellow-400', border: 'border-yellow-400' },
    slytherin: { bg: 'bg-green-800', text: 'text-gray-300', border: 'border-gray-300' },
    ravenclaw: { bg: 'bg-blue-800', text: 'text-bronze-500', border: 'border-bronze-500' },
    hufflepuff: { bg: 'bg-yellow-600', text: 'text-black', border: 'border-black' },
    default: { bg: 'bg-purple-900', text: 'text-white', border: 'border-white' }
  };

  const currentHouse = houseColors[house] || houseColors.default;

  // Initialize with location state
  useEffect(() => {
    if (location.state?.prediction) {
      setSnitchValue(Number(location.state.prediction));
    }
    if (location.state) {
      setMatchData({
        matchId: location.state.contestId,
        duration: Number(location.state.timeLimit),
        wager: Number(location.state.stakeAmount)
      });
    }
    
    // Assign random house for demo (in real app, persist from previous page)
    const houses = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
    setHouse(houses[Math.floor(Math.random() * houses.length)]);
  }, [location.state]);

  // Initialize wallet connection
  useEffect(() => {
    if (window.ethereum) {
      const init = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          setSigner(signer);
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);
          setIsConnected(true);
        }
      };
      init();
    }
  }, []);

  // WebSocket connection for snitch tracking
  useEffect(() => {
    if (!isMatchActive) return;

    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      console.log('Connected to magical snitch tracker');
      wsRef.current.send(JSON.stringify({
        symbols: ['BTCUSD']
      }));
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.symbol === 'BTCUSD' && data.bid) {
          const newPosition = parseFloat(data.bid);
          setCurrentSnitchPosition(newPosition);

          if (newPosition >= snitchValue) {
            setFinalSnitchPosition(newPosition);
            setHasCaughtSnitch(true);
            setIsMatchActive(false);
            wsRef.current.close();
            
            // Calculate prize (1.5x the wager)
            setPrizeAmount(Number(matchData.wager) * 1.5);
          }
        }
      } catch (error) {
        console.error('Error parsing snitch data:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('Snitch tracker error:', error);
      setError('The snitch tracker spell failed!');
    };

    wsRef.current.onclose = () => {
      console.log('Snitch tracker connection closed');
    };

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(timer);
    };
  }, [isMatchActive, snitchValue, matchData.wager]);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      setSigner(signer);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError("The floo network is down: " + err.message);
    }
  };

  const claimPrize = async () => {
    if (!contract || !matchData.matchId) return;
    
    setIsCastingSpell(true);
    setError(null);

    try {
      const resolveTx = await contract.resolveContest(
        matchData.matchId,
        ethers.parseUnits(finalSnitchPosition.toString(), 18)
      );
      await resolveTx.wait();
      
      setSuccess(`Accio Galleons! ${prizeAmount.toFixed(4)} Galleons have been summoned to your vault!`);
      
      // Reset match state after claiming
      setTimeout(() => {
        setHasCaughtSnitch(false);
        setIsMatchActive(true);
        setTimeElapsed(0);
        setFinalSnitchPosition(null);
        setCurrentSnitchPosition(null);
      }, 5000);
    } catch (err) {
      setError(err.reason || err.message || "The bludger interfered with your claim!");
    } finally {
      setIsCastingSpell(false);
    }
  };

  // Calculate snitch distance
  const snitchDistance = currentSnitchPosition ? 
    (hasCaughtSnitch ? finalSnitchPosition : currentSnitchPosition) - snitchValue : 
    0;
  const formattedDistance = Number.isFinite(snitchDistance) ? snitchDistance.toFixed(2) : '0.00';
  const isPositiveDistance = snitchDistance >= 0;

  return (
    <div className={`min-h-screen ${currentHouse.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Flying Golden Snitch Animation */}
      <motion.div 
        className="absolute w-8 h-8 bg-yellow-400 rounded-full z-0"
        style={{
          left: `${hasCaughtSnitch ? 50 : (currentSnitchPosition ? (currentSnitchPosition % 90) + 5 : 30)}%`,
          top: `${hasCaughtSnitch ? 20 : (currentSnitchPosition ? ((currentSnitchPosition * 0.7) % 80) + 10 : 40)}%`,
          boxShadow: '0 0 15px gold'
        }}
        animate={{
          x: hasCaughtSnitch ? 0 : [0, 5, -3, 4, 0],
          y: hasCaughtSnitch ? 0 : [0, -3, 4, -2, 0],
          transition: { duration: 3, repeat: Infinity }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-1 bg-white rotate-45"></div>
          <div className="w-4 h-1 bg-white -rotate-45"></div>
        </div>
      </motion.div>

      {/* Flying Broomstick */}
      <motion.div 
        className="absolute text-4xl"
        style={{ right: '15%', top: '25%' }}
        animate={{
          x: [0, 10, -5, 8, 0],
          y: [0, 5, -3, 4, 0],
          rotate: [0, 5, -3, 0],
          transition: { duration: 5, repeat: Infinity }
        }}
      >
        🧹
      </motion.div>

      <div className={`relative z-20 border-4 ${currentHouse.border} rounded-xl shadow-lg p-8 w-full max-w-md bg-black bg-opacity-70 backdrop-blur-sm`}>
        <motion.h1 
          className="text-3xl font-bold text-center mb-6 text-yellow-400"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Quidditch Match Results
        </motion.h1>
        
        {!isConnected ? (
          <motion.button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-3 px-4 rounded-lg font-bold transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✨ Connect Magical Wallet ✨
          </motion.button>
        ) : (
          <div className="space-y-6">
            {/* House Crest */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`w-16 h-16 ${currentHouse.bg} rounded-full border-2 ${currentHouse.border} flex items-center justify-center text-3xl mb-4`}>
                {house === 'gryffindor' && '🦁'}
                {house === 'slytherin' && '🐍'}
                {house === 'ravenclaw' && '🦅'}
                {house === 'hufflepuff' && '🦡'}
              </div>
            </motion.div>

            {/* Match Details */}
            <div className="bg-gray-900 bg-opacity-60 p-4 rounded-lg border-2 border-yellow-500">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Match Scroll</h3>
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="text-gray-300">Wager Amount:</div>
                <div className="text-right text-yellow-400">{matchData.wager.toFixed(4)} Galleons</div>
                <div className="text-gray-300">Match Duration:</div>
                <div className="text-right text-yellow-400">{matchData.duration} minutes</div>
                <div className="text-gray-300">Your Snitch Prediction:</div>
                <div className="text-right text-yellow-400">${snitchValue.toLocaleString()}</div>
              </div>

              {currentSnitchPosition === null ? (
                <div className="text-center text-yellow-200 animate-pulse">
                  Casting tracking spell on the Golden Snitch...
                </div>
              ) : isMatchActive ? (
                <>
                  <h2 className="text-xl font-bold text-center mb-4 text-yellow-400">Match in Progress!</h2>
                  <div className="text-center text-gray-300 mb-2">
                    Current Snitch Value: ${currentSnitchPosition.toFixed(2)}
                  </div>
                  <div className="text-center text-gray-300 mb-2">
                    Target Value: ${snitchValue.toFixed(2)}
                  </div>
                  <div className="text-center mb-2">
                    <div className="font-semibold text-gray-300">Distance to Catch</div>
                    <div className={isPositiveDistance ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {formattedDistance} points
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-400">
                    Time elapsed: {timeElapsed}s / {matchData.duration}s
                  </div>
                </>
              ) : (
                <>
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <h2 className="text-2xl font-bold text-center mb-4 text-yellow-400">
                      {hasCaughtSnitch ? '🏆 You Caught the Snitch! 🏆' : '⏰ Time Expired! ⏰'}
                    </h2>
                    <p className="text-center mb-4 text-gray-300">
                      {hasCaughtSnitch 
                        ? `The crowd goes wild! You've won ${prizeAmount.toFixed(4)} Galleons!`
                        : 'The match has ended before you could catch the Snitch.'}
                    </p>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-gray-300">Final Value</div>
                      <div className="text-yellow-400">${finalSnitchPosition?.toFixed(2) || '--'}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-300">vs</div>
                      <div className="text-yellow-400">${snitchValue.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-300">Final Distance</div>
                    <div className={isPositiveDistance ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {formattedDistance} points
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-400 mt-2">
                    Match duration: {timeElapsed}s
                  </div>
                  
                  {hasCaughtSnitch && (
                    <motion.button
                      onClick={claimPrize}
                      disabled={isCastingSpell}
                      className={`w-full mt-4 py-3 px-4 rounded-lg font-bold transition ${
                        isCastingSpell 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                      }`}
                      whileHover={isCastingSpell ? {} : { scale: 1.05 }}
                      whileTap={isCastingSpell ? {} : { scale: 0.95 }}
                    >
                      {isCastingSpell ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Summoning Galleons...
                        </span>
                      ) : (
                        "💰 Claim Your Prize!"
                      )}
                    </motion.button>
                  )}
                </>
              )}
            </div>

            <div className="text-sm text-yellow-200">
              <p className="font-medium">How Scoring Works:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Catch the Snitch (reach target value) to win 150% of your wager</li>
                <li>The match ends when time expires or you catch the Snitch</li>
                <li>House points are awarded based on performance</li>
              </ul>
            </div>
          </div>
        )}

        {error && (
          <motion.div 
            className="mt-4 p-3 bg-red-900 text-red-100 rounded-lg border border-red-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚡ {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="mt-4 p-3 bg-green-900 text-green-100 rounded-lg border border-green-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✨ {success}
          </motion.div>
        )}
      </div>

      {/* Floating Quidditch Elements */}
      <div className="absolute bottom-4 left-4 text-sm opacity-70 text-white">
        Hogwarts Quidditch League • Powered by MagicChain
      </div>
    </div>
  );
}
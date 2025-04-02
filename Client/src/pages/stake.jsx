import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CONTRACT_ADDRESS = "0x38AfaA080da2F1Cace463888eb3f00417643C773";
const CONTRACT_ABI =[
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
const TRADERMADE_API_KEY = "nnshA-1CuviZH1K1XqB3";

export default function StakePage() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasNFT, setHasNFT] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [btcPrice, setBtcPrice] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [timeLimit, setTimeLimit] = useState('10');
  const [stakeAmount, setStakeAmount] = useState('0.1');
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [walletBalance, setWalletBalance] = useState(null);
  const [house, setHouse] = useState(null);
  const [snitchPosition, setSnitchPosition] = useState({ x: 30, y: 40 });
  const navigate = useNavigate();

  // House colors mapping
  const houseColors = {
    gryffindor: { bg: 'bg-red-700', text: 'text-yellow-400', border: 'border-yellow-400' },
    slytherin: { bg: 'bg-green-800', text: 'text-gray-300', border: 'border-gray-300' },
    ravenclaw: { bg: 'bg-blue-800', text: 'text-bronze-500', border: 'border-bronze-500' },
    hufflepuff: { bg: 'bg-yellow-600', text: 'text-black', border: 'border-black' },
    default: { bg: 'bg-purple-900', text: 'text-white', border: 'border-white' }
  };

  const currentHouse = house ? houseColors[house] : houseColors.default;

  // Fetch live BTC price
  const fetchBTCPrice = async () => {
    try {
      setIsLoadingPrice(true);
      const response = await fetch(
        `https://marketdata.tradermade.com/api/v1/live?currency=BTCUSD&api_key=${TRADERMADE_API_KEY}`
      );
      const data = await response.json();
      if (data.quotes && data.quotes[0]?.mid) {
        setBtcPrice(data.quotes[0].mid);
      } else {
        throw new Error("Invalid price data");
      }
    } catch (err) {
      console.error("Failed to fetch BTC price:", err);
      setError("The Quidditch scoreboard is malfunctioning! Using default value.");
      setBtcPrice(50000);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!signer) return;
    try {
      const balance = await provider.getBalance(await signer.getAddress());
      setWalletBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  // Check NFT ownership
  const checkNFTOwnership = async (currentSigner, currentContract) => {
    try {
      if (!currentSigner || !currentContract) return false;
      const address = await currentSigner.getAddress();
      const balance = await currentContract.balanceOf(address);
      return balance > 0;
    } catch (err) {
      console.error("Error checking NFT balance:", err);
      return false;
    }
  };

  // Initialize the app
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      
      if (!window.ethereum) {
        setError("No magic detected! Please install MetaMask");
        setIsInitializing(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          setSigner(signer);
          
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);
          
          setIsConnected(true);
          
          const ownsNFT = await checkNFTOwnership(signer, contract);
          setHasNFT(ownsNFT);
          
          // Assign random house
          const houses = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
          setHouse(houses[Math.floor(Math.random() * houses.length)]);
          
          await fetchBTCPrice();
          await fetchWalletBalance();
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("The sorting hat is confused: " + err.message);
      } finally {
        setIsInitializing(false);
      }
    };

    init();

    // Move snitch randomly
    const snitchInterval = setInterval(() => {
      setSnitchPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }, 5000);

    // Refresh price every 30 seconds
    const priceInterval = setInterval(fetchBTCPrice, 30000);
    
    return () => {
      clearInterval(snitchInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      setError("No magic provider found");
      return;
    }

    try {
      setIsInitializing(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const signer = await provider.getSigner();
      setSigner(signer);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
      
      setIsConnected(true);
      
      const ownsNFT = await checkNFTOwnership(signer, contract);
      setHasNFT(ownsNFT);
      
      // Assign random house
      const houses = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'];
      setHouse(houses[Math.floor(Math.random() * houses.length)]);
      
      await fetchBTCPrice();
      await fetchWalletBalance();
      
      setError(null);
    } catch (err) {
      console.error("Connection error:", err);
      setError("The floo network is down: " + err.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStake = async (e) => {
    e.preventDefault();
    
    if (!contract || !signer || !hasNFT) {
      setError("You need a Quidditch team NFT to play!");
      return;
    }
    
    if (!prediction || !timeLimit || !stakeAmount) {
      setError("Fill all the fields to make your move!");
      return;
    }
    
    if (parseFloat(stakeAmount) <= 0) {
      setError("You can't play for zero galleons!");
      return;
    }
    
    if (walletBalance && parseFloat(stakeAmount) > parseFloat(walletBalance)) {
      setError("Not enough galleons in your vault!");
      return;
    }
    
    setIsStaking(true);
    setError(null);
    setSuccess(null);
  
    try {
      const tx = await contract.stakeAVAX(
        ethers.parseUnits(prediction.toString(), 18),
        parseInt(timeLimit),
        ethers.parseUnits(btcPrice.toString(), 18),
        {
          value: ethers.parseEther(stakeAmount.toString()),
          gasLimit: 500000
        }
      );
      
      const receipt = await tx.wait();
      if (receipt.status === 0) throw new Error("Bludger interference! Transaction failed");
      
      const currentContestId = await contract.contestId();
      
      setSuccess(`
        Quaffle scored! 
        Bet: ${stakeAmount} Galleons
        Prediction: $${prediction} 
        Time Limit: ${timeLimit} minutes
        Match ID: ${currentContestId}
      `);
      
      await fetchWalletBalance();
      
      setPrediction('');
      setTimeLimit('10');
      setStakeAmount('0.1');
      
      navigate('/result', { 
        state: { 
          contestId: currentContestId,
          prediction: prediction,
          timeLimit: timeLimit,
          stakeAmount: stakeAmount
        } 
      });
    } catch (err) {
      console.error("Staking error:", err);
      setError(err.reason || err.message || "The snitch got away! Try again");
    } finally {
      setIsStaking(false);
    }
  };

  if (isInitializing) {
    return (
      <div className={`min-h-screen ${currentHouse.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
        <div className={`relative z-20 border-4 ${currentHouse.border} rounded-xl shadow-lg p-8 w-full max-w-md bg-black bg-opacity-70 backdrop-blur-sm text-center`}>
          <motion.h1 
            className="text-3xl font-bold mb-4 text-yellow-400"
            animate={{ 
              scale: [1, 1.05, 1],
              transition: { duration: 2, repeat: Infinity }
            }}
          >
            Summoning the Sorting Hat...
          </motion.h1>
          <p className="text-white">Preparing your Quidditch gear</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentHouse.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Flying Golden Snitch */}
      <motion.div 
        className="absolute w-8 h-8 bg-yellow-400 rounded-full z-0"
        style={{
          left: `${snitchPosition.x}%`,
          top: `${snitchPosition.y}%`,
          boxShadow: '0 0 15px gold'
        }}
        animate={{
          x: [0, 10, -5, 8, 0],
          y: [0, -5, 8, -3, 0],
          transition: { duration: 3, repeat: Infinity }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-1 bg-white rotate-45"></div>
          <div className="w-4 h-1 bg-white -rotate-45"></div>
        </div>
      </motion.div>

      {/* Flying Broomsticks */}
      <motion.div 
        className="absolute text-4xl"
        style={{ left: '15%', top: '25%' }}
        animate={{
          x: [0, 20, -10, 15, 0],
          y: [0, 15, 25, 10, 0],
          rotate: [0, 15, -10, 0],
          transition: { duration: 8, repeat: Infinity }
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
          Quidditch Wager Pitch
        </motion.h1>
        
        {!isConnected ? (
          <motion.button
            onClick={connectWallet}
            disabled={isInitializing}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-3 px-4 rounded-lg font-bold transition transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isInitializing ? 'Connecting...' : '✨ Enter the Pitch ✨'}
          </motion.button>
        ) : (
          <div className="space-y-6">
            {house && (
              <div className="text-center font-bold text-xl mb-2">
                <div className="mb-1">Playing for:</div>
                <div className={`text-2xl ${currentHouse.text} uppercase tracking-wider`}>
                  {house}!
                </div>
              </div>
            )}

            {hasNFT ? (
              <>
                <div className="bg-gray-900 bg-opacity-60 p-4 rounded-lg border-2 border-yellow-500">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Golden Snitch Value:</span>
                    {isLoadingPrice ? (
                      <span className="animate-pulse">Calculating...</span>
                    ) : (
                      <span className="font-bold text-yellow-400">${btcPrice?.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {walletBalance && (
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Your Galleons:</span>
                      <span className="font-bold text-yellow-400">{parseFloat(walletBalance).toFixed(4)} G</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleStake} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-yellow-400">
                        Wager Amount (Galleons)
                      </label>
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="Enter Galleons"
                        className="w-full p-2 border border-yellow-500 rounded bg-gray-800 text-white"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-yellow-400">
                        Your Snitch Value Prediction (USD)
                      </label>
                      <input
                        type="number"
                        value={prediction}
                        onChange={(e) => setPrediction(e.target.value)}
                        placeholder="Enter prediction"
                        className="w-full p-2 border border-yellow-500 rounded bg-gray-800 text-white"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-yellow-400">
                        Match Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="w-full p-2 border border-yellow-500 rounded bg-gray-800 text-white"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={isStaking || isLoadingPrice}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition ${
                          isStaking || isLoadingPrice
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                        whileHover={isStaking ? {} : { scale: 1.05 }}
                        whileTap={isStaking ? {} : { scale: 0.95 }}
                      >
                        {isStaking ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Casting Spell...
                          </span>
                        ) : (
                          "⚡ Launch Quaffle!"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
                
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">How to Play:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Wager Galleons on the Snitch's value</li>
                    <li>Predict if the value will rise or fall</li>
                    <li>Set duration for your prediction</li>
                    <li>Win 150% if you catch the Snitch (correct prediction)</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-red-400 font-medium mb-4">
                  You need a Quidditch Team NFT to play!
                </div>
                <motion.button
                  onClick={() => navigate('/mint')}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white py-3 px-4 rounded-lg font-bold transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏆 Join the Tournament
                </motion.button>
              </div>
            )}
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
            <p className="whitespace-pre-line">✨ {success}</p>
          </motion.div>
        )}

        {/* House Crest */}
        {house && (
          <motion.div 
            className="mt-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className={`w-16 h-16 ${currentHouse.bg} rounded-full border-2 ${currentHouse.border} flex items-center justify-center text-3xl`}>
              {house === 'gryffindor' && '🦁'}
              {house === 'slytherin' && '🐍'}
              {house === 'ravenclaw' && '🦅'}
              {house === 'hufflepuff' && '🦡'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Quidditch Elements */}
      <div className="absolute bottom-4 left-4 text-sm opacity-70 text-white">
        Quidditch World Cup • Powered by MagicChain
      </div>
    </div>
  );
}
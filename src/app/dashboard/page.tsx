'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Shield, PieChart, ArrowUpRight, ArrowDownRight, Wallet, RefreshCcw } from 'lucide-react'
import { BCS } from "aptos"

const CONTRACT_ADDRESS = "0x1202bd0151993fd3556212f9f5178fc5239f933beca6389738a5b0872eeea4b1";

interface LenderInfo {
    usdtDeposited: number;
    depositTimestamp: number;
    earnedInterest: number;
}

interface BorrowerInfo {
    dogeCollateral: number;
    usdtBorrowed: number;
    borrowTimestamp: number;
    currentInterest?: number;
    totalOwed?: number;
    timeElapsed?: number;
}

interface PoolInfo {
    totalUsdtDeposits: number;
    totalUsdtBorrowed: number;
    totalDogeCollateral: number;
}

interface PriceFeedData {
    dogePrice: number;
    lastUpdate: string;
}

class PriceFeed {
    private ws: WebSocket;
    private dogePrice: number = 0;
    private lastUpdate: string = '';
    private onUpdate: (data: PriceFeedData) => void;

    constructor(onUpdate: (data: PriceFeedData) => void) {
        this.onUpdate = onUpdate;
        this.ws = new WebSocket('wss://prod-socket-server.wss-cerberus.supra.com/ws');
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws.onopen = () => {
            console.log('Connected to Supra WebSocket');
            this.ws.send(JSON.stringify({
                "action": "subscribe",
                "channels": [{
                    "name": "dora",
                    "tradingPairs": ["doge_usdt", "2"]
                }]
            }));
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "dora" && data.payload && data.payload[0]) {
                this.dogePrice = data.payload[0].price;
                this.lastUpdate = new Date(data.payload[0].time).toLocaleString();
                this.onUpdate({
                    dogePrice: this.dogePrice,
                    lastUpdate: this.lastUpdate
                });
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    getCurrentPrice() {
        return this.dogePrice;
    }
}

export default function Dashboard() {
    const [network, setNetwork] = useState<'supra' | 'citrea'>('supra')
    const [isConnected, setIsConnected] = useState(false)
    const [supraProvider, setSupraProvider] = useState<any>(null);
    const [isExtensionInstalled, setIsExtensionInstalled] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [balance, setBalance] = useState<string>("");
    const [activeTab, setActiveTab] = useState('home')
    const [loading, setLoading] = useState<boolean>(false);

    // Form states
    const [depositAmount, setDepositAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [borrowAmount, setBorrowAmount] = useState<string>("");
    const [repayAmount, setRepayAmount] = useState<string>("");
    const [collateralAmount, setCollateralAmount] = useState<string>("");

    const [lenderInfo, setLenderInfo] = useState<LenderInfo | null>(null);
    const [borrowerInfo, setBorrowerInfo] = useState<BorrowerInfo | null>(null);
    const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);

    const [priceData, setPriceData] = useState<PriceFeedData>({
        dogePrice: 0,
        lastUpdate: ''
    });
    const [priceFeed, setPriceFeed] = useState<PriceFeed | null>(null);

    const getNetworkStyles = (network: 'supra' | 'citrea') => ({
        background: network === 'supra' ? 'bg-red-600' : 'bg-orange-500',
        text: network === 'supra' ? 'text-red-600' : 'text-orange-500',
        lighter: network === 'supra' ? 'bg-red-50' : 'bg-orange-50',
    })

    const networkStyles = getNetworkStyles(network)

    useEffect(() => {
        checkIsExtensionInstalled();
    }, []);

    const checkIsExtensionInstalled = () => {
        const intervalId = setInterval(() => {
            if ((window as any)?.starkey) {
                const provider = (window as any)?.starkey.supra;
                setSupraProvider(provider);
                clearInterval(intervalId);
                setIsExtensionInstalled(true);
                updateAccounts().then();
            }
        }, 500);

        setTimeout(() => clearInterval(intervalId), 5000);
    };

    const updateAccounts = async () => {
        if (supraProvider) {
            try {
                const response_acc = await supraProvider.account();
                if (response_acc.length > 0) {
                    setAccounts(response_acc);
                    setIsConnected(true);
                    await updateBalance();
                }
            } catch (e) {
                setAccounts([]);
                setIsConnected(false);
            }
        }
    };

    const updateBalance = async () => {
        if (supraProvider && accounts.length) {
            const balance = await supraProvider.balance();
            if (balance) {
                setBalance(`${balance.formattedBalance} ${balance.displayUnit}`);
            }
        }
    };

    const connectWallet = async () => {
        setLoading(true);
        try {
            await supraProvider.connect();
            await updateAccounts();
        } catch (error) {
            console.error("Connection error:", error);
        }
        setLoading(false);
    };

    const depositUsdt = async () => {
        try {
            const amount = Number(depositAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "deposit_usdt",
                [],
                [BCS.bcsSerializeUint64(amount)],
                optionalTransactionPayloadArgs
            ];
            console.log("raw tran: ", rawTxPayload);
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data: data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            const tx = await supraProvider.sendTransaction(params);
            console.log("tx hash :", tx);
            setDepositAmount("");
            await updateAfterTransaction();
        } catch (error) {
            console.error("Deposit error:", error);
        }
    };

    const withdrawUsdt = async () => {
        try {
            const amount = Number(withdrawAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "withdraw_usdt",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            const tx = await supraProvider.sendTransaction(params);
            console.log("tx hash :", tx);
            setWithdrawAmount("");
            await updateAfterTransaction();
        } catch (error) {
            console.error("Withdraw error:", error);
        }
    };

    const depositCollateral = async () => {
        try {
            const amount = Number(collateralAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "deposit_collateral",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            setCollateralAmount("");
        } catch (error) {
            console.error("Deposit collateral error:", error);
        }
    };

    const borrowUsdt = async () => {
        try {
            const amount = Number(borrowAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "borrow_usdt",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            setBorrowAmount("");
            await updateAfterTransaction();
        } catch (error) {
            console.error("Borrow error:", error);
        }
    };

    const repayLoan = async () => {
        try {
            const amount = Number(repayAmount);
            const optionalTransactionPayloadArgs = {
                txExpiryTime: (Math.ceil(Date.now() / 1000) + 30)
            }
            const rawTxPayload = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "repay_loan",
                [],
                [BCS.bcsSerializeUint64(BigInt(amount))],
                optionalTransactionPayloadArgs
            ];
            const data = await supraProvider.createRawTransactionData(rawTxPayload);
            const networkData = await supraProvider.getChainId();
            const params = {
                data,
                from: accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: networkData.chainId,
                value: "",
            };
            await supraProvider.sendTransaction(params);
            setRepayAmount("");
            await updateAfterTransaction();
        } catch (error) {
            console.error("Repay error:", error);
        }
    };

    const fetchContractInfo = async () => {
        if (!supraProvider || !accounts.length) return;

        try {
            // Get balance using the provider's balance method
            const balance = await supraProvider.balance();
            if (balance) {
                setBalance(`${balance.formattedBalance} ${balance.displayUnit}`);
            }

            // Get lender info using view transaction
            const lenderTx = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "get_lender_info",
                [],
                [accounts[0]],
                { txExpiryTime: (Math.ceil(Date.now() / 1000) + 30) }
            ];
            const lenderData = await supraProvider.createRawTransactionData(lenderTx);
            const lenderResponse = await supraProvider.viewFunction(lenderData);
            if (lenderResponse && Array.isArray(lenderResponse) && lenderResponse.length === 3) {
                const [usdtDeposited, currentInterest, earnedInterest] = lenderResponse;
                setLenderInfo({
                    usdtDeposited: Number(usdtDeposited),
                    depositTimestamp: Math.floor(Date.now() / 1000), // Current timestamp
                    earnedInterest: Number(earnedInterest)
                });
            }

            // Get borrower info using view transaction
            const borrowerTx = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "get_borrower_info",
                [],
                [accounts[0]],
                { txExpiryTime: (Math.ceil(Date.now() / 1000) + 30) }
            ];
            const borrowerData = await supraProvider.createRawTransactionData(borrowerTx);
            const borrowerResponse = await supraProvider.viewFunction(borrowerData);
            if (borrowerResponse && Array.isArray(borrowerResponse) && borrowerResponse.length === 5) {
                const [dogeCollateral, usdtBorrowed, interest, totalOwed, timeElapsed] = borrowerResponse;
                setBorrowerInfo({
                    dogeCollateral: Number(dogeCollateral),
                    usdtBorrowed: Number(usdtBorrowed),
                    borrowTimestamp: Math.floor(Date.now() / 1000), // Current timestamp
                    currentInterest: Number(interest),
                    totalOwed: Number(totalOwed),
                    timeElapsed: Number(timeElapsed)
                });
            }

            // Get pool info using view transaction
            const poolTx = [
                accounts[0],
                0,
                CONTRACT_ADDRESS,
                "lending_protocol",
                "get_pool_info",
                [],
                [],
                { txExpiryTime: (Math.ceil(Date.now() / 1000) + 30) }
            ];
            const poolData = await supraProvider.createRawTransactionData(poolTx);
            const poolResponse = await supraProvider.viewFunction(poolData);
            if (poolResponse && Array.isArray(poolResponse) && poolResponse.length === 3) {
                const [totalUsdtDeposits, totalUsdtBorrowed, totalDogeCollateral] = poolResponse;
                setPoolInfo({
                    totalUsdtDeposits: Number(totalUsdtDeposits),
                    totalUsdtBorrowed: Number(totalUsdtBorrowed),
                    totalDogeCollateral: Number(totalDogeCollateral)
                });
            }

        } catch (error: any) { // Type assertion for error
            console.error("Error fetching contract info:", error);
            if (error?.message?.includes('ERR_NOT_INITIALIZED')) {
                console.log("User not initialized as lender/borrower");
            }
        }
    };

    // Add this to update info after each transaction
    const updateAfterTransaction = async () => {
        await fetchContractInfo();
    };

    useEffect(() => {
        if (isConnected) {
            fetchContractInfo();
            // Set up an interval to refresh data
            const intervalId = setInterval(fetchContractInfo, 60000); // refresh every minute
            return () => clearInterval(intervalId);
        }
    }, [isConnected]);

    // Helper function to truncate address
    const truncateAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Add this useEffect for price feed
    useEffect(() => {
        const feed = new PriceFeed((data) => {
            setPriceData(data);
        });
        setPriceFeed(feed);

        return () => {
            feed.disconnect();
        };
    }, []);

    // Add this function to calculate borrow limit
    // const calculateBorrowLimit = (collateralAmount: number) => {
    //     const collateralValue = collateralAmount * priceData.dogePrice;
    //     return (collateralValue * 100) / 150;
    // };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Network Selector & Wallet */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setNetwork('supra')}
                                className={`px-4 py-2 rounded-lg ${network === 'supra' ? 'bg-red-600 text-white' : 'bg-gray-100'
                                    }`}
                            >
                                Supra
                            </button>
                            <button
                                onClick={() => setNetwork('citrea')}
                                className={`px-4 py-2 rounded-lg ${network === 'citrea' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                                    }`}
                            >
                                Citrea
                            </button>
                        </div>
                        <button
                            onClick={connectWallet}
                            disabled={loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${networkStyles.background} text-white`}
                        >
                            <Wallet className="h-4 w-4" />
                            {loading ? (
                                <RefreshCcw className="h-4 w-4 animate-spin" />
                            ) : (
                                <span>
                                    {isConnected ? truncateAddress(accounts[0]) : 'Connect Wallet'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>
        
            <main className="max-w-7xl mx-auto px-4 py-8 space-y-4">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { 
                            title: "Deposited Amount", 
                            value: `${lenderInfo?.usdtDeposited || 0} USDT`, 
                            icon: DollarSign 
                        },
                        { 
                            title: "Collateral Amount", 
                            value: `${borrowerInfo?.dogeCollateral || 0} DOGE`, 
                            icon: ArrowDownRight 
                        },
                        { 
                            title: "Borrowed Amount", 
                            value: `${borrowerInfo?.usdtBorrowed || 0} USDT`, 
                            icon: ArrowUpRight 
                        },
                        { 
                            title: "Total Interest", 
                            value: `${borrowerInfo?.currentInterest || 0} USDT`, 
                            icon: ArrowUpRight 
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${networkStyles.lighter}`}>
                                    <stat.icon className={`h-5 w-5 ${networkStyles.text}`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
              
                {/* Live Price Feed Card */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">Live Price Feed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Current DOGE Price</div>
                                <div className="text-2xl font-bold text-blue-500">
                                    ${priceData.dogePrice.toFixed(4)} USDT
                                </div>
                                <div className="text-xs text-gray-500">
                                    Last Update: {priceData.lastUpdate}
                                </div>
                            </div>
                            {/* <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Collateral Value</div>
                                <div className="text-2xl font-bold">
                                    ${((borrowerInfo?.dogeCollateral || 0) * priceData.dogePrice).toFixed(2)} USDT
                                </div>
                                <div className="text-xs text-gray-500">
                                    Max Borrow: ${calculateBorrowLimit(borrowerInfo?.dogeCollateral || 0).toFixed(2)} USDT
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Lending Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Lending</h2>
                            <div className={`px-3 py-1 rounded-full text-sm ${networkStyles.text}`}>
                                8% APY
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span>Your Deposits</span>
                                    <span className="font-bold">
                                        {lenderInfo?.usdtDeposited || '0.00'} USDT
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Earned Interest</span>
                                    <span className="text-green-500 font-bold">
                                        +{lenderInfo?.earnedInterest || '0.00'} USDT
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Deposit
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                    <button 
                                        onClick={() => setDepositAmount(balance)}
                                        className="absolute right-2 top-2 px-2 py-1 text-sm bg-gray-100 rounded"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={depositUsdt}
                                disabled={!depositAmount}
                                className={`w-full py-3 ${networkStyles.background} text-white rounded-lg disabled:opacity-50`}
                            >
                                Deposit USDT
                            </button>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Withdraw
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                    <button 
                                        onClick={() => setWithdrawAmount(balance)}
                                        className="absolute right-2 top-2 px-2 py-1 text-sm bg-gray-100 rounded"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={withdrawUsdt}
                                disabled={!withdrawAmount}
                                className={`w-full py-3 border-2 ${networkStyles.text} border-current rounded-lg disabled:opacity-50`}
                            >
                                Withdraw USDT
                            </button>
                        </div>
                    </div>

                    {/* Borrowing Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Borrowing</h2>
                            <div className={`px-3 py-1 rounded-full text-sm ${networkStyles.text}`}>
                                166% Required
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span>Your Collateral</span>
                                    <span className="font-bold">
                                        {borrowerInfo?.dogeCollateral || '0.00'} DOGE
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Borrowed</span>
                                    <span className="font-bold">
                                        {borrowerInfo?.usdtBorrowed || '0.00'} USDT
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Current Interest</span>
                                    <span className="text-red-500 font-bold">
                                        {borrowerInfo?.currentInterest || '0.00'} USDT
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Owed</span>
                                    <span className="font-bold">
                                        {borrowerInfo?.totalOwed || '0.00'} USDT
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Collateral Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={collateralAmount}
                                        onChange={(e) => setCollateralAmount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={depositCollateral}
                                disabled={!isConnected || !collateralAmount}
                                className={`w-full py-3 mb-2 border-2 ${networkStyles.text} border-current rounded-lg disabled:opacity-50`}
                            >
                                Deposit Collateral
                            </button>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Borrow Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={borrowAmount}
                                        onChange={(e) => setBorrowAmount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={borrowUsdt}
                                disabled={!isConnected || !borrowAmount}
                                className={`w-full py-3 ${networkStyles.background} text-white rounded-lg disabled:opacity-50`}
                            >
                                Borrow USDT
                            </button>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Repay Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={repayAmount}
                                        onChange={(e) => setRepayAmount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={repayLoan}
                                disabled={!isConnected || !repayAmount}
                                className={`w-full py-3 border-2 ${networkStyles.text} border-current rounded-lg disabled:opacity-50`}
                            >
                                Repay Loan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Risk Metrics */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">Risk Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Collateral Ratio</div>
                                <div className="text-2xl font-bold text-green-500">166%</div>
                                <div className="text-xs text-gray-500">Minimum: 150%</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Liquidation Price</div>
                                <div className="text-2xl font-bold">$0.00</div>
                                <div className="text-xs text-gray-500">Current: $0.00</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Health Factor</div>
                                <div className="text-2xl font-bold text-green-500">1.5</div>
                                <div className="text-xs text-gray-500">Safe 1.0</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Pool Statistics */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">Pool Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Total Deposits</div>
                                <div className="text-2xl font-bold">
                                    {poolInfo?.totalUsdtDeposits || '0.00'} USDT
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Total Borrowed</div>
                                <div className="text-2xl font-bold">
                                    {poolInfo?.totalUsdtBorrowed || '0.00'} USDT
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Total Collateral</div>
                                <div className="text-2xl font-bold">
                                    {poolInfo?.totalDogeCollateral || '0.00'} DOGE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update your Borrowing Card to show real-time calculations */}
                {/* <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                        <span>Collateral Value</span>
                        <span className="font-bold">
                            ${((borrowerInfo?.dogeCollateral || 0) * priceData.dogePrice).toFixed(2)} USDT
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Available to Borrow</span>
                        <span className="font-bold">
                            ${calculateBorrowLimit(borrowerInfo?.dogeCollateral || 0).toFixed(2)} USDT
                        </span>
                    </div>
                </div> */}
            </main>
        </div>
    )
}


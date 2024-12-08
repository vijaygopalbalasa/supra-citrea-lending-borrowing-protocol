'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Shield, PieChart, ArrowUpRight, ArrowDownRight, Wallet, RefreshCcw, ArrowLeftRight } from 'lucide-react'
import { ContractService } from '@/utils/contract'
import { ethers } from 'ethers'

declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function CitreaDashboard() {
    const [isConnected, setIsConnected] = useState(false)
    const [address, setAddress] = useState('')
    const [contractService, setContractService] = useState<ContractService | null>(null)
    const [depositAmount, setDepositAmount] = useState('')
    const [borrowAmount, setBorrowAmount] = useState('')
    const [repayAmount, setRepayAmount] = useState('')
    const [isDepositing, setIsDepositing] = useState(false)
    const [isBorrowing, setIsBorrowing] = useState(false)
    const [isRepaying, setIsRepaying] = useState(false)
    const [isDepositingCollateral, setIsDepositingCollateral] = useState(false)
    const [userData, setUserData] = useState({
        collateralAmount: '0',
        borrowedAmount: '0',
        stableDeposited: '0',
        collateralValue: '0'
    })
    const [platformStats, setPlatformStats] = useState({
        totalDeposits: '0',
        totalBorrowed: '0',
        availableLiquidity: '0',
        currentPrice: '0'
    })

    // Citrea-specific styles
    const networkStyles = {
        background: 'bg-orange-500',
        text: 'text-orange-500',
        lighter: 'bg-orange-50',
    }

    const fetchAllData = async (userAddress: string) => {
        if (!contractService) return;

        try {
            const [userData, platformStats] = await Promise.all([
                contractService.getUserData(userAddress),
                contractService.getPlatformStats()
            ]);

            setUserData(userData);
            setPlatformStats(platformStats);

            console.log('Updated User Data:', userData);
            console.log('Updated Platform Stats:', platformStats);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to use this application');
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                setAddress(userAddress);
                setIsConnected(true);

                const provider = new ethers.BrowserProvider(window.ethereum);
                const service = new ContractService();
                await service.setProvider(provider);
                setContractService(service);

                await fetchAllData(userAddress);
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    }

    const handleDeposit = async () => {
        if (!contractService || !depositAmount) return;

        setIsDepositing(true);
        try {
            const tx = await contractService.depositStable(depositAmount);
            await tx.wait();
            await fetchAllData(address);
            setDepositAmount('');
            alert('Deposit successful!');
        } catch (error) {
            console.error('Error depositing:', error);
            alert('Failed to deposit. Please try again.');
        } finally {
            setIsDepositing(false);
        }
    }

    const handleBorrow = async () => {
        if (!contractService || !borrowAmount) return;

        setIsBorrowing(true);
        try {
            const tx = await contractService.borrowStablecoins(borrowAmount);
            await tx.wait();
            await fetchAllData(address);
            setBorrowAmount('');
            alert('Borrow successful!');
        } catch (error) {
            console.error('Error borrowing:', error);
            alert('Failed to borrow. Please try again.');
        } finally {
            setIsBorrowing(false);
        }
    }

    const handleRepay = async () => {
        if (!contractService || !repayAmount) return;

        setIsRepaying(true);
        try {
            const tx = await contractService.repayLoan(repayAmount);
            await tx.wait();
            await fetchAllData(address);
            setRepayAmount('');
            alert('Repayment successful!');
        } catch (error) {
            console.error('Error repaying loan:', error);
            alert('Failed to repay loan. Please try again.');
        } finally {
            setIsRepaying(false);
        }
    }

    const handleDepositCollateral = async () => {
        if (!contractService || !borrowAmount) return;

        setIsDepositingCollateral(true);
        try {
            const tx = await contractService.depositCollateral(borrowAmount);
            await tx.wait();
            await fetchAllData(address);
            setBorrowAmount('');
            alert('Collateral deposited successfully!');
        } catch (error) {
            console.error('Error depositing collateral:', error);
            alert('Failed to deposit collateral. Please try again.');
        } finally {
            setIsDepositingCollateral(false);
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    await fetchAllData(accounts[0]);
                } else {
                    setAddress('');
                    setIsConnected(false);
                }
            });

            window.ethereum.on('chainChanged', (_chainId: string) => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => { });
                window.ethereum.removeListener('chainChanged', () => { });
            }
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isConnected && address) {
            interval = setInterval(() => {
                fetchAllData(address);
            }, 10000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isConnected, address]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="px-4 py-2 rounded-lg bg-orange-500 text-white">
                                Citrea Network
                            </div>
                        </div>
                        <button
                            onClick={connectWallet}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${networkStyles.background} text-white`}
                        >
                            <Wallet className="h-4 w-4" />
                            <span>{isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Deposits", value: `$${Number(platformStats.totalDeposits).toFixed(2)}`, icon: DollarSign },
                        { title: "Total Borrowed", value: `$${Number(platformStats.totalBorrowed).toFixed(2)}`, icon: ArrowDownRight },
                        { title: "Available to Borrow", value: `$${Number(platformStats.availableLiquidity).toFixed(2)}`, icon: ArrowUpRight },
                        {
                            title: "Health Factor",
                            value: userData.collateralValue !== '0' ?
                                (Number(userData.collateralValue) / Number(userData.borrowedAmount)).toFixed(2) : '0.00',
                            icon: PieChart
                        }
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
                                    <span className="font-bold">{Number(userData.stableDeposited).toFixed(2)} USDT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Earned Interest</span>
                                    <span className="text-green-500 font-bold">+0.00 USDT</span>
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
                                    <button className="absolute right-2 top-2 px-2 py-1 text-sm bg-gray-100 rounded">
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleDeposit}
                                disabled={!isConnected || isDepositing}
                                className={`w-full py-3 ${networkStyles.background} text-white rounded-lg
                                    ${(!isConnected || isDepositing) && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {isDepositing ? 'Depositing...' : 'Deposit USDT'}
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
                                    <span className="font-bold">{Number(userData.collateralAmount).toFixed(8)} wBTC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Available to Borrow</span>
                                    <span className="font-bold">{Number(platformStats.availableLiquidity).toFixed(2)} USDT</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>Current Borrowed</span>
                                    <span className="font-bold">{Number(userData.borrowedAmount).toFixed(2)} USDT</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Borrow/Repay
                                </label>
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={borrowAmount}
                                        onChange={(e) => setBorrowAmount(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                    />
                                    <button className="absolute right-2 top-2 px-2 py-1 text-sm bg-gray-100 rounded">
                                        MAX
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleDepositCollateral}
                                    disabled={!isConnected || isDepositingCollateral}
                                    className={`w-full py-3 mb-2 border-2 ${networkStyles.text} border-current rounded-lg
                                        ${(!isConnected || isDepositingCollateral) && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    {isDepositingCollateral ? 'Depositing...' : 'Deposit Collateral'}
                                </button>

                                <div className="grid gap-4">
                                    <button
                                        onClick={handleBorrow}
                                        disabled={!isConnected || isBorrowing}
                                        className={`w-full py-3 ${networkStyles.background} text-white rounded-lg
                                            ${(!isConnected || isBorrowing) && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        {isBorrowing ? 'Borrowing...' : 'Borrow'}
                                    </button>

                                </div>
                            </div>
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
                                <div className="text-2xl font-bold">${Number(platformStats.currentPrice).toFixed(2)}</div>
                                <div className="text-xs text-gray-500">Current: ${Number(platformStats.currentPrice).toFixed(2)}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Health Factor</div>
                                <div className="text-2xl font-bold text-green-500">1.5</div>
                                <div className="text-xs text-gray-500">Safe 1.0</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Loan Status */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6">Current Loan Status</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Total Borrowed</span>
                                    <span className="font-bold">{Number(userData.borrowedAmount).toFixed(2)} USDT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Available Credit</span>
                                    <span className="font-bold text-green-500">
                                        {Number(platformStats.availableLiquidity).toFixed(2)} USDT
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Interest Rate</span>
                                    <span className="font-bold">8% APR</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Interest Accrued</span>
                                    <span className="font-bold text-orange-500">+0.00 USDT</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <label className="block text-sm font-medium mb-2">
                                    Amount to Repay
                                </label>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={repayAmount}
                                    onChange={(e) => setRepayAmount(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-gray-200"
                                />
                                <button
                                    onClick={() => setRepayAmount(userData.borrowedAmount)}
                                    className="absolute right-2 top-9 px-2 py-1 text-sm bg-gray-100 rounded">
                                    MAX
                                </button>
                            </div>

                            <button
                                onClick={handleRepay}
                                disabled={!isConnected || isRepaying || Number(userData.borrowedAmount) <= 0}
                                className={`w-full mt-4 py-3 bg-green-500 text-white rounded-lg
                                    ${(!isConnected || isRepaying || Number(userData.borrowedAmount) <= 0) && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {isRepaying ? 'Repaying Loan...' : 'Repay Loan'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
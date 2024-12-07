'use client'

import { motion } from 'framer-motion'
import { Twitter, Github } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <div className="font-bold text-xl text-red-600 mb-4">🧀 Cheesecake Finance</div>
                        <p className="text-gray-600">The sweetest DeFi protocol on Supra and Citrea</p>
                    </div>

                    {/* Protocol */}
                    <div className="col-span-1">
                        <h3 className="font-bold mb-4">Protocol</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Stats</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Analytics</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    {/* Governance */}
                    <div className="col-span-1">
                        <h3 className="font-bold mb-4">Governance</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Forum</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Snapshot</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Treasury</a></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="col-span-1">
                        <h3 className="font-bold mb-4">Community</h3>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="p-2 bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600">© 2024 Cheesecake Finance. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Terms</a>
                            <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Privacy</a>
                            <a href="#" className="text-gray-600 hover:text-red-600 transition-colors">Security</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
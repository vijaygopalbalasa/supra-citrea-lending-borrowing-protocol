export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="dashboard-layout">
            {/* You can add any dashboard-specific layout elements here */}
            {children}
        </div>
    )
}


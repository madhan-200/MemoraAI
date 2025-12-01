
const StatItem = ({ icon, label, value }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark-300 text-sm">
            {icon}
            <span>{label}</span>
        </div>
        <span className="font-semibold text-primary-400">{value}</span>
    </div>
);

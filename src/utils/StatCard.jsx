export default function StatCard({ title, value, color }) {
return (
    <div className={`p-6 rounded shadow text-white ${color}`}>
    <h3 className="text-lg">{title}</h3>
    <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
);
}
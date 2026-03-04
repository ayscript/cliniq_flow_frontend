const STATUS_STYLES = {
  "Awaiting Triage": "bg-orange-500 text-white",
  "Seen": "bg-green-500 text-white",
  "In Cons": "bg-blue-500 text-white",
  "Awaiting Cons": "bg-yellow-500 text-white",
  "Awaiting Authorization": "bg-purple-500 text-white",
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      STATUS_STYLES[status] || "bg-gray-500 text-white"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;

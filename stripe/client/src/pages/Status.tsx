import { useEffect, useState } from "react";

interface StatusData {
  sessionId: string;
  customerEmail: string;
  status: string;
  createdAt: string;
}

const Status: React.FC = () => {
  const [data, setData] = useState<Record<string, StatusData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/status");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Status</h1>
      <ul className="space-y-4 w-full max-w-2xl">
        {Object.values(data).map((item) => (
          <li
            key={item.sessionId}
            className="p-4 bg-white rounded shadow w-full h-32 overflow-x-auto overflow-hidden"
          >
            <h2 className="text-sm font-bold">
              Session ID: {item.sessionId}
            </h2>
            <p>Email: {item.customerEmail}</p>
            <p>Status: {item.status}</p>
            <p>Created At: {new Date(item.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Status;

import React, { useEffect, useState } from "react";
import "./Log.css";

interface User {
  email: string;
  username?: string;
}

interface ActivityLog {
  _id: string;
  userId: User;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

const ActivityLogPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token"); // or use context
      const res = await fetch("https://localhost:5000/api/activity-log", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch logs");
      }

      setLogs(data.logs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="activity-log-container">
      <h2>Activity Logs</h2>

      {loading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <div className="activity-log-list">
          {logs.map((log) => (
            <div className="activity-log-card" key={log._id} title="Click for details">
              <div><strong>User:</strong> {log.userId?.email || "Unknown"}</div>
              <div><strong>Action:</strong> {log.action}</div>
              <div>
                <strong>Details:</strong>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {Object.entries(log.details).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
              <div><strong>IP:</strong> {log.ipAddress}</div>
              <div><strong>User Agent:</strong> {log.userAgent}</div>
              <div><strong>Time:</strong> {new Date(log.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLogPage;

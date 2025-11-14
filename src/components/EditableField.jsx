"use client"
import { useState, useRef, useEffect } from 'react';
import API from '../services/api'; // Adjust import if needed

const EditableField = ({ label, name, value, onChange, loggedInUsername }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const inputRef = useRef();

  const handleEdit = () => {
    setTempValue(value);
    setEditing(true);
    setAvailabilityMsg("");
    setIsAvailable(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = () => {
    if (!isAvailable) return;
    setEditing(false);
    onChange(name, tempValue);
  };

  const handleCancel = () => {
    setEditing(false);
    setTempValue(value);
    setAvailabilityMsg("");
    setIsAvailable(true);
  };

  useEffect(() => {
    if (name !== "username" || !editing) return;

    const trimmed = tempValue.trim();

    if (trimmed === loggedInUsername) {
      setAvailabilityMsg("");
      setIsAvailable(true);
      return;
    }

    if (!trimmed) {
      setAvailabilityMsg("Username is required.");
      setIsAvailable(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await API.post(`/user/checkusername?username=${trimmed}`);
        if (res.data.success) {
          setAvailabilityMsg(res.data.message);
          setIsAvailable(true);
        }
      } catch (err) {
        setAvailabilityMsg(err.response?.data?.message || "Username not available");
        setIsAvailable(false);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [tempValue, editing, name, loggedInUsername]);

  return (
    <div className="w-full bg-gray-900 text-white p-3 rounded-md shadow-sm">
      <label className="block text-sm font-semibold mb-1">{label}:</label>

      {editing ? (
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            className="flex-1 w-full sm:max-w-md px-2 py-1 rounded text-sm border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={handleSave}
              disabled={!isAvailable}
              className={`px-3 py-1 bg-blue-600  text-white rounded text-sm ${!isAvailable ? "opacity-50 cursor-not-allowed" : " hover:bg-blue-700"}`}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-gray-300 bg-gray-700 rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>

          {name === "username" && (
            <p className={`text-xs mt-1 ${isAvailable ? "text-green-500" : "text-red-500"}`}>
              {checking ? "Checking..." : availabilityMsg}
            </p>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-sm">{value || '—'}</p>
          <button onClick={handleEdit} className="text-blue-500 text-sm px-2 py-1 hover:underline">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
